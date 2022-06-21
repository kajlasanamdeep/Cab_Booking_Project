const express = require('express');
const router = express.Router();
const Controller = require('../controllers/index');
const Authorization = require('../../auth/index');

router.post('/registerNewBooking',Authorization.isUserAuth,Controller.BookingController.registerNewBooking);
router.post('/acceptBooking',Authorization.isUserAuth,Controller.BookingController.acceptBooking);
router.post('/cancelBooking',Authorization.isUserAuth,Controller.BookingController.cancelBooking);
router.get('/getBookings',Authorization.isUserAuth,Controller.BookingController.getBookings);

module.exports = router;