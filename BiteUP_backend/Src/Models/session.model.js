const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "users",
        required : [true, "user reference is required to create a session"]
    },
    refreshTokenHash : {
        type : String,
        required : [true, "refresh token hash is required to create a session"]
    },
    ip : {
        type : String,
        required : [true,"ip is required to create a session"]
    },
    userAgent: {
      type: String,
      required: [true, "User agent is required"]
    },
    revoked: {
      type: Boolean,
      default: false
    },
    expiresAt: {
      type: Date,
      required: true
    }
},{
    timestamps : true
})

sessionSchema.index({expiresAt : 1},{expireAfterSeconds : 0});

const sessionModel = mongoose.model("sessions",sessionSchema);
module.exports = sessionModel;