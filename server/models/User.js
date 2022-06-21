const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserModel = new Schema({
    firstName: {
        type: String,default:''
    },
    lastName: {
        type: String,default:''
    },
    email: {
        type: String,index:true,default:''
    },
    phoneNo: {
        type: String,index:true,default:''
    },
    countryCode: {
        type: String,index:true,default:''
    },
    password: {
        type: String,index:true,default:''
    },
    userType:{
        type: String,
        enum: ['DRIVER','USER'],
        default: 'USER'
    },    
    userLocation: {
        type: {
            type: String, default: "Point"
        },
        coordinates:{
            type:[Number],index:'2dsphere',default:[0,0]
        }
    },
    otp:{
        type:String,required:true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isDeleted:{
        type: Boolean,
        default: false
    }
})

const UserImageModel = Schema({
    userID:{
        type:mongoose.Schema.Types.ObjectId,ref:'Users',required:true
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

const User = mongoose.model('Users',UserModel);
const UserImage = mongoose.model('UserImages',UserImageModel);

module.exports = {User,UserImage}