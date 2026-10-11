const config = require("./config");
const mongoose = require("mongoose");

const connectDB = async ()=>{
    await mongoose.connect(`${config.MONGO_URI}`)
    .then(()=>{
        console.log("connected to DataBase");
    })
    .catch((error)=>{
        console.log(error)
    })
}

module.exports = connectDB