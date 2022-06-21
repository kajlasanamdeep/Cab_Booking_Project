  const joi = require('joi');

const validateLogin = (req)=> {
        let UserLoginSchema = joi.object({
            email:joi.string().required(),
            password: joi.string().required(),
        });
        return UserLoginSchema.validate(req.body);
};
const validateRegister = (req) => {
    let UserRegistrationSchema = joi.object({
        firstName:joi.string().optional(),
        lastName:joi.string().optional(),
        phoneNo:joi.string().min(5).required(),
        countryCode:joi.string().min(2).required(),
        email: joi.string().required(),
        userType:joi.string().valid("USER","DRIVER").required(),
        password: joi.string().required()
    });
    return UserRegistrationSchema.validate(req.body);
};
const validateForgotPassword = (req) => {
    let forgotPasswordSchema = joi.object().keys({
        email: joi.string().required()
    });
    return forgotPasswordSchema.validate(req.body);
};
const validateResetPassword = (req) =>{
    let resetPasswordSchema = joi.object({
        New_Password: joi.string().required()
    });
    return resetPasswordSchema.validate(req.body);
}
module.exports = {
    validateLogin:validateLogin,
    validateRegister:validateRegister,
    validateForgotPassword:validateForgotPassword,
    validateResetPassword:validateResetPassword
}