const foodPartnerModel = require("../Models/foodPartner.model");
const foodModel = require("../Models/food.model");

const getfoodPartnerById = async (req,res) => {
   try{
        const foodPartnerId = req.params.id;
        const foodPartner = await foodPartnerModel.findById(foodPartnerId).select("-password");
        const foodItemsByfoodPartner = await foodModel.find({foodPartner : foodPartnerId});

        if(!foodPartner){
            return res.status(404).json({
                message : "food partner not found"
            })
        }

        return res.status(200).json({
            message : "food Partner retrieved successfully",
            foodPartner: {
                ...foodPartner.toObject(),
                foodItems: foodItemsByfoodPartner
            }
        })
   }catch(error){
    return res.status(500).json({
        message : error.message
    })
   }
}

module.exports = {getfoodPartnerById}