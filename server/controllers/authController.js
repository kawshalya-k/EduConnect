const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');

// --- 1. REGISTRATION ---
exports.register = async (req, res) => {
    const { full_name, email, password, role } = req.body;
    try {
        // University email check (.ac.lk)
        if (!email.endsWith('.ac.lk')) {
            return res.status(400).json({ 
                message: "Please use your official university email (ending in .ac.lk)." 
            });
        }
        
        // Check if user already exists
        const [existing] = await db.query("SELECT * FROM Users WHERE email = ?", [email]);
        if (existing.length > 0) return res.status(400).json({ message: "Email already registered" });

        // Generate OTP & Expiry (valid for 10 minutes)
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otp_expiry = new Date(Date.now() + 10 * 60000); 
        
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save to DB with OTP and Expiry
        const sql = "INSERT INTO Users (full_name, email, password, role, otp_code, otp_expiry, is_verified) VALUES (?, ?, ?, ?, ?, ?, ?)";
        await db.query(sql, [full_name, email, hashedPassword, role || 'Learner', otp, otp_expiry, false]);

        // Send email via Mailtrap/Nodemailer
        await sendEmail(email, otp);

        res.status(200).json({ message: "Verification code sent to your university email!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// --- 2. VERIFY OTP ---
exports.verifyOTP = async (req, res) => {
    const { email, otp } = req.body;
    try {
        const [rows] = await db.query("SELECT * FROM Users WHERE email = ?", [email]);
        const user = rows[0];

        if (!user) return res.status(404).json({ message: "User not found" });

        // Check if OTP matches
        if (user.otp_code !== otp) {
            return res.status(400).json({ message: "Invalid OTP code" });
        }

        // Check if OTP is expired
        if (new Date() > new Date(user.otp_expiry)) {
            return res.status(400).json({ message: "OTP has expired. Please register again." });
        }

        // Update User to Verified and clear OTP fields
        await db.query(
            "UPDATE Users SET is_verified = 1, otp_code = NULL, otp_expiry = NULL WHERE email = ?", 
            [email]
        );

        res.status(200).json({ message: "Account verified! You can now log in." });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// --- 3. LOGIN ---
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Find user
        const [rows] = await db.query("SELECT * FROM Users WHERE email = ?", [email]);
        const user = rows[0];

        if (!user) return res.status(404).json({ message: "User not found" });
        
        // Block unverified users
        if (user.is_verified === 0) {
            return res.status(403).json({ 
                message: "Your account is not verified. Please check your email for the OTP." 
            });
        }

        // Check Password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

        // Create Token
        const token = jwt.sign({ id: user.user_id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.json({
            token,
            user: { id: user.user_id, name: user.full_name, coins: user.skill_coins }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};