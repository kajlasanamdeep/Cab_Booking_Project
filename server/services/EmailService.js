const nodemailer = require('nodemailer');

EMAIL = process.env.EMAIL;
PASS = process.env.PASS;

let transporter = nodemailer.createTransport({
    service:'gmail',
    host: "smtp.gmail.com",
    port:500,
    secure: false,
    auth:{
        user: EMAIL,
        pass: PASS
    }
});
module.exports = {
    sendUserVerifyMail: (payload) => {
        const msg = {
            from: EMAIL,
            to: payload.email,
            subject: 'OTP For verification',
            html: `
            <h3>Thank you for register on online cab booking app by sanamdeep</h3>
            <p>Your verification OTP is ${payload.otp}.</p>`
        };
        transporter.sendMail(msg,(error, info)=>{
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
    
    },
    UserForgotEmail: (payload) => {
            const msg = {
                from: EMAIL,
                to: payload.email,
                subject: 'OTP  For Reset Password',
                html: `
                <h3>online cab booking app account password reset Mail</h3>
                <p>Your Password Reset OTP is ${payload.otp}.</p>`
            }
            transporter.sendMail(msg,(error, info)=>{
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                }
              });
    }
}
