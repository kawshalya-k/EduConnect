const express = require('express');
const router = express.Router();
const { register, login, verifyOTP, forgotPassword, resetPassword, setupPassword, resendOTP } = require('../controllers/authController');

router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/setup-password', setupPassword);

module.exports = router;