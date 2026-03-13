const nodemailer = require('nodemailer');

const sendEmail = async (email, otp) => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: '"EduConnect" <noreply@educonnect.lk>',
        to: email, 
        subject: 'EduConnect Verification Code',
        text: `Your OTP is: ${otp}`
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;