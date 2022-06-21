const express = require('express');
const router = express.Router();
const Controller = require('../controllers/index');
const Upload = require('../../services/FileUploadService');
const Authorization = require('../../auth/index');

router.post('/registerNewCab',Authorization.isUserAuth,Upload.cab.single('cabImage'),Controller.CabController.registerNewCab);

module.exports = router;