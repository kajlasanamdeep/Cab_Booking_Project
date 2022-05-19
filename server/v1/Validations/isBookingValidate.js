const joi = require('joi');

const validateRegister = (req)=>{
    let BookingRegistrationSchema = joi.object({
        customerName: joi.string().required(),
        bookingDate: joi.string().required(),
        cabType: joi.string().required(),
        totalPassengers: joi.number().required(),
        pickupAddressName: joi.string().required(),
        destinationAddressName: joi.string().required()
    });

    return BookingRegistrationSchema.validate(req.body);
}

const validateBooking = (req)=>{
    let AcceptBookingSchema = joi.object({
        BookingID: joi.string().required()
    });

    return AcceptBookingSchema.validate(req.body);
}

module.exports = {
    validateRegister:validateRegister,
    validateBooking:validateBooking
}