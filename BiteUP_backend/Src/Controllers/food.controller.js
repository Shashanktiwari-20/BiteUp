const foodModel = require("../Models/food.model");
const {v4: uuid} = require("uuid");
const storageServices = require("../Services/storage.services");
const likeModel = require("../Models/likes.model");
const saveModel = require("../Models/save.model");


const createFood = async (req,res) => {
    try{
        const fileuploadResult = await storageServices.uploadfile(req.file.buffer,uuid());
        const foodItem = await foodModel.create({
            name : req.body.name,
            video : fileuploadResult.url,
            description : req.body.description,
            foodPartner : req.foodPartner._id
        })
        return res.status(201).json({
            message : "food item created successfully",
            food : foodItem
        })
    }catch(error){
        return res.status(500).json({
            message : error.message
        })
    }
}

const getFoodItems = async (req,res) => {
    try{
        const fooditems = await foodModel.find({})
        return res.status(200).json({
            message : "food items fetched successfully",
            fooditems
        })
    }catch(error){
        return res.status(500).json({
            message : error.message
        })
    }
}

const likeFood = async (req, res) => {
    try{
        const { foodId } = req.body;
        const user = req.user;

        const isAlreadyLiked = await likeModel.findOne({
            user: user._id,
            food: foodId
        })

        if (isAlreadyLiked) {
            await likeModel.deleteOne({
                user: user._id,
                food: foodId
            })

            await foodModel.findByIdAndUpdate(foodId, {
                $inc: { likeCount: -1 }
            })

            return res.status(200).json({
                message: "Food unliked successfully"
            })
        }

        const like = await likeModel.create({
            user: user._id,
            food: foodId
        })

        await foodModel.findByIdAndUpdate(foodId, {
            $inc: { likeCount: 1 }
        })

        return res.status(201).json({
            message: "Food liked successfully",
            like
        })

    }catch(error){
        return res.status(500).json({
            message : error.message
        })
    }
}

const saveFood = async (req, res) => {

    try{
        const { foodId } = req.body;
        const user = req.user;

        const isAlreadySaved = await saveModel.findOne({
            user: user._id,
            food: foodId
        })

        if (isAlreadySaved) {
            await saveModel.deleteOne({
                user: user._id,
                food: foodId
            })

            await foodModel.findByIdAndUpdate(foodId, {
                $inc: { savesCount: -1 }
            })

            return res.status(200).json({
                message: "Food unsaved successfully"
            })
        }

        const save = await saveModel.create({
            user: user._id,
            food: foodId
        })

        await foodModel.findByIdAndUpdate(foodId, {
            $inc: { savesCount: 1 }
        })

        return res.status(201).json({
            message: "Food saved successfully",
            save
        })

    }catch(error){
        return res.status(500).json({
            message : error.message
        })
    }
}

const getSaveFood = async (req, res) => {

    try{
        const user = req.user;
        const savedFoods = await saveModel.find({ user: user._id }).populate('food');

        if (!savedFoods || savedFoods.length === 0) {
            return res.status(404).json({ message: "No saved foods found" });
        }

        return res.status(200).json({
            message: "Saved foods retrieved successfully",
            savedFoods
        });
    }catch(error){
        return res.status(500).json({
            message : error.message
        })
    }

}


module.exports = {createFood,getFoodItems,likeFood,saveFood,getSaveFood}