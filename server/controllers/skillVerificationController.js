const db = require('../config/db');
const path = require('path');
const crypto = require('crypto');

// ─────────────────────────────────────────────
// CONFIG
// ─────────────────────────────────────────────

// Your React dev server (change to production URL when deploying)
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// HackerRank test URL — swap this for a real HackerRank Test invite link when ready
const HACKERRANK_TEST_URL = process.env.HACKERRANK_TEST_URL || 'https://www.hackerrank.com/';

// Base URL of THIS backend (so HackerRank can redirect back after the quiz)
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

// In-memory token store { token -> { userId, skillId, expiresAt } }
// ⚠️  Replace with Redis or a DB table in production
const pendingQuizTokens = new Map();

// ─────────────────────────────────────────────
// HELPER: generate a short-lived quiz token
// ─────────────────────────────────────────────
function createQuizToken(userId, skillId) {
    const token = crypto.randomBytes(24).toString('hex');
    const expiresAt = Date.now() + 60 * 60 * 1000; // 1 hour
    pendingQuizTokens.set(token, { userId, skillId, expiresAt });
    return token;
}

// ─────────────────────────────────────────────
// HELPER: validate and consume a quiz token
// ─────────────────────────────────────────────
function consumeQuizToken(token) {
    const data = pendingQuizTokens.get(token);
    if (!data) return null;
    pendingQuizTokens.delete(token); // one-time use
    if (Date.now() > data.expiresAt) return null; // expired
    return data;
}

// ─────────────────────────────────────────────
// GET /api/mentor/skills/all
// Get all available skills (for the "Add Skill" dropdown)
// ─────────────────────────────────────────────
exports.getAllSkills = async (req, res) => {
    try {
        const [skills] = await db.query(
            `SELECT Skill_Id, Skill_Name, Category, Description FROM Skill ORDER BY Category, Skill_Name`
        );
        res.json(skills);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ─────────────────────────────────────────────
// GET /api/mentor/skills/my
// Get all skills the mentor has submitted (any status)
// ─────────────────────────────────────────────
exports.getMySkills = async (req, res) => {
    const userId = req.user.id;
    try {
        const [skills] = await db.query(
            `SELECT us.User_Skill_Id, s.Skill_Id, s.Skill_Name, s.Category, s.Description,
                    us.Mentor_Level, us.Verification_Status, us.Certificates, us.Last_Attempt,
                    COALESCE(ld.Average_Rating, 0) AS Average_Rating,
                    COALESCE(ld.Total_Sessions, 0) AS Total_Sessions,
                    COALESCE(ld.Score, 0)           AS Score,
                    ld.Last_Evaluation_Date
             FROM User_Skill us
             JOIN Skill s ON s.Skill_Id = us.Skill_Id
             LEFT JOIN Levelling_Data ld 
                    ON ld.Mentor_Id = us.User_Id AND ld.Skill_Id = us.Skill_Id
             WHERE us.User_Id = ?
             ORDER BY us.Verification_Status DESC, s.Skill_Name`,
            [userId]
        );
        res.json(skills);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ─────────────────────────────────────────────
// POST /api/mentor/skills/add
// Instead of inserting directly, redirect the mentor to HackerRank.
// The skill is only saved after they pass the quiz.
// Body: { skill_id }  File: certificate (multipart)
// ─────────────────────────────────────────────
exports.addSkill = async (req, res) => {
    const userId = req.user.id;
    let { skill_id, name } = req.body;

    try {
        // If name is passed but no skill_id, try to look up or create the skill by name
        if (!skill_id && name) {
            const [rows] = await db.query(`SELECT Skill_Id FROM Skill WHERE Skill_Name = ?`, [name]);
            if (rows.length > 0) {
                skill_id = rows[0].Skill_Id;
            } else {
                // Create a new Skill record
                const [result] = await db.query(
                    `INSERT INTO Skill (Skill_Name, Category, Description) VALUES (?, 'Technical', ?)`,
                    [name, `Assessment of expertise in ${name}.`]
                );
                skill_id = result.insertId;
            }
        }

        if (!skill_id) return res.status(400).json({ message: "skill_id or name is required." });

        // Check skill exists
        const [skillRows] = await db.query(`SELECT * FROM Skill WHERE Skill_Id = ?`, [skill_id]);
        if (skillRows.length === 0) return res.status(404).json({ message: "Skill not found." });

        // Check if there is already a User_Skill record
        const [existing] = await db.query(
            `SELECT * FROM User_Skill WHERE User_Id = ? AND Skill_Id = ?`,
            [userId, skill_id]
        );
        
        if (existing.length > 0) {
            return res.json({
                message: "Skill already added.",
                skill_id,
                status: existing[0].Verification_Status
            });
        }

        // Insert into User_Skill as Student (unverified)
        await db.query(
            `INSERT INTO User_Skill (User_Id, Skill_Id, Role, Verification_Status)
             VALUES (?, ?, 'Student', 0)`,
            [userId, skill_id]
        );

        return res.json({
            message: "Skill added successfully.",
            skill_id
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ─────────────────────────────────────────────
// GET /api/mentor/skills/quiz-callback
// HackerRank redirects back here after the quiz.
// Query params: token=<token>  &result=pass|fail
// ─────────────────────────────────────────────
exports.quizCallback = async (req, res) => {
    const { token, result } = req.query;

    // --- validate token ---
    if (!token) {
        return res.redirect(`${FRONTEND_URL}/quiz/failed?reason=missing_token`);
    }

    const tokenData = consumeQuizToken(token);
    if (!tokenData) {
        return res.redirect(`${FRONTEND_URL}/quiz/failed?reason=invalid_or_expired_token`);
    }

    const { userId, skillId, certificatePath } = tokenData;

    // --- handle fail ---
    if (result !== 'pass') {
        return res.redirect(
            `${FRONTEND_URL}/quiz/failed?skill_id=${skillId}&reason=quiz_not_passed`
        );
    }

    // --- handle pass: persist the skill submission ---
    try {
        // Guard against a race condition where the user somehow passes twice
        const [existing] = await db.query(
            `SELECT * FROM User_Skill WHERE User_Id = ? AND Skill_Id = ? AND Role = 'Mentor'`,
            [userId, skillId]
        );
        if (existing.length > 0) {
            return res.redirect(
                `${FRONTEND_URL}/quiz/success?skill_id=${skillId}&note=already_submitted`
            );
        }

        await db.query(
            `INSERT INTO User_Skill (User_Id, Skill_Id, Role, Verification_Status, Certificates)
             VALUES (?, ?, 'Mentor', 'Pending', ?)`,
            [userId, skillId, certificatePath || null]
        );

        return res.redirect(
            `${FRONTEND_URL}/quiz/success?skill_id=${skillId}`
        );
    } catch (err) {
        console.error('quizCallback DB error:', err);
        return res.redirect(
            `${FRONTEND_URL}/quiz/failed?skill_id=${skillId}&reason=server_error`
        );
    }
};

// ─────────────────────────────────────────────
// DELETE /api/mentor/skills/:userSkillId
// Remove a skill submission (only if Pending or Rejected)
// ─────────────────────────────────────────────
exports.removeSkill = async (req, res) => {
    const userId = req.user.id;
    const { userSkillId } = req.params;
    try {
        const [rows] = await db.query(
            `SELECT * FROM User_Skill WHERE User_Skill_Id = ? AND User_Id = ?`,
            [userSkillId, userId]
        );
        if (rows.length === 0) return res.status(404).json({ message: "Skill not found." });
        if (rows[0].Verification_Status === 'Verified') {
            return res.status(400).json({ message: "Cannot remove a verified skill." });
        }

        await db.query(`DELETE FROM User_Skill WHERE User_Skill_Id = ?`, [userSkillId]);
        res.json({ message: "Skill removed successfully." });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ─────────────────────────────────────────────
// ADMIN: GET /api/mentor/skills/pending
// List all pending skill verification requests
// ─────────────────────────────────────────────
exports.getPendingVerifications = async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT us.User_Skill_Id, us.Certificates,
                    u.User_Id, u.First_Name, u.Last_Name, u.Email, u.University,
                    s.Skill_Id, s.Skill_Name, s.Category
             FROM User_Skill us
             JOIN User  u ON u.User_Id  = us.User_Id
             JOIN Skill s ON s.Skill_Id = us.Skill_Id
             WHERE us.Role = 'Mentor' AND us.Verification_Status = 'Pending'
             ORDER BY us.User_Skill_Id ASC`
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ─────────────────────────────────────────────
// ADMIN: PATCH /api/mentor/skills/:userSkillId/verify
// Approve or reject a skill verification request
// Body: { action: 'approve' | 'reject' }
// ─────────────────────────────────────────────
exports.verifySkill = async (req, res) => {
    const { userSkillId } = req.params;
    const { action } = req.body;

    if (!['approve', 'reject'].includes(action)) {
        return res.status(400).json({ message: "action must be 'approve' or 'reject'." });
    }

    const newStatus = action === 'approve' ? 'Verified' : 'Rejected';

    try {
        const [rows] = await db.query(
            `SELECT * FROM User_Skill WHERE User_Skill_Id = ?`, [userSkillId]
        );
        if (rows.length === 0) return res.status(404).json({ message: "Record not found." });
        if (rows[0].Verification_Status !== 'Pending') {
            return res.status(400).json({ message: "This skill has already been reviewed." });
        }

        await db.query(
            `UPDATE User_Skill SET Verification_Status = ? WHERE User_Skill_Id = ?`,
            [newStatus, userSkillId]
        );

        if (newStatus === 'Verified') {
            const { User_Id, Skill_Id } = rows[0];
            await db.query(
                `INSERT IGNORE INTO Levelling_Data (Mentor_Id, Skill_Id, Average_Rating, Total_Sessions, Mentor_Level)
                 VALUES (?, ?, 0.00, 0, 'Bronze')`,
                [User_Id, Skill_Id]
            );
            await db.query(
                `UPDATE User_Skill SET Mentor_Level = 'Bronze' WHERE User_Skill_Id = ?`,
                [userSkillId]
            );
        }

        res.json({
            message: `Skill ${newStatus.toLowerCase()} successfully.`,
            status: newStatus
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ─────────────────────────────────────────────
// INTERNAL UTIL: Re-evaluate mentor level for a skill
// Called after every completed session from sessionController
// Bronze → Silver: Score >= 20  |  Silver → Gold: Score >= 50
// ─────────────────────────────────────────────
exports.evaluateMentorLevel = async (mentorId, skillId) => {
    const [rows] = await db.query(
        `SELECT * FROM Levelling_Data WHERE Mentor_Id = ? AND Skill_Id = ?`,
        [mentorId, skillId]
    );
    if (rows.length === 0) return;

    const { Score } = rows[0];
    let newLevel = 'Bronze';
    if (Score >= 50) newLevel = 'Gold';
    else if (Score >= 20) newLevel = 'Silver';

    await db.query(
        `UPDATE Levelling_Data 
         SET Mentor_Level = ?, Last_Evaluation_Date = CURRENT_DATE 
         WHERE Mentor_Id = ? AND Skill_Id = ?`,
        [newLevel, mentorId, skillId]
    );
    await db.query(
        `UPDATE User_Skill SET Mentor_Level = ? 
         WHERE User_Id = ? AND Skill_Id = ? AND Role = 'Mentor'`,
        [newLevel, mentorId, skillId]
    );
};