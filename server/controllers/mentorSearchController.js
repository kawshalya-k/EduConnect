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
        const categoryList = category.split(',').map(c => c.trim().toLowerCase());
        const matchedSkills = [];
        for (const cat of categoryList) {
            if (cat === 'web development') {
                matchedSkills.push('JavaScript', 'Python', 'SQL', 'Git');
            } else if (cat === 'ui/ux design' || cat === 'ui/ ux strategy') {
                matchedSkills.push('Figma', 'Information Architecture', 'UI/ UX Strategy');
            } else if (cat === 'data science') {
                matchedSkills.push('Statistics', 'NLP', 'Python', 'Data Science');
            } else if (cat === 'mobile development' || cat === 'mobile dev') {
                matchedSkills.push('Android Development', 'Flutter', 'Android');
            }
        }
        
        if (matchedSkills.length > 0) {
            const uniqueSkills = [...new Set(matchedSkills)];
            const placeholders = uniqueSkills.map(() => '?').join(',');
            conditions.push(`s.Skill_Name IN (${placeholders})`);
            params.push(...uniqueSkills);
        } else {
            const placeholders = categoryList.map(() => '?').join(',');
            conditions.push(`s.Category IN (${placeholders})`);
            params.push(...categoryList);
        }
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

// ─────────────────────────────────────────────
// GET /api/mentors/ai-search
// AI Semantic Search for Mentors
// Query params: query
// ─────────────────────────────────────────────
exports.aiSearchMentors = async (req, res) => {
  const { query } = req.query;
  if (!query) return res.status(400).json({ error: 'Query required' });

  try {
    const { embedText } = require('../config/gemini');
    const pineconeIndex = require('../config/pinecone');

    // Embed the user's natural language query
    const queryVector = await embedText(query);

    // Search Pinecone for top 10 similar mentor vectors
    const results = await pineconeIndex.query({
      vector: queryVector,
      topK: 10,
      includeMetadata: true,
    });

    let matches = results.matches || [];

    // Fallback logic for local testing without API keys
    if (matches.length === 0 && !process.env.PINECONE_API_KEY) {
      console.log('[AI Search] Pinecone API key not set. Using database mock fallback for query.');
      const [allVerified] = await db.query(
        `SELECT us.User_Id, us.Skill_Id 
         FROM User_Skill us 
         WHERE us.Role = 'Mentor' AND (us.Verification_Status = 1 OR us.Verification_Status = 'Verified') 
         LIMIT 10`
      );
      matches = allVerified.map(row => ({
        score: 0.8,
        metadata: { userId: row.User_Id, skillId: row.Skill_Id }
      }));
    }

    // Extract mentor IDs from results
    const mentorIds = matches
      .filter(m => m.score > 0.6) // relevance threshold
      .map(m => m.metadata.userId);

    if (mentorIds.length === 0) return res.json({ mentors: [] });

    // Fetch full mentor data from MySQL
    const placeholders = mentorIds.map(() => '?').join(',');
    const [mentors] = await db.query(
      `SELECT DISTINCT u.User_Id, u.First_Name, u.Last_Name, u.University, u.Bio, u.Avatar,
              s.Skill_Name, s.Category, us.Mentor_Level,
              COALESCE(ld.Average_Rating, 0) AS Average_Rating,
              COALESCE(ld.Total_Sessions, 0) AS Total_Sessions
       FROM User u
       JOIN User_Skill us ON us.User_Id = u.User_Id
       JOIN Skill s ON s.Skill_Id = us.Skill_Id
       LEFT JOIN Levelling_Data ld ON ld.Mentor_Id = u.User_Id AND ld.Skill_Id = us.Skill_Id
       WHERE u.User_Id IN (${placeholders}) AND (us.Verification_Status = 1 OR us.Verification_Status = 'Verified')`,
      mentorIds
    );

    // Re-order mentors to match Pinecone's relevance ranking
    const ordered = mentorIds
      .map(id => mentors.find(m => m.User_Id === id))
      .filter(Boolean);

    res.json({ mentors: ordered, source: 'ai' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ─────────────────────────────────────────────
// GET /api/mentors/recommended
// AI Recommendations for Learner Dashboard
// ─────────────────────────────────────────────
exports.getRecommendedMentors = async (req, res) => {
  const userId = req.user.id;
  try {
    const { embedText } = require('../config/gemini');
    const pineconeIndex = require('../config/pinecone');

    // 1. Fetch skills the learner wants to learn
    const [learnSkills] = await db.query(
      `SELECT s.Skill_Name 
       FROM User_Skill us 
       JOIN Skill s ON s.Skill_Id = us.Skill_Id 
       WHERE us.User_Id = ? AND us.Role = 'Learner'`,
      [userId]
    );

    let queryText = 'highly rated student mentors';
    if (learnSkills.length > 0) {
      const list = learnSkills.map(s => s.Skill_Name).join(', ');
      queryText = `learner interested in learning: ${list}`;
    }

    // 2. Generate embedding for query
    const queryVector = await embedText(queryText);

    // 3. Query Pinecone for top 4 matches
    const results = await pineconeIndex.query({
      vector: queryVector,
      topK: 4,
      includeMetadata: true
    });

    let matches = results.matches || [];

    // Fallback if empty and mock mode
    if (matches.length === 0 && !process.env.PINECONE_API_KEY) {
      const [allVerified] = await db.query(
        `SELECT us.User_Id, us.Skill_Id 
         FROM User_Skill us 
         WHERE us.Role = 'Mentor' AND (us.Verification_Status = 1 OR us.Verification_Status = 'Verified') 
         LIMIT 4`
      );
      matches = allVerified.map(row => ({
        score: 0.8,
        metadata: { userId: row.User_Id, skillId: row.Skill_Id }
      }));
    }

    const mentorIds = matches.map(m => m.metadata.userId);
    if (mentorIds.length === 0) return res.json([]);

    // Fetch full data
    const placeholders = mentorIds.map(() => '?').join(',');
    const [mentors] = await db.query(
      `SELECT DISTINCT u.User_Id as id, u.First_Name, u.Last_Name, u.University, u.Bio, u.Avatar as avatar,
              s.Skill_Name, s.Category, us.Mentor_Level as level,
              COALESCE(ld.Average_Rating, 5.0) AS rating,
              COALESCE(ld.Total_Sessions, 0) AS reviews,
              '100 Skill Coins' as price
       FROM User u
       JOIN User_Skill us ON us.User_Id = u.User_Id
       JOIN Skill s ON s.Skill_Id = us.Skill_Id
       LEFT JOIN Levelling_Data ld ON ld.Mentor_Id = u.User_Id AND ld.Skill_Id = us.Skill_Id
       WHERE u.User_Id IN (${placeholders}) AND (us.Verification_Status = 1 OR us.Verification_Status = 'Verified')`,
      mentorIds
    );

    // Format fields to match frontend expectations (RecommendedMentorCard / MentorCard)
    const formatted = mentors.map(row => ({
      id: row.id,
      name: `${row.First_Name} ${row.Last_Name}`,
      avatar: row.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${row.First_Name}&backgroundColor=E2E8F0`,
      level: row.level || 'Bronze',
      role: row.Bio || 'Mentor',
      rating: Number(row.rating).toFixed(1),
      reviews: row.reviews,
      price: row.price,
      skills: [row.Skill_Name]
    }));

    // Order to match Pinecone relevance
    const ordered = mentorIds
      .map(id => formatted.find(m => m.id === id))
      .filter(Boolean);

    res.json(ordered);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ─────────────────────────────────────────────
// GET /api/mentors/verified-count
// Get total count of unique active, verified mentors
// ─────────────────────────────────────────────
exports.getVerifiedMentorsCount = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT COUNT(DISTINCT u.User_Id) AS count
       FROM User u
       JOIN User_Skill us ON us.User_Id = u.User_Id
       WHERE u.Status = 'Active'
         AND us.Role = 'Mentor'
         AND (us.Verification_Status = 1 OR us.Verification_Status = 'Verified')`
    );
    res.json({ count: rows[0].count || 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};