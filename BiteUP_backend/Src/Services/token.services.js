const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const sessionModel = require("../Models/session.model");
const config = require("../Config/config");

const createTokenAndSession = async (user,ip,Agent,) => {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const session = await sessionModel.create({
        userId : user._id,
        refreshTokenHash : "placeholder",
        ip : ip,
        userAgent : Agent,
        expiresAt : expiresAt
    })

    const AccessToken = jwt.sign({userId : user._id,email: user.email,name: user.name},config.JWT_SECRET,{expiresIn : '15m'});
    const refreshToken = jwt.sign({userId : user._id,sessionId : session._id},config.JWT_SECRET,{expiresIn : "7d"});
    session.refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");

    await session.save();

    return {AccessToken,refreshToken};
}

const rotateToken = async (incomingRefreshToken, ip, userAgent) => {
    let decoded;
    try{
        decoded = jwt.verify(incomingRefreshToken, config.JWT_SECRET);
    }catch(error){
         throw new Error(error.message)
    }

    const {sessionId} = decoded;
    if(!sessionId){
        throw new Error("invalid Token");
    }

    const session = await sessionModel.findById(sessionId);

    if(!session) {
        throw new Error("session not found");
    }
    if(session.revoked){
        throw new Error("session is revoked");
    }
    if(Date.now() >= new Date(session.expiresAt)){
        throw new Error("session has expired");
    }

    const incomingHash = crypto.createHash("sha256").update(incomingRefreshToken).digest("hex");

    const isMatch = crypto.timingSafeEqual(
        Buffer.from(incomingHash, "hex"),
        Buffer.from(session.refreshTokenHash, "hex")
    );

    if(!isMatch){
        session.revoked = true;
        await session.save();
        throw new Error("token refuse detected");
    }

     const newAccessToken = jwt.sign({ userId: session.userId._id, email: session.userId.email, name: session.userId.name},config.JWT_SECRET,{ expiresIn: "15m" });
     const newRefreshToken = jwt.sign({userId: session.userId._id,sessionId: session._id},config.JWT_SECRET,{ expiresIn: "7d" });

     session.refreshTokenHash = crypto.createHash("sha256").update(newRefreshToken).digest("hex");
     session.ip = ip;
     session.userAgent = userAgent;
     session.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
     await session.save();

     return {AccessToken: newAccessToken,refreshToken: newRefreshToken,user: session.userId};
};

const revokeSession = async (incomingRefreshToken) => {
  try {
    const decoded = jwt.decode(incomingRefreshToken);
    if (decoded?.sessionId) {
      await sessionModel.findByIdAndUpdate(decoded.sessionId, { revoked: true });
    }
  } catch (error) {
    console.warn("Session revocation warning during logout:", error.message);
  }
};

const revokeAllSession = async (incomingRefreshToken) => {
    try{
        const decoded = jwt.decode(incomingRefreshToken);
        if(decoded?.sessionId){
            await sessionModel.updateMany({user:decoded._id,revoked: false},{$set: {revoked : true}})
        }
    }catch(error){
        console.warn("Session revocation warning during logout:", error.message);
    }
}

module.exports = {createTokenAndSession,rotateToken,revokeSession,revokeAllSession}