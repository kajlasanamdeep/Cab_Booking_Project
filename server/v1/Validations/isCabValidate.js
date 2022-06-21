const joi = require('joi');

const validateRegister = (req)=>{
    let CabRegistrationSchema = joi.object({
        cabName: joi.string().required(),
        cabModel: joi.string().required(),
        cabChassiNumber: joi.string().required(),
        cabNumberPlate: joi.string().required(),
        cabRentPerMeter: joi.string().required(),
        cabRentPerKiloMeter: joi.string().required(),
        maxPassengers: joi.number().required(),
        cabType: joi.string().required(),
        cabDescription: joi.string().optional()
    });

    return CabRegistrationSchema.validate(req.body);
}



module.exports = {
    validateRegister:validateRegister
}