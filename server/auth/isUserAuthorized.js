const mongoose = require('mongoose');
const Model = require('../models/index');
const universalFunction=require('../lib/universal-function');
const messageList = require("../messages");
const messages = messageList.messages;

module.exports = async(req, res, next) => {
    try {
        if (req.headers.authorization){
            let Bearertoken = await req.headers.authorization;
            let accessToken = Bearertoken.slice(7);
            const decodedData = await universalFunction.jwtVerify(accessToken);
                if (!decodedData) return universalFunction.forBiddenResponse(req,res);
                let userData = await Model.Users.User.findOne({
                    _id:mongoose.Types.ObjectId(decodedData._id),
                    isDeleted:false
                });
                if(userData){
                    req.loggedUser = userData;
                    next();
                }else{
                    return universalFunction.unauthorizedResponse(req,res);
                }
        } else {
            return universalFunction.unauthorizedResponse(req,res,messages.MESSAGES.INVALID_TOKEN);
        }  
    } catch (error) {
        return universalFunction.unauthorizedResponse(req,res);
    }
};