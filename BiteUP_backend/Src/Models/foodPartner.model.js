const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const foodPartnerSchema = new mongoose.Schema({
    username : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true,
    },
    isVerified : {
        type : Boolean,
        default : false
    }
},{
    timestamps : true
})

foodPartnerSchema.pre("save", async function(){
   if(!this.isModified("password")){
        return;
   } 

   const isAlreadyHashed = /^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/.test(this.password);
   if(isAlreadyHashed){
        return;
   }

   const hash = await bcrypt.hash(this.password, 10);
   this.password = hash;
})

foodPartnerSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password,this.password);
}

const foodPartnerModel = mongoose.model("foodPartners",foodPartnerSchema);
module.exports = foodPartnerModel;