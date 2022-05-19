const multer = require('multer');
const path = require('path');

const userUpload = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null,path.join(__dirname,'../server/uploads'))
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + file.originalname)
    }
});
const cabUpload = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'server/uploads/cabs')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + file.originalname)
    }
});

const cab = multer({ storage: cabUpload });
const user = multer({ storage: userUpload });
module.exports = {
    cab: cab,
    user: user
};
