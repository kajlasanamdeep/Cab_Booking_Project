const Model = require('../../models/index');
const Service = require('../../services/index');
const Validation = require('../Validations/index');
const universalFunction = require('../../lib/universal-function');
const statusCodeList = require("../../statusCodes");
const messageList = require("../../messages");
const statusCode = statusCodeList.statusCodes.STATUS_CODE;
const messages = messageList.messages.MESSAGES;
const constants = require('../../constant/index').constant;
const { default: mongoose } = require('mongoose');


async function registerNewCab(req,res){
    try {
        let user = req.loggedUser;
        if(user.userType === 'USER') return universalFunction.unauthorizedResponse(req,res,messages.USER_NOT_ALLOWDED_TO_REGISTER_CAB);
        const {error,value} = Validation.isCabValidate.validateRegister(req);
        if(error) return universalFunction.validationError(res,error);
        const NumberPlateCab = await Model.Cabs.Cab.findOne({cabNumberPlate:req.body.cabNumberPlate});
        const chassiNumCab = await Model.Cabs.Cab.findOne({cabChassiNumber:req.body.cabChassiNumber});
        if(NumberPlateCab || chassiNumCab) return universalFunction.sendResponse(req, res, statusCode.UNPROCESSABLE_ENTITY, messages.CAB_WITH_THIS_DETAILS_ALREADY_REGISTERED);
        req.body.ownerID = mongoose.Types.ObjectId(user._id);
        let cab = await new Model.Cabs.Cab(req.body).save();
        let cabImage;
        if (req.file) {
            cabImage = await new Model.Cabs.CabImage({
                cabID: mongoose.Types.ObjectId(cab._id), 
                Image: `${constants.FILE_PATH.CABS}/${req.file.filename}`,
                isUploaded: true
            }).save();
        }
        let data = {cab:cab,cabImage:cabImage};
        return universalFunction.sendResponse(req, res, statusCode.SUCCESS, messages.CAB_REGISTER_SUCCESSFULLY, data);
    } catch (error) {
        throw error
    }
};



module.exports = {
    registerNewCab:registerNewCab,
}