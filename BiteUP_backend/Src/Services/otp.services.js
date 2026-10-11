const {otpGenerator,getOtpHtml} = require("../Utils/utils");
const otpModel = require("../Models/otp.model");
const crypto = require("crypto");
const {sendEmail} = require("../Services/email.services");
const pendingRegistrationModel = require("../Models/pendingRegistration.model");

const generateAndSendOtp = async (email,registrationId) => {
    const otp = otpGenerator();
    const Html = getOtpHtml(otp);
    const otpHash = await crypto.createHash("sha256").update(String(otp)).digest("hex");

    await otpModel.deleteMany({registrationId});

    const expiresAt = new Date(Date.now() + 5*60*1000);

    await otpModel.create({
        email,
        registrationId,
        otpHash,
        expiresAt
    });

    await sendEmail(email,"BiteUp Email verification Code",`your verification code is ${otp}`,Html);
};

const verifyOtp = async (registrationId,otp) => {
    const otpHash = await crypto.createHash("sha256").update(String(otp)).digest("hex");

    const otpDoc = await otpModel.findOne({registrationId,otpHash});
    if(!otpDoc) {
        throw new Error("INVALID_OTP");
    }
    if(Date.now() > new Date(otpDoc.expiresAt).getTime()){
        await otpModel.deleteOne({_id : otpDoc._id});
        throw new Error("OTP EXPIRED");
    }

    await otpModel.deleteOne({_id : otpDoc._id});
    return true;
};

module.exports = {generateAndSendOtp,verifyOtp}
