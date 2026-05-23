const nodemailer = require('nodemailer');

const sendEmail = async (email, otp) => {
    try {
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
        console.log(`Email successfully sent to ${email}`);
    } catch (error) {
        console.error("Failed to send email (Mailtrap issue):", error.message);
        console.log(`\n=========================================`);
        console.log(`[DEV MODE] MOCK EMAIL SENT`);
        console.log(`To: ${email}`);
        console.log(`OTP Code: ${otp}`);
        console.log(`=========================================\n`);
    }
};

module.exports = sendEmail;