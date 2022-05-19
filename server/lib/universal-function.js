var jwt = require('jsonwebtoken');
var config = require('../config/config');
const bcrypt = require('bcrypt');
const statusCodeList = require("../statusCodes");
const messageList = require("../messages");
// const { user } = require('../services/FileUploadService');
const statusCode = statusCodeList.statusCodes.STATUS_CODE;
const messages = messageList.messages.MESSAGES;

const sendResponse = async ( req, res, code, message, data) => {
		code = code || statusCode.SUCCESS;
		message = message || messages.SUCCESS;
		data = data || {};
		return res.status(code).send({
			statusCode: code,
			message: message,
			data: data
		});
};
const unauthorizedResponse= async (req,res,message) => {
		const code = statusCode.UNAUTHORIZED;
	    message = message ||  messages.UNAUTHORIZED;
		return res.status(code).send({
			statusCode: code,
			message: message
		});
};
const forBiddenResponse= async (req,res,message) => {
		const code = statusCode.FORBIDDEN;
	    message = message ||  messages.FORBIDDEN;
		return res.status(code).send({
			statusCode: code,
			message: message
		});
};

const verifyOTP = async(req,otp)=>{
	if(req.body.otp == otp) return true;
	else return false;
}

const validationError = async (res,error) => {
	const code = statusCode.BAD_REQUEST;
	return res.status(code).send({
		statusCode: code,
		error: error,
	});
};

const hashPasswordUsingBcrypt = async (plainTextPassword) => {
    const saltRounds = 10;
    return bcrypt.hashSync(plainTextPassword, saltRounds);
};

const jwtSign = async (payload) => {
		return jwt.sign({_id:payload._id},config.JWTSECRETKEY,{expiresIn:"1d"});
};

const jwtVerify = async(token) => {
		return jwt.verify(token, config.JWTSECRETKEY);
};

const comparePasswordUsingBcrypt = async (plainTextPassword, passwordhash) => {
    return bcrypt.compareSync(plainTextPassword, passwordhash);
};

function generateOTP(){
	return Math.floor(Math.random() * 10000);
}

module.exports = {
	sendResponse :sendResponse,
	unauthorizedResponse: unauthorizedResponse,
	forBiddenResponse:forBiddenResponse,
	jwtSign:jwtSign,
	jwtVerify:jwtVerify,
	verifyOTP:verifyOTP,
	validationError:validationError,
	hashPasswordUsingBcrypt: hashPasswordUsingBcrypt,
	comparePasswordUsingBcrypt: comparePasswordUsingBcrypt,
	generateOTP:generateOTP
}