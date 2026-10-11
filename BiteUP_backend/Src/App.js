const express = require("express");
const App = express();
const authRouter = require("./Routes/Auth.routes");
const foodRouter = require("./Routes/food.routes");
const foodPartnerRouter = require("./Routes/foodPartner.routes");
const Cookieparser = require("cookie-parser");
const cors = require("cors");

App.use(express.json());
App.use(Cookieparser());
App.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

App.use("/api/auth",authRouter);
App.use("/api/food",foodRouter);
App.use("/api/foodPartner",foodPartnerRouter);

App.use((err, req, res, next) => {
    const status = err.name === "MulterError" ? 400 : (err.status || 500);
    return res.status(status).json({
        message : err.message || "Something went wrong"
    });
});


module.exports = App