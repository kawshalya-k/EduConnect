const db = require('../config/db');

// ─────────────────────────────────────────────
// GET /api/mentor/profile
// Get the logged-in mentor's own profile
// ─────────────────────────────────────────────
exports.getMyProfile = async (req, res) => {
    const userId = req.user.id;
    try {
        // Core user info
        const [userRows] = await db.query(
            `SELECT User_Id, First_Name, Last_Name, Email, University, Bio, 
                    Wallet_Balance, Status, Created_At
             FROM User WHERE User_Id = ?`,
            [userId]
        );
        if (userRows.length === 0) return res.status(404).json({ message: "User not found." });
        const profile = userRows[0];

        // Verified mentor skills with levelling data
        const [skills] = await db.query(
            `SELECT s.Skill_Id, s.Skill_Name, s.Category,
                    us.Mentor_Level, us.Verification_Status, us.Certificates,
                    COALESCE(ld.Average_Rating, 0)  AS Average_Rating,
                    COALESCE(ld.Total_Sessions, 0)  AS Total_Sessions,
                    COALESCE(ld.Score, 0)            AS Score
             FROM User_Skill us
             JOIN Skill s ON s.Skill_Id = us.Skill_Id
             LEFT JOIN Levelling_Data ld 
                    ON ld.Mentor_Id = us.User_Id AND ld.Skill_Id = us.Skill_Id
             WHERE us.User_Id = ? AND us.Role = 'Mentor'
             ORDER BY s.Skill_Name`,
            [userId]
        );

        // Badges
        const [badges] = await db.query(
            `SELECT b.Badge_Id, b.Badge_Name, b.Description, ub.Awarded_Date
             FROM User_Badge ub
             JOIN Badge b ON b.Badge_Id = ub.Badge_Id
             WHERE ub.User_Id = ?`,
            [userId]
        );

        // Review summary
        const [reviewSummary] = await db.query(
            `SELECT COUNT(*) AS Total_Reviews,
                    ROUND(AVG(Rating), 2) AS Overall_Rating
             FROM Session
             WHERE Mentor_Id = ? AND Status = 'Completed' AND Rating IS NOT NULL`,
            [userId]
        );

        res.json({
            ...profile,
            skills,
            badges,
            review_summary: reviewSummary[0]
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ─────────────────────────────────────────────
// PUT /api/mentor/profile
// Update bio and university
// ─────────────────────────────────────────────
exports.updateProfile = async (req, res) => {
    const userId = req.user.id;
    const { bio, university } = req.body;
    try {
        await db.query(
            `UPDATE User SET Bio = ?, University = ? WHERE User_Id = ?`,
            [bio, university, userId]
        );
        res.json({ message: "Profile updated successfully." });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ─────────────────────────────────────────────
// GET /api/mentor/profile/:mentorId
// Public profile view (for learners/search)
// ─────────────────────────────────────────────
exports.getPublicProfile = async (req, res) => {
    const { mentorId } = req.params;
    try {
        const [userRows] = await db.query(
            `SELECT User_Id, First_Name, Last_Name, University, Bio, Created_At
             FROM User WHERE User_Id = ? AND Status = 'Active'`,
            [mentorId]
        );
        if (userRows.length === 0) return res.status(404).json({ message: "Mentor not found." });

        const [skills] = await db.query(
            `SELECT s.Skill_Id, s.Skill_Name, s.Category,
                    us.Mentor_Level,
                    COALESCE(ld.Average_Rating, 0) AS Average_Rating,
                    COALESCE(ld.Total_Sessions, 0) AS Total_Sessions
             FROM User_Skill us
             JOIN Skill s ON s.Skill_Id = us.Skill_Id
             LEFT JOIN Levelling_Data ld 
                    ON ld.Mentor_Id = us.User_Id AND ld.Skill_Id = us.Skill_Id
             WHERE us.User_Id = ? AND us.Role = 'Mentor' AND us.Verification_Status = 'Verified'`,
            [mentorId]
        );

        const [reviews] = await db.query(
            `SELECT se.Rating, se.Feedback,
                    u.First_Name, u.Last_Name,
                    s.Skill_Name, se.Date
             FROM Session se
             JOIN User u  ON u.User_Id  = se.Learner_Id
             JOIN Skill s ON s.Skill_Id = se.Skill_Id
             WHERE se.Mentor_Id = ? AND se.Status = 'Completed' AND se.Rating IS NOT NULL
             ORDER BY se.Date DESC
             LIMIT 10`,
            [mentorId]
        );

        const [badges] = await db.query(
            `SELECT b.Badge_Name, b.Description, ub.Awarded_Date
             FROM User_Badge ub
             JOIN Badge b ON b.Badge_Id = ub.Badge_Id
             WHERE ub.User_Id = ?`,
            [mentorId]
        );

        res.json({
            ...userRows[0],
            skills,
            reviews,
            badges
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};