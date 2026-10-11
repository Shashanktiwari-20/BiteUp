const express = require("express")
const Router = express.Router();
const {authUserMiddleware} = require("../Middlewares/Auth.middleware");
const {getfoodPartnerById} = require("../Controllers/foodPartner.controller");

Router.get("/:id",authUserMiddleware,getfoodPartnerById);

module.exports = Router