const express = require('express');
const router = express.Router();
// 1. Add verifyOTP here
const { register, login, verifyOTP } = require('../controllers/authController');

// 2. Remove "authController." from the front
router.post('/verify-otp', verifyOTP);
router.post('/register', register);
router.post('/login', login);

module.exports = router;