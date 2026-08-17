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
        const [existing] = await db.query("SELECT * FROM User WHERE Email = ?", [email]);
        if (existing.length > 0) return res.status(400).json({ message: "Email already registered" });

        // Generate OTP & Expiry (valid for 10 minutes)
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otp_expiry = new Date(Date.now() + 10 * 60000); 
        
        // Hash the password (using 8 rounds instead of 10 for faster execution on low-resource cloud hosts)
        const hashedPassword = await bcrypt.hash(password, 8);

        // Split full_name into First_Name and Last_Name
        const nameParts = full_name.trim().split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

        // Save to DB with OTP and Expiry
        const sql = "INSERT INTO User (First_Name, Last_Name, Email, Password, Role, otp_code, otp_expiry, is_verified, skill_coins) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 100)";
        await db.query(sql, [firstName, lastName, email, hashedPassword, role || 'Student', otp, otp_expiry, 0]); 

        // Send email via Mailtrap/Nodemailer (fire and forget)
        sendEmail(email, otp).catch(console.error);

        res.status(200).json({ message: "Verification code sent to your university email!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// --- 2. VERIFY OTP ---
exports.verifyOTP = async (req, res) => {
    const { email, otp } = req.body;
    try {
        const [rows] = await db.query("SELECT * FROM User WHERE Email = ?", [email]);
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
            "UPDATE User SET is_verified = 1, otp_code = NULL, otp_expiry = NULL WHERE Email = ?", 
            [email]
        );

        res.status(200).json({ message: "Account verified! You can now log in." });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// --- 3. RESEND OTP ---
exports.resendOTP = async (req, res) => {
    const { email } = req.body;
    try {
        const [rows] = await db.query("SELECT * FROM User WHERE Email = ?", [email]);
        const user = rows[0];

        if (!user) return res.status(404).json({ message: "User not found" });
        if (user.is_verified) return res.status(400).json({ message: "User is already verified" });

        // Generate OTP & Expiry (valid for 10 minutes)
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otp_expiry = new Date(Date.now() + 10 * 60000); 

        // Update DB with new OTP
        await db.query(
            "UPDATE User SET otp_code = ?, otp_expiry = ? WHERE Email = ?", 
            [otp, otp_expiry, email]
        );

        // Send email
        await sendEmail(email, otp);

        res.status(200).json({ message: "A new verification code has been sent to your email!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// --- 4. LOGIN ---
exports.login = async (req, res) => {
    const { email, password, rememberMe } = req.body;
    try {
        // Find user
        const [rows] = await db.query("SELECT * FROM User WHERE Email = ?", [email]);
        const user = rows[0];

        if (!user) return res.status(404).json({ message: "User not found" });
        
        // Block unverified users
        if (user.is_verified === 0) {
            return res.status(403).json({ 
                message: "Your account is not verified. Please check your email for the OTP." 
            });
        }

        // Check Password
        const isMatch = await bcrypt.compare(password, user.Password);
        if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

        // Create Token
        const expiresIn = rememberMe ? '30d' : '1d';
        const token = jwt.sign({ id: user.User_Id }, process.env.JWT_SECRET, { expiresIn });

        res.json({
            token,
            user: { id: user.User_Id, name: `${user.First_Name} ${user.Last_Name}`, coins: user.skill_coins }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
const crypto = require('crypto');

// --- 4. FORGOT PASSWORD ---
exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const [rows] = await db.query("SELECT * FROM User WHERE Email = ?", [email]);
        const user = rows[0];

        if (!user) return res.status(404).json({ message: "User not found" });

        // Generate token and expiry
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = new Date(Date.now() + 15 * 60000); // 15 minutes

        // Update DB
        await db.query(
            "UPDATE User SET reset_token = ?, reset_token_expiry = ? WHERE Email = ?",
            [resetToken, resetTokenExpiry, email]
        );

        // Send email with link
        // In a real app, this should be the frontend URL
        const resetLink = `http://localhost:5173/set-new-password?token=${resetToken}`;
        sendEmail(email, `Your password reset link: ${resetLink}`).catch(console.error);

        res.status(200).json({ message: "Password reset link sent to your email." });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// --- 5. RESET PASSWORD ---
exports.resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;
    try {
        // Find user by token
        const [rows] = await db.query("SELECT * FROM User WHERE reset_token = ?", [token]);
        const user = rows[0];

        if (!user) return res.status(400).json({ message: "Invalid or missing token" });

        // Check expiry
        if (new Date() > new Date(user.reset_token_expiry)) {
            return res.status(400).json({ message: "Reset token has expired" });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 8);

        // Update DB and clear token
        await db.query(
            "UPDATE User SET Password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE User_Id = ?",
            [hashedPassword, user.User_Id]
        );

        res.status(200).json({ message: "Password updated successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// --- 6. SETUP PASSWORD (ONBOARDING) ---
exports.setupPassword = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        
        // Find user
        const [rows] = await db.query("SELECT * FROM User WHERE Email = ?", [email]);
        const user = rows[0];

        if (!user) return res.status(404).json({ message: "User not found" });

        // Hash new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update DB
        await db.query(
            "UPDATE User SET Password = ? WHERE User_Id = ?",
            [hashedPassword, user.User_Id]
        );

        // Create Token
        const token = jwt.sign({ id: user.User_Id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.status(200).json({
            token,
            user: { id: user.User_Id, name: `${user.First_Name} ${user.Last_Name}`, coins: user.skill_coins }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

