const db = require('../config/db');

// ─────────────────────────────────────────────
// GET /api/mentors/search
// Search & filter mentors
// Query params:
//   skill_id, category, level (Bronze/Silver/Gold),
//   university, keyword (name), sort (rating|sessions|newest)
//   page, limit
// ─────────────────────────────────────────────
exports.searchMentors = async (req, res) => {
    const {
        skill_id,
        category,
        level,
        university,
        keyword,
        sort = 'rating',
        page = 1,
        limit = 10
    } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const params = [];

    // Build dynamic WHERE clauses
    const conditions = [
        `u.Status = 'Active'`,
        `us.Role = 'Mentor'`,
        `us.Verification_Status = 'Verified'`
    ];

    if (skill_id) {
        conditions.push(`us.Skill_Id = ?`);
        params.push(skill_id);
    }
    if (category) {
        conditions.push(`s.Category = ?`);
        params.push(category);
    }
    if (level) {
        conditions.push(`us.Mentor_Level = ?`);
        params.push(level);
    }
    if (university) {
        conditions.push(`u.University LIKE ?`);
        params.push(`%${university}%`);
    }
    if (keyword) {
        conditions.push(`(u.First_Name LIKE ? OR u.Last_Name LIKE ?)`);
        params.push(`%${keyword}%`, `%${keyword}%`);
    }

    const whereClause = conditions.join(' AND ');

    // Sort options
    const sortMap = {
        rating:   'ld.Average_Rating DESC',
        sessions: 'ld.Total_Sessions DESC',
        newest:   'u.Created_At DESC',
        level:    'FIELD(us.Mentor_Level, "Gold", "Silver", "Bronze")'
    };
    const orderBy = sortMap[sort] || sortMap['rating'];

    try {
        // Total count for pagination
        const [countRows] = await db.query(
            `SELECT COUNT(DISTINCT u.User_Id) AS total
             FROM User u
             JOIN User_Skill us ON us.User_Id = u.User_Id
             JOIN Skill s       ON s.Skill_Id = us.Skill_Id
             LEFT JOIN Levelling_Data ld ON ld.Mentor_Id = u.User_Id AND ld.Skill_Id = us.Skill_Id
             WHERE ${whereClause}`,
            params
        );
        const total = countRows[0].total;

        // Main query
        const [mentors] = await db.query(
            `SELECT
                u.User_Id, u.First_Name, u.Last_Name, u.University, u.Bio,
                s.Skill_Id, s.Skill_Name, s.Category,
                us.Mentor_Level,
                COALESCE(ld.Average_Rating, 0) AS Average_Rating,
                COALESCE(ld.Total_Sessions, 0) AS Total_Sessions,
                COALESCE(ld.Score, 0)           AS Score
             FROM User u
             JOIN User_Skill us ON us.User_Id = u.User_Id
             JOIN Skill s       ON s.Skill_Id = us.Skill_Id
             LEFT JOIN Levelling_Data ld ON ld.Mentor_Id = u.User_Id AND ld.Skill_Id = us.Skill_Id
             WHERE ${whereClause}
             ORDER BY ${orderBy}
             LIMIT ? OFFSET ?`,
            [...params, parseInt(limit), offset]
        );

        res.json({
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            total_pages: Math.ceil(total / limit),
            mentors
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ─────────────────────────────────────────────
// GET /api/mentors/featured
// Top 6 mentors by overall score (for homepage)
// ─────────────────────────────────────────────
exports.getFeaturedMentors = async (req, res) => {
    try {
        const [mentors] = await db.query(
            `SELECT
                u.User_Id, u.First_Name, u.Last_Name, u.University, u.Bio,
                s.Skill_Name, s.Category,
                us.Mentor_Level,
                COALESCE(ld.Average_Rating, 0) AS Average_Rating,
                COALESCE(ld.Total_Sessions, 0) AS Total_Sessions
             FROM Levelling_Data ld
             JOIN User       u  ON u.User_Id  = ld.Mentor_Id
             JOIN Skill      s  ON s.Skill_Id = ld.Skill_Id
             JOIN User_Skill us ON us.User_Id = ld.Mentor_Id AND us.Skill_Id = ld.Skill_Id AND us.Role = 'Mentor'
             WHERE u.Status = 'Active' AND us.Verification_Status = 'Verified'
             ORDER BY ld.Score DESC
             LIMIT 6`
        );
        res.json(mentors);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ─────────────────────────────────────────────
// GET /api/mentors/skills/categories
// Distinct skill categories (for filter dropdowns)
// ─────────────────────────────────────────────
exports.getCategories = async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT DISTINCT Category FROM Skill ORDER BY Category`
        );
        res.json(rows.map(r => r.Category));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};