const db = require('../config/db');

// GET /api/mentor/dashboard
// Full dashboard stats for the logged-in mentor

exports.getDashboard = async (req, res) => {
    const mentorId = req.user.id;
    try {
        // 1. Session summary counts
        const [sessionStats] = await db.query(
            `SELECT
                COUNT(*)                                        AS Total_Sessions,
                SUM(Status = 'Completed')                      AS Completed,
                SUM(Status = 'Pending')                        AS Pending,
                SUM(Status = 'Scheduled')                      AS Scheduled,
                SUM(Status = 'Cancelled')                      AS Cancelled,
                ROUND(AVG(CASE WHEN Rating IS NOT NULL THEN Rating END), 2) AS Overall_Rating,
                SUM(Reward)                                    AS Total_Earned
             FROM Session WHERE Mentor_Id = ?`,
            [mentorId]
        );

        // 2. Per-skill performance
        const [skillStats] = await db.query(
            `SELECT s.Skill_Name, s.Category,
                      ld.Mentor_Level, ld.Average_Rating, ld.Total_Sessions, ld.Score,
                      ld.Last_Evaluation_Date
                  FROM Levelling_Data ld
                  JOIN Skill s ON s.Skill_Id = ld.Skill_Id
                  WHERE ld.Mentor_Id = ?
                  ORDER BY ld.Score DESC`,
            [mentorId]
        );

        // 3. Recent 5 completed sessions with reviews
        const [recentSessions] = await db.query(
            `SELECT se.Session_Id, se.Date, se.Duration, se.Rating, se.Feedback,
                    se.Reward, se.Session_Type,
                    s.Skill_Name,
                    u.First_Name, u.Last_Name
             FROM Session se
             JOIN Skill s ON s.Skill_Id = se.Skill_Id
             JOIN User  u ON u.User_Id  = se.Learner_Id
             WHERE se.Mentor_Id = ? AND se.Status = 'Completed'
             ORDER BY se.Date DESC
             LIMIT 5`,
            [mentorId]
        );

        // 4. Wallet balance
        const [walletRow] = await db.query(
            `SELECT skill_coins AS Wallet_Balance FROM User WHERE User_Id = ?`, [mentorId]
        );

        // 5. Badges earned
        const [badges] = await db.query(
            `SELECT b.Badge_Name, b.Description, ub.Awarded_Date
             FROM User_Badge ub
             JOIN Badge b ON b.Badge_Id = ub.Badge_Id
             WHERE ub.User_Id = ?
             ORDER BY ub.Awarded_Date DESC`,
            [mentorId]
        );

        res.json({
            session_stats: sessionStats[0],
            skill_stats: skillStats,
            recent_sessions: recentSessions,
            wallet_balance: walletRow[0]?.Wallet_Balance ?? 0,
            badges
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET /api/mentor/dashboard/earnings
// Monthly earnings breakdown (last 6 months)

exports.getEarnings = async (req, res) => {
    const mentorId = req.user.id;
    try {
        const [monthly] = await db.query(
            `SELECT
                DATE_FORMAT(Date, '%Y-%m') AS Month,
                SUM(Reward)                AS Total_Earned,
                COUNT(*)                   AS Sessions_Count
             FROM Session
             WHERE Mentor_Id = ? AND Status = 'Completed'
               AND Date >= DATE_SUB(CURRENT_DATE, INTERVAL 6 MONTH)
             GROUP BY DATE_FORMAT(Date, '%Y-%m')
             ORDER BY Month ASC`,
            [mentorId]
        );

        const [allTime] = await db.query(
            `SELECT SUM(Reward) AS All_Time_Earned FROM Session
             WHERE Mentor_Id = ? AND Status = 'Completed'`,
            [mentorId]
        );

        res.json({
            monthly_breakdown: monthly,
            all_time_earned: allTime[0]?.All_Time_Earned ?? 0
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET /api/mentor/dashboard/reviews
// All reviews received by the mentor

exports.getReviews = async (req, res) => {
    const mentorId = req.user.id;
    try {
        const [reviews] = await db.query(
            `SELECT se.Session_Id, se.Date, se.Rating, se.Feedback,
                    s.Skill_Name,
                    u.First_Name, u.Last_Name, u.University
             FROM Session se
             JOIN Skill s ON s.Skill_Id = se.Skill_Id
             JOIN User  u ON u.User_Id  = se.Learner_Id
             WHERE se.Mentor_Id = ? AND se.Status = 'Completed' AND se.Rating IS NOT NULL
             ORDER BY se.Date DESC`,
            [mentorId]
        );

        const [summary] = await db.query(
            `SELECT
                COUNT(*)                    AS Total_Reviews,
                ROUND(AVG(Rating), 2)       AS Average_Rating,
                SUM(Rating = 5)             AS Five_Star,
                SUM(Rating = 4)             AS Four_Star,
                SUM(Rating = 3)             AS Three_Star,
                SUM(Rating = 2)             AS Two_Star,
                SUM(Rating = 1)             AS One_Star
             FROM Session
             WHERE Mentor_Id = ? AND Status = 'Completed' AND Rating IS NOT NULL`,
            [mentorId]
        );

        res.json({ summary: summary[0], reviews });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};