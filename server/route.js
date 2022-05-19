const express = require('express');
const router = express();
const v1Routes = require('./v1/route');
router.use('/v1',v1Routes);
module.exports = router;