const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CabModel = Schema({
    cabName:{
        type:String,required:true
    },
    cabModel:{
        type:String,required:true
    },
    cabChassiNumber:{
        type:String,required:true
    },
    cabNumberPlate:{
        type:String,required:true
    },
    cabRentPerHour:{
        type:String,required:true
    },
    cabRentPerDay:{
        type:String,required:true
    },
    maxPassengers:{
        type:Number,required:true
    },
    cabType:{
        type:String,enum:['SUV','Sedan','Limousine','Luxury','MPV','Hatchback'],required:true
    },
    ownerID:{
        type:mongoose.Schema.Types.ObjectId,ref:'Users',required:true
    },
    cabDescription:{
        type:String,default:""
    },
    isDeleted:{
        type: Boolean,
        default: false
    }
});

const CabImageModel = Schema({
    cabID:{
        type:mongoose.Schema.Types.ObjectId,ref:'Cabs',required:true
    },
    Image:{
        type:String,required:true
    },
    isUploaded:{
        type:Boolean,
        default:false
    },
    isDeleted:{
        type:Boolean,
        default:false
    }
});

const Cab = mongoose.model('Cabs',CabModel);
const CabImage = mongoose.model('CabImages',CabImageModel);

module.exports = {Cab,CabImage}