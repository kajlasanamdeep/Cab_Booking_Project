const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const BookingModel = Schema({
    customerName:{
        type:String,required:true
    },
    customerID:{
        type:mongoose.Schema.Types.ObjectId,ref:"Users",required:true
    }, 
    cabType:{
        type: String,enum: ['SUV', 'SEDAN', 'MPV', 'HATCHBACK'],required:true
    },
    bookingDate:{
        type:String,required:true
    },
    totalPassengers:{
        type:String,required:true
    },
    pickupAddressName:{
        type:String,required:true
    },
    pickupAddressLocation:{
        type: {
            type: String, default: "Point"
        },
        coordinates: {
            type: [Number], index: '2dsphere'
        }
    },
    destinationAddressName:{
        type:String,required:true
    },
    destinationAddressLocation:{
        type: {
            type: String, default: "Point"
        },
        coordinates: {
            type: [Number], index: '2dsphere'
        }
    },
    bookingStatus:{
        type:String,enum:['PENDING','ACCEPTED','CANCELED'],default:"PENDING"
    },
    driverID:{
        type:mongoose.Schema.Types.ObjectId,ref:"Users",default:null
    }
})
const Booking = mongoose.model('Bookings',BookingModel);
module.exports = {Booking};