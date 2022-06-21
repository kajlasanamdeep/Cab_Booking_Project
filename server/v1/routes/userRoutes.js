const express = require('express');
const router = express.Router();
const Controller = require('../controllers/index');
const Upload = require('../../services/FileUploadService');
const Authorization = require('../../auth/index');

router.get('/register',(req,res)=>{
    return res.render('signup')
})
router.post('/register',Upload.user.single('userImage'),Controller.UserController.register);
router.post('/login',Controller.UserController.login);
router.post('/updateImage',Authorization.isUserAuth,Upload.user.single('userImage'),Controller.UserController.updateImage);
router.get('/Profile',Authorization.isUserAuth,Controller.UserController.viewProfile);
router.post('/forgotPassword',Controller.UserController.Send_Forgot_Pass_OTP);
router.post('/verify',Authorization.isUserAuth,Controller.UserController.verify);
router.post('/resetPassword',Authorization.isUserAuth,Controller.UserController.Reset_New_Password);
module.exports = router;