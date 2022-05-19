const Model = require('../../models/index');
const Service = require('../../services/index');
const Validation = require('../Validations/index');
const universalFunction = require('../../lib/universal-function');
const statusCodeList = require("../../statusCodes");
const messageList = require("../../messages");
const { default: mongoose } = require('mongoose');
const statusCode = statusCodeList.statusCodes.STATUS_CODE;
const messages = messageList.messages.MESSAGES;

async function registerNewBooking(req,res){
    try {
        let user = req.loggedUser;
        const {error,value} = Validation.isBookingValidate.validateRegister(req);
        if(error) return universalFunction.validationError(res,error);
        const existingBooking = await Model.Bookings.Booking.findOne(req.body);
        if(existingBooking) return universalFunction.sendResponse(req,res,statusCode.UNPROCESSABLE_ENTITY,messages.BOOKING_ALREADY_IN_PROCESS);
        req.body.customerID = mongoose.Types.ObjectId(user._id);
        req.body.pickupAddressLocation = {
            type: "Point",
            coordinates: [0,0]
        };
        req.body.destinationAddressLocation = {
            type: "Point",
            coordinates: [0,0]
        };
        let data = await new Model.Bookings.Booking(req.body).save();
        return universalFunction.sendResponse(req, res, statusCode.SUCCESS, messages.BOOKING_REGISTER_SUCCESSFULLY, data);
    } catch (error) {
        throw error;
    }
}

async function acceptBooking(req,res){
    try {
        let user = req.loggedUser;
        if (user.userType === 'USER') return universalFunction.unauthorizedResponse(req,res,messages.USER_NOT_ALLOWDED_TO_ACCEPT_BOOKING);
        const {error,value} = Validation.isBookingValidate.validateBooking(req);
        if(error) return universalFunction.validationError(res,error);
        await Model.Bookings.Booking.findByIdAndUpdate(mongoose.Types.ObjectId(req.body.BookingID),{driverID:user._id,bookingStatus:'ACCCEPTED'});
        return universalFunction.sendResponse(req,res,statusCode.SUCCESS,messages.BOOKING_ACCEPTED_SUCCESSFULLY);    
    } catch (error) {
        throw error;
    }
}

async function cancelBooking(req,res){
    try {
        let user = req.loggedUser;
        if (user.userType === 'DRIVER') return universalFunction.unauthorizedResponse(req,res,messages.DRIVER_NOT_ALLOWDED_TO_CANCEL_BOOKING);
        const {error,value} = Validation.isBookingValidate.validateBooking(req);
        if(error) return universalFunction.validationError(res,error);
        await Model.Bookings.Booking.findByIdAndUpdate(mongoose.Types.ObjectId(req.body.BookingID),{bookingStatus:'CANCELED'});
        return universalFunction.sendResponse(req,res,statusCode.SUCCESS,messages.BOOKING_CANCELED_SUCCESSFULLY);    
    } catch (error) {
        throw error;
    }
}

async function getBookings(req,res){
    try {
        let user = req.loggedUser;
        if (user.userType === 'DRIVER'){
        let data = await Model.Cabs.Cab.aggregate([
                {
                    $match: {
                        ownerID: mongoose.Types.ObjectId(user._id),
                    }
                },
                {
                    $lookup: {
                        from: 'bookings',
                        localField: 'cabType',
                        foreignField: 'cabType',
                        as: 'Bookings'
                    }
                },
                {
                    $project:{
                        _id:0,
                        cab:"$cabName",
                        Bookings:"$Bookings"
                    }
                }
            ]);
        return universalFunction.sendResponse(req,res,statusCode.SUCCESS,messages.SUCCESS,data);
        }
        else if(user.userType === 'USER'){
        let data = await Model.Bookings.Booking.aggregate([
                {
                    $lookup:{
                        from:'users',
                        localField:'customerID',
                        foreignField:'_id',
                        as:'BookingUser'
                    }
                },
                {
                    $lookup:{
                        from:'users',
                        localField:'driverID',
                        foreignField:'_id',
                        as:'Driver'
                    }
                },
                {
                    $lookup:{
                        from:'cabs',
                        localField:'driverID',
                        foreignField:'ownerID',
                        as:'DriverCabs'
                    }
                },
                {
                    $match: {
                        customerID: mongoose.Types.ObjectId(user._id)
                    }
                },
                {
                    $project:{
                        _id:0,
                        __v:0
                    }
                }  
            ])
        return universalFunction.sendResponse(req,res,statusCode.SUCCESS,messages.SUCCESS,data);
        }
    } catch (error) {
        throw error;
    }
}

module.exports = {
    registerNewBooking:registerNewBooking,
    acceptBooking:acceptBooking,
    cancelBooking:cancelBooking,
    getBookings:getBookings
}