const db = require('../config/db');
const path = require('path');

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
            `SELECT us.User_Skill_Id, s.Skill_Id, s.Skill_Name, s.Category,
                    us.Mentor_Level, us.Verification_Status, us.Certificates,
                    COALESCE(ld.Average_Rating, 0) AS Average_Rating,
                    COALESCE(ld.Total_Sessions, 0) AS Total_Sessions,
                    COALESCE(ld.Score, 0)           AS Score,
                    ld.Last_Evaluation_Date
             FROM User_Skill us
             JOIN Skill s ON s.Skill_Id = us.Skill_Id
             LEFT JOIN Levelling_Data ld 
                    ON ld.Mentor_Id = us.User_Id AND ld.Skill_Id = us.Skill_Id
             WHERE us.User_Id = ? AND us.Role = 'Mentor'
             ORDER BY us.Verification_Status, s.Skill_Name`,
            [userId]
        );
        res.json(skills);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ─────────────────────────────────────────────
// POST /api/mentor/skills/add
// Submit a new skill for verification (with certificate upload)
// Body: { skill_id }  File: certificate (multipart)
// ─────────────────────────────────────────────
exports.addSkill = async (req, res) => {
    const userId = req.user.id;
    const { skill_id } = req.body;

    if (!skill_id) return res.status(400).json({ message: "skill_id is required." });

    try {
        // Check skill exists
        const [skillRows] = await db.query(`SELECT * FROM Skill WHERE Skill_Id = ?`, [skill_id]);
        if (skillRows.length === 0) return res.status(404).json({ message: "Skill not found." });

        // Prevent duplicate submission
        const [existing] = await db.query(
            `SELECT * FROM User_Skill WHERE User_Id = ? AND Skill_Id = ? AND Role = 'Mentor'`,
            [userId, skill_id]
        );
        if (existing.length > 0) {
            return res.status(409).json({
                message: "You have already submitted this skill.",
                status: existing[0].Verification_Status
            });
        }

        // Certificate file path (if uploaded via multer)
        const certificatePath = req.file ? req.file.path : null;

        await db.query(
            `INSERT INTO User_Skill (User_Id, Skill_Id, Role, Verification_Status, Certificates)
             VALUES (?, ?, 'Mentor', 'Pending', ?)`,
            [userId, skill_id, certificatePath]
        );

        res.status(201).json({
            message: "Skill submitted for verification. You will be notified once reviewed.",
            status: "Pending"
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
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
    const { action } = req.body; // 'approve' | 'reject'

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

        // If approved then seed Levelling_Data row (score starts at 0)
        if (newStatus === 'Verified') {
            const { User_Id, Skill_Id } = rows[0];
            await db.query(
                `INSERT IGNORE INTO Levelling_Data (Mentor_Id, Skill_Id, Average_Rating, Total_Sessions, Mentor_Level)
                 VALUES (?, ?, 0.00, 0, 'Bronze')`,
                [User_Id, Skill_Id]
            );
            // Sync back to User_Skill
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