const express = require("express");
const Router = express.Router();
const {foodPartnerMiddleware,authUserMiddleware} = require("../Middlewares/Auth.middleware")
const foodControllers = require("../Controllers/food.controller")
const multer = require("multer");

const upload = multer({
    storage : multer.memoryStorage(),
})


Router.post("/create",foodPartnerMiddleware,upload.single("videos"),foodControllers.createFood);
Router.get("/fetch",authUserMiddleware,foodControllers.getFoodItems);
Router.post('/like',authUserMiddleware,foodControllers.likeFood)
Router.post('/save',authUserMiddleware,foodControllers.saveFood)
Router.get('/saved',authUserMiddleware,foodControllers.getSaveFood)


module.exports = Router;