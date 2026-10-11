require("dotenv").config();
const App = require("./Src/App");
const connectDB = require("./Src/Config/DB")

connectDB();

App.listen(3000,()=>{
    console.log("server is running on port 3000");
})