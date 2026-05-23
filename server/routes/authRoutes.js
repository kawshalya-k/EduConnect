const express = require('express');
const router = express.Router();
// 1. Add verifyOTP here
const { register, login, verifyOTP, forgotPassword, resetPassword } = require('../controllers/authController');

// 2. Remove "authController." from the front
router.post('/verify-otp', verifyOTP);
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

module.exports = router;