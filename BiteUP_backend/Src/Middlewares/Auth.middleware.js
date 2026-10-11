const foodPartnerModel = require("../Models/foodPartner.model");
const userModel = require("../Models/user.model");
const jwt = require("jsonwebtoken");
const config = require("../Config/config");

const foodPartnerMiddleware = async (req,res,next) => {
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken){
        return res.status(401).json({
            message : "please login first"
        })
    }
    try{
        const decoded = jwt.verify(refreshToken,config.JWT_SECRET)
        const foodPartner = await foodPartnerModel.findById(decoded.userId);
        req.foodPartner = foodPartner
        next()
    }catch(error){
        return res.status(401).json({
            message : "invalid token"
        })
    }
}

const authUserMiddleware = async (req,res,next) => {
    const refreshToken = req.cookies.refreshToken;

    if(!refreshToken){
        return res.status(401).json({
            message : "please login first"
        })
    }

    try{
        const decoded = jwt.verify(refreshToken,config.JWT_SECRET);
        const user = await userModel.findById(decoded.userId)
        req.user = user
        next()
    }catch(error){
        return res.status(401).json({
            message : "Invalid token"
        })
    }
}

module.exports = {foodPartnerMiddleware,authUserMiddleware};