const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const pendingRegistrationSchema = new mongoose.Schema({
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
    passwordHash : {
        type : String,
        required : [true, "password is required"],
    },
    isVerified : {
        type : Boolean,
        default : false
    }
},{
    timestamps : true
})

pendingRegistrationSchema.pre("save", async function () {
  if (!this.isModified("passwordHash")) {
    return;
  }
  const hash = await bcrypt.hash(this.passwordHash, 10);
  this.passwordHash = hash;
});

const pendingRegistrationModel = mongoose.model("pendingRegistration", pendingRegistrationSchema);
module.exports = pendingRegistrationModel;