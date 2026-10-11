const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    video : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    foodPartner : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "foodPartners",
        required : true
    },
    likeCount : {
        type : Number,
        default : 0
    },
    savesCount : {
        type : Number,
        default : 0
    },
})

const foodModel = mongoose.model("foods",foodSchema);
module.exports = foodModel;