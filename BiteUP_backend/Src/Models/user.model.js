const mongoose = require("mongoose");
const bcrypt = require("bcryptjs")

const userSchema = new mongoose.Schema({
    username : {
        type: String,
        required : [true,"username is required"]
    },
    email : {
        type : String,
        trim : true,
        required : [true,"email is required"],
        unique : [true,"email must be unique"],
        lowercase : true
    },
    password : {
        type : String,
        required : [true, "password is required"],
        minlength : [6,"password must be at least 6 characters"]
    },
    isVerified : {
        type : Boolean,
        default : false
    }
},{
    timestamps : true
})

userSchema.pre("save",async function(){
    if(!this.isModified("password")){
        return;
    }

    const isAlreadyHashed = /^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/.test(this.password);
    if(isAlreadyHashed){
        return;
    }

    const hash = await bcrypt.hash(this.password,10)
    this.password = hash;

});

userSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password,this.password)
};

const userModel = mongoose.model("users",userSchema);
module.exports = userModel;