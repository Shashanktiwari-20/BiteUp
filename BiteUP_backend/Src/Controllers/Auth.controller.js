const express = require("express");
const otpModel = require("../Models/otp.model");
const pendingRegistrationModel = require("../Models/pendingRegistration.model");
const userModel = require("../Models/user.model");
const {generateAndSendOtp,verifyOtp} = require("../Services/otp.services");
const {sendEmail,registrationSucessEmail} = require("../Services/email.services");
const {createTokenAndSession,rotateToken,revokeSession,revokeAllSession} = require("../Services/token.services")
const foodPartnerModel = require("../Models/foodPartner.model");


const Cookie_options = {
    httpOnly : true,
    secure : process.env.NODE_ENV === "production",
    sameSite : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000
}

const registerUser = async (req,res) => {
    try{
        const {username,email,password} = req.body

        if(!username || !email || !password){
            return res.status(400).json({
                message : "username, email , password are required"
            })
        }

        const isExist = await userModel.findOne({email});

        if(isExist){
            return res.status(400).json({
                message : "user already exists"
            })
        }
        let pending = await pendingRegistrationModel.findOne({email})
        if(pending){
            pending.username = username;
            pending.email = email;
            pending.passwordHash = password;
            pending.isVerified = false;
            await pending.save();
        }
        else {
            pending = await pendingRegistrationModel.create({
                username,
                email,
                passwordHash:password,
                isVerified: false
            });
        }

        await generateAndSendOtp(email,pending._id);

        return res.status(201).json({
            message : "verification code sent. please verify your Email",
            registrationId: pending._id
        })

    }catch(error){
        return res.status(500).json({
            message : error.message
        })
    }
}

const resendOtp = async (req,res) => {
    try{
        const {registrationId,email} = req.body;
        const query = registrationId ? { _id: registrationId } : { email };
        const pendingUser = await pendingRegistrationModel.findOne(query);
        
        if(!pendingUser){
            return res.status(404).json({
                message : "No pending registration found for this account"
            })
        }
        if(pendingUser.isVerified){
            return res.status(400).json({
                message : "the user is already verified. please complete the registration"
            })
        }

        await generateAndSendOtp(pendingUser.email,pendingUser._id);

        return res.status(200).json({
            message : "A new verification code has been sent to your email",
            registrationId: pendingUser._id
        })
        
    }catch(error){
        return res.status(500).json({
            message : error.message
        })
    }
}

const verifyRegisterUser = async (req,res) => {
    try{
        const {registrationId,otp} = req.body

    if(!registrationId || !otp){
        return res.status(400).json({
            message : "registrationId and otp are required "
        })
    }
    const pendingUser = await pendingRegistrationModel.findById(registrationId);
    if(!pendingUser){
        return res.status(404).json({
            message : "Registration request not found or expired"
        })
    }
    await verifyOtp(pendingUser._id,otp);

    pendingUser.isVerified = true;
    await pendingUser.save();

    return res.status(200).json({
        message : "Email verified successfully.",
        registrationId: pendingUser._id,
        isverified: true
    })
    }catch(error){
        if (error.message === "INVALID_OTP") {
            return res.status(422).json({ message: "Invalid OTP code provided." });
        }
        if (error.message === "OTP_EXPIRED") {
            return res.status(410).json({ message: "OTP has expired. Please request a new code." });
        }
            return res.status(500).json({ message: error.message });
        }
}

const completeRegistration = async (req,res) => {
    try{
        const {registrationId} = req.body;

        if(!registrationId){
            return res.status(404).json({
                message : "registrationID is required"
            })
        }

        const pendingUser = await pendingRegistrationModel.findById(registrationId);
        if (!pendingUser) {
            return res.status(404).json({ message: "Registration session not found or expired." });
        }

        if (!pendingUser.isVerified) {
            return res.status(403).json({ message: "Email has not been verified yet." });
        }

        const userAlreadyExists = await userModel.findOne({ email: pendingUser.email });
        if (userAlreadyExists) {
            await pendingRegistrationModel.findByIdAndDelete(pendingUser._id);
            return res.status(409).json({ message: "An account with this email already exists." });
        }

        const newUser = await userModel.create({
            username : pendingUser.username,
            email : pendingUser.email,
            password : pendingUser.passwordHash,
            isVerified : true
        })
        await pendingRegistrationModel.findByIdAndDelete(pendingUser._id);

        return res.status(201).json({
          message: "Registration completed successfully. Please sign in.",
          user: {
            id: newUser._id,
            username: newUser.username,
            email: newUser.email
          }
        });
    }catch(error){
        return res.status(500).json({
            message : error.message
        })
    }
}

const loginUser = async (req,res) => {
    try{
        const {email,password} = req.body;
        if(!email || !password) {
            return res.status(401).json({
                message : "email and password are required"
            })
        }

        const user = await userModel.findOne({email}).select("+password");
        if(!user){
            return res.status(400).json({
                message : "user not found"
            })
        }

        const decoded = await user.comparePassword(password);
        if(!decoded){
            return res.status(401).json({
                message : "Invalid credentials"
            })
        }

        const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "Unknown IP";
        const userAgent = req.headers["user-agent"] || "Unknown Device";

        const {AccessToken,refreshToken} = await createTokenAndSession(user,ip,userAgent);
        res.cookie("refreshToken",refreshToken,Cookie_options);
        
        return res.status(200).json({
            message: "Login successfull",
            AccessToken : AccessToken,
            user: {
              id: user._id,
              username: user.username,
              email: user.email
            },
        })
    }catch(error){
        return res.status(500).json({
            message : error.message
        })
    }
}

const refreshTokenController = async (req,res) => {
    try{
        const incomingRefreshToken = req.cookies.refreshToken;
        if(!incomingRefreshToken){
            return res.status(401).json({
                message : "refresh Token does not exist"
            })
        }

        const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "unknown IP";
        const userAgent = req.headers["user-agent"] || "unknown Device";

        const { AccessToken, refreshToken, user } = await rotateToken(incomingRefreshToken,ip,userAgent);
        res.cookie("refreshToken",refreshToken,Cookie_options);

        return res.status(200).json({
            AccessToken,
            user: {
              id: user._id,
              username: user.username,
              email: user.email
            }
        })
    }catch(error){
        res.clearCookie("refreshToken", Cookie_options);
        return res.status(500).json({
            message : error.message
        })
    }
}

const Logout = async (req,res) => {
    try{
        const incomingRefreshToken = req.cookies.refreshToken || req.headers.authorization?.split(" ")[1] ;
        if(incomingRefreshToken){
            await revokeSession(incomingRefreshToken);
        }
        res.clearCookie("refreshToken",Cookie_options);
        return res.status(200).json({
            message : "Logged out successfully"
        })
    }catch(error){
        return res.status(500).json({
            message : error.message
        })
    }
}

const LogoutAll = async (req,res) => {
    try{
        const incomingRefreshToken = req.cookies.refreshToken || req.headers.authorization?.split(" ")[1]; 
        if(incomingRefreshToken){
            await revokeAllSession(incomingRefreshToken);
        }
        res.clearCookie("refreshToken",Cookie_options);
        return res.status(200).json({
            message : "logged out from all the devices"
        })
    }catch(error){
        return res.status(500).json({
            message : error.message
        })
    }
}

const foodPartnerRegister = async (req,res) => {
    try{
         const {username,email,password} = req.body;

         if(!username || !email || !password){
             return res.status(400).json({
                 message : "username , email and password are required for registration"
             })
         }
     
         const isExist = await foodPartnerModel.findOne({email});
         if(isExist){
             return res.status(400).json({
                 message : "food partner already exists"
             })
         }

        let pending = await pendingRegistrationModel.findOne({email})
        if(pending){
            pending.username = username;
            pending.email = email;
            pending.passwordHash = password;
            pending.isVerified = false;
            await pending.save();
        }
        else {
            pending = await pendingRegistrationModel.create({
                username,
                email,
                passwordHash:password,
                isVerified: false
            });
        }
        await generateAndSendOtp(email,pending._id);

        return res.status(201).json({
            message : "verification code sent. please verify your Email",
            registrationId: pending._id
        })
     
    }catch(error){
        return res.status(500).json({
            message : error.message
        })
    }

}

const completefoodPartnerRegistration = async (req,res) => {
    try{
        const {registrationId} = req.body;

        if(!registrationId){
            return res.status(404).json({
                message : "registrationID is required"
            })
        }

        const pendingUser = await pendingRegistrationModel.findById(registrationId);
        if (!pendingUser) {
            return res.status(404).json({ message: "Registration session not found or expired." });
        }

        if (!pendingUser.isVerified) {
            return res.status(403).json({ message: "Email has not been verified yet." });
        }

        const userAlreadyExists = await foodPartnerModel.findOne({ email: pendingUser.email });
        if (userAlreadyExists) {
            await pendingRegistrationModel.findByIdAndDelete(pendingUser._id);
            return res.status(409).json({ message: "An account with this email already exists." });
        }

        const newfoodPartner = await foodPartnerModel.create({
            username : pendingUser.username,
            email : pendingUser.email,
            password : pendingUser.passwordHash,
            isVerified : true
        })
        await pendingRegistrationModel.findByIdAndDelete(pendingUser._id);

        return res.status(201).json({
          message: "Registration completed successfully. Please sign in.",
          foodPartner: {
            id: newfoodPartner._id,
            username: newfoodPartner.username,
            email: newfoodPartner.email
          }
        });
    }catch(error){
        return res.status(500).json({
            message : error.message
        })
    }
}

const loginfoodPartner = async (req,res) => {
    try{
        const {email,password} = req.body;
        if(!email || !password) {
            return res.status(401).json({
                message : "email and password are required"
            })
        }

        const foodPartner = await foodPartnerModel.findOne({email}).select("+password");
        if(!foodPartner){
            return res.status(400).json({
                message : "foodPartner not found"
            })
        }

        const decoded = await foodPartner.comparePassword(password);
        if(!decoded){
            return res.status(401).json({
                message : "Invalid credentials"
            })
        }

        const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "Unknown IP";
        const userAgent = req.headers["user-agent"] || "Unknown Device";

        const {AccessToken,refreshToken} = await createTokenAndSession(foodPartner,ip,userAgent);
        res.cookie("refreshToken",refreshToken,Cookie_options);
        
        return res.status(200).json({
            message: "Login successfull",
            AccessToken : AccessToken,
            foodPartner: {
              id: foodPartner._id,
              username: foodPartner.username,
              email: foodPartner.email
            },
        })
    }catch(error){
        return res.status(500).json({
            message : error.message
        })
    }
}


module.exports = {registerUser,resendOtp,verifyRegisterUser,completeRegistration,loginUser,refreshTokenController,Logout,LogoutAll,foodPartnerRegister,completefoodPartnerRegistration,loginfoodPartner}