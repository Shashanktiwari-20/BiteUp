const express = require("express");
const Router = express.Router();
const userRegisterValidationRule = require("../Middlewares/validation.middleware");
const AuthController = require("../Controllers/Auth.controller");

Router.post("/user/register",userRegisterValidationRule.userRegisterValidationRule,AuthController.registerUser);
Router.post("/user/resendotp",AuthController.resendOtp);
Router.post("/user/verifyUser",AuthController.verifyRegisterUser);
Router.post("/user/completeRegistration",AuthController.completeRegistration);

Router.post("/user/login",AuthController.loginUser);
Router.post("/user/rotateToken",AuthController.refreshTokenController);
Router.post("/user/logout",AuthController.Logout);
Router.post("/user/logoutAll",AuthController.LogoutAll);

Router.post("/foodpartner/register",AuthController.foodPartnerRegister);
Router.post("/foodpartner/resendotp",AuthController.resendOtp);
Router.post("/foodpartner/verifyfoodPartner",AuthController.verifyRegisterUser);
Router.post("/foodpartner/completeRegistration",AuthController.completefoodPartnerRegistration);

Router.post("/foodpartner/login",AuthController.loginfoodPartner);
Router.post("/foodpartner/rotateToken",AuthController.refreshTokenController);
Router.post("/foodpartner/logout",AuthController.Logout);
Router.post("/foodpartner/logoutAll",AuthController.LogoutAll);

module.exports = Router;