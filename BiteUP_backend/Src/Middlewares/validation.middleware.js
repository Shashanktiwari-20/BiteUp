const {body,validationResult} = require("express-validator");

const ValidateResult = async (req,res,next) => {
    const error = validationResult(req)

    if(!error.isEmpty()) {
        return res.status(400).json({
            message : error.array().map((error)=> error.msg)
        })
    }

    next();
}

const userRegisterValidationRule = [
    body("username")
    .notEmpty()
    .trim()
    .withMessage("username can not be empty")
    .isString()
    .withMessage("the user must be a string")
    .isLength({min:3,max:20})
    .withMessage("the username must be 3 to 20 characters"),

    body("email")
    .isEmail()
    .withMessage("email must be a valid emailID")
    .notEmpty()
    .trim()
    .withMessage("email cant be empty"),

    body("password")
    .notEmpty()
    .isString()
    .trim()
    .withMessage("password cannot be empty")
    .isLength({min:6})
    .withMessage("password must be at least 6 characters long"),

    ValidateResult
]

module.exports = {userRegisterValidationRule,ValidateResult}