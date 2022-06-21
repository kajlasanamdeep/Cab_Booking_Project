const Model = require('../../models/index');
const Service = require('../../services/index');
const Validation = require('../Validations/index');
const universalFunction = require('../../lib/universal-function');
const statusCodeList = require("../../statusCodes");
const messageList = require("../../messages");
const { default: mongoose } = require('mongoose');
const statusCode = statusCodeList.statusCodes.STATUS_CODE;
const messages = messageList.messages.MESSAGES;
const constants = require('../../constant/index').constant;

async function register(req, res) {
    try {
        const { error, value } = Validation.isUserValidate.validateRegister(req);
        if (error) return universalFunction.validationError(res, error);
        const emailUser = await Model.Users.User.findOne({
            email: req.body.email,
            isDeleted: false
        });
        if (emailUser) {
            return universalFunction.sendResponse(req, res, statusCode.UNPROCESSABLE_ENTITY, messages.EMAIL_ALREDAY_EXIT);
        }
        const userData = await Model.Users.User.findOne({
            phoneNo: req.body.phoneNo,
            countryCode: req.body.countryCode,
            isDeleted: false
        });
        if (userData) {
            return universalFunction.sendResponse(req, res, statusCode.UNPROCESSABLE_ENTITY, messages.PHONE_NUMBER_ALREADY_EXISTS);
        }

        req.body.password = await universalFunction.hashPasswordUsingBcrypt(req.body.password);
        req.body.otp = universalFunction.generateOTP();
        let user = await new Model.Users.User(req.body).save();
        let userimage = await new Model.Users.UserImage({
            userID: mongoose.Types.ObjectId(user._id),
            Image: `${constants.FILE_PATH.USERS}/userImage.jpg`,
            isUploaded: false
        }).save();

        Service.EmailService.sendUserVerifyMail(user);
        let Token = await universalFunction.jwtSign(user);
        let data = { user: user, userImage: userimage, accessToken: Token };
        return universalFunction.sendResponse(req, res, statusCode.SUCCESS, messages.USER_REGISTER_SUCCESSFULLY, data);
    }
    catch (error) {
        throw error;
    }
};

async function verify(req, res) {
    try {
        let user = req.loggedUser;
        let validOTP = await universalFunction.verifyOTP(req, user.otp);
        if (!validOTP) return universalFunction.sendResponse(req, res, statusCode.UNPROCESSABLE_ENTITY, messages.INVALID_OTP)
        await Model.Users.User.findByIdAndUpdate(mongoose.Types.ObjectId(user._id), { isVerified: true }, { upsert: false });
        user = await Model.Users.User.findById(mongoose.Types.ObjectId(user._id));
        let Token = await universalFunction.jwtSign(user);
        let data = { user: user, accessToken: Token };
        return universalFunction.sendResponse(req, res, statusCode.SUCCESS, messages.USER_VERIFIED_SUCCESSFULLY, data);
    }
    catch (error) {
        throw error;
    }
};


async function login(req, res) {
    try {
        const { error, value } = Validation.isUserValidate.validateLogin(req);
        if (error) return universalFunction.validationError(res, error);
        let user = await Model.Users.User.findOne({ email: req.body.email });
        if (!user) return universalFunction.sendResponse(req, res, statusCode.NOT_FOUND, messages.USER_NOT_FOUND)
        let pass = await universalFunction.comparePasswordUsingBcrypt(req.body.password, user.password);
        if (!pass) return universalFunction.sendResponse(req, res, statusCode.FORBIDDEN, messages.INVALID_PASSWORD);
        await Model.Users.User.findByIdAndUpdate(mongoose.Types.ObjectId(user._id), { userLocation: { type: "Point", coordinates: [-73.856077, 40.84847] } }, { upsert: false });
        let Token = await universalFunction.jwtSign(user);
        user = await Model.Users.User.findById(mongoose.Types.ObjectId(user._id));
        let data = { user: user, accessToken: Token }
        return universalFunction.sendResponse(req, res, statusCode.SUCCESS, messages.USER_LOGIN_SUCCESSFULLY, data);
    }
    catch (error) {
        throw error;
    }
};

async function Send_Forgot_Pass_OTP(req, res) {
    try {
        const { error, value } = Validation.isUserValidate.validateForgotPassword(req);
        if (error) return universalFunction.validationError(res, error);
        let user = await Model.Users.User.findOne({ email: req.body.email });
        if (!user) return universalFunction.sendResponse(req, res, statusCode.NOT_FOUND, messages.USER_NOT_FOUND);
        let otp = universalFunction.generateOTP();
        await Model.Users.User.findByIdAndUpdate(mongoose.Types.ObjectId(user._id), { otp: otp }, { upsert: false });
        user = await Model.Users.User.findById(mongoose.Types.ObjectId(user._id));
        Service.EmailService.UserForgotEmail(user);
        let Token = await universalFunction.jwtSign(user);
        let data = { user: user, accessToken: Token };
        return universalFunction.sendResponse(req, res, statusCode.SUCCESS, messages.OTP_SENT_SUCCESSFULLY, data);
    } catch (error) {
        throw error;
    }
};

async function Reset_New_Password(req, res) {
    try {
        let user = req.loggedUser;
        const { error, value } = Validation.isUserValidate.validateResetPassword(req);
        if (error) return universalFunction.validationError(res, error);
        let password = await universalFunction.hashPasswordUsingBcrypt(req.body.New_Password);
        await Model.Users.User.findByIdAndUpdate(mongoose.Types.ObjectId(user._id), { password: password }, { upsert: false });
        user = await Model.Users.User.findById(mongoose.Types.ObjectId(user._id));
        return universalFunction.sendResponse(req, res, statusCode.SUCCESS, messages.PASSWORD_CHANGED_SUCCESSFULLY, user)
    } catch (error) {
        throw error;
    }
}

async function updateImage(req, res) {
    try {
        let user = req.loggedUser;
        if (req.file.filename) {
            await Model.Users.UserImage.findOneAndUpdate({ userID: mongoose.Types.ObjectId(user._id) }, { Image: `${constants.FILE_PATH.USERS}/${req.file.filename}`, isUploaded: true }, { upsert: true });
            let data = await Model.Users.UserImage.findOne({ userID: mongoose.Types.ObjectId(user._id) });
            return universalFunction.sendResponse(req, res, statusCode.SUCCESS, messages.IMAGE_UPDATED_SUCCESSFULLY, data)
        } else {
            return universalFunction.sendResponse(req, res, statusCode.NOT_FOUND, messages.IMAGE_REQUIRED)
        }
    } catch (error) {
        throw error;
    }
};

async function viewProfile(req, res) {
    try {
        let user = req.loggedUser;
        let data = await Model.Users.User.aggregate([
            {
                $match: {
                    _id: mongoose.Types.ObjectId(user._id)
                }
            },
            {
                $lookup: {
                    from: "userimages",
                    localField: "_id",
                    foreignField: "userID",
                    as: "userImage"
                }
            },
            {
                $project: {
                    _id: 0,
                    __v: 0,
                    "userImage._id": 0,
                    "userImage.__v": 0,
                    "isDeleted": 0,
                    "isVerified": 0,
                    "otp": 0,
                    "userLocation": 0,
                    "userImage.userID": 0,
                    "userImage.isDeleted": 0,
                    "userImage.isUploaded": 0
                }
            },
            {
                $unwind: "$userImage"
            }
        ]);

        return universalFunction.sendResponse(req, res, statusCode.SUCCESS, messages.SUCCESS, data)

    } catch (error) {
        throw error;
    }
};

module.exports = {
    register: register,
    login: login,
    Send_Forgot_Pass_OTP: Send_Forgot_Pass_OTP,
    verify: verify,
    Reset_New_Password: Reset_New_Password,
    updateImage: updateImage,
    viewProfile: viewProfile,
}