const express = require('express');
const router = express();
const Routes = require('./routes/index');
router.use('/user',Routes.UserRoutes);
router.use('/cab',Routes.CabRoutes);
router.use('/booking',Routes.BookingRoutes)
module.exports = router;