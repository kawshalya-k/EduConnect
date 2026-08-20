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
        levels,
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
        `(us.Verification_Status = 'Verified' OR us.Verification_Status = 1 OR us.Verification_Status = '1')`
    ];

    if (skill_id) {
        conditions.push(`us.Skill_Id = ?`);
        params.push(skill_id);
    }
    if (category) {
        const categoryList = category.split(',').map(c => c.trim().toLowerCase());
        const matchedSkills = [];
        for (const cat of categoryList) {
            if (cat === 'data science') {
                matchedSkills.push('Python', 'SQL', 'Data Science', 'NLP');
            } else if (cat === 'mobile development' || cat === 'mobile dev') {
                matchedSkills.push('Flutter', 'Android Development', 'Java');
            } else if (cat === 'technical') {
                matchedSkills.push('SQL', 'Information Architecture', 'NLP', 'Java');
            } else if (cat === 'ui/ux design') {
                matchedSkills.push('UI/UX Design', 'Information Architecture');
            } else if (cat === 'web development') {
                matchedSkills.push('Python', 'Java', 'JavaScript');
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
    
    const activeLevel = level || levels;
    const canonicalLevel = `CASE
      WHEN UPPER(COALESCE(ld.Mentor_Level, us.Mentor_Level)) IN ('GOLD', 'GOLD MENTOR') THEN 'Gold'
      WHEN UPPER(COALESCE(ld.Mentor_Level, us.Mentor_Level)) IN ('SILVER', 'SILVER MENTOR') THEN 'Silver'
      ELSE 'Bronze'
    END`;
    let queryLevels = [];
    if (activeLevel) {
        activeLevel.split(',').forEach(l => {
            const clean = l.trim().toLowerCase();
            if (clean === 'gold') {
          queryLevels.push('Gold');
            } else if (clean === 'silver') {
          queryLevels.push('Silver');
            } else if (clean === 'bronze') {
          queryLevels.push('Bronze');
            } else {
                queryLevels.push(clean.charAt(0).toUpperCase() + clean.slice(1));
            }
        });
        const placeholders = queryLevels.map(() => '?').join(',');
      conditions.push(`${canonicalLevel} IN (${placeholders})`);
        params.push(...queryLevels);
    }
    if (university) {
        conditions.push(`u.University LIKE ?`);
        params.push(`%${university}%`);
    }
    if (keyword) {
        conditions.push(`(u.First_Name LIKE ? OR u.Last_Name LIKE ? OR s.Skill_Name LIKE ? OR s.Category LIKE ? OR u.Bio LIKE ?)`);
        params.push(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`, `%${keyword}%`, `%${keyword}%`);
    }

    const whereClause = conditions.join(' AND ');

    // Sort options with GROUP BY compatible aggregates
    const sortMap = {
        rating:   'MAX(COALESCE(ld.Average_Rating, 0)) DESC',
        sessions: 'SUM(COALESCE(ld.Total_Sessions, 0)) DESC',
        newest:   'MAX(u.Created_At) DESC',
        level:    `FIELD(MAX(${canonicalLevel}), "Gold", "Silver", "Bronze")`
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

        // 1. Fetch distinct mentor user IDs for this page (grouped for compatibility)
        const [mentorIdsRows] = await db.query(
            `SELECT u.User_Id
             FROM User u
             JOIN User_Skill us ON us.User_Id = u.User_Id
             JOIN Skill s       ON s.Skill_Id = us.Skill_Id
             LEFT JOIN Levelling_Data ld ON ld.Mentor_Id = u.User_Id AND ld.Skill_Id = us.Skill_Id
             WHERE ${whereClause}
             GROUP BY u.User_Id
             ORDER BY ${orderBy}
             LIMIT ? OFFSET ?`,
            [...params, parseInt(limit), offset]
        );
        const mentorIds = mentorIdsRows.map(r => r.User_Id);

        let paginatedMentors = [];
        if (mentorIds.length > 0) {
            const placeholders = mentorIds.map(() => '?').join(',');
            const levelFilter = activeLevel
              ? ` AND ${canonicalLevel} IN (${queryLevels.map(() => '?').join(',')})`
              : '';
            const [rows] = await db.query(
                `SELECT u.User_Id, u.First_Name, u.Last_Name, u.University, u.Bio, u.Avatar,
                  s.Skill_Name, s.Category, ${canonicalLevel} AS Mentor_Level,
                        COALESCE(ld.Average_Rating, 0) AS Average_Rating,
                        COALESCE(ld.Total_Sessions, 0) AS Total_Sessions
                 FROM User u
                 JOIN User_Skill us ON us.User_Id = u.User_Id
                 JOIN Skill s       ON s.Skill_Id = us.Skill_Id
                 LEFT JOIN Levelling_Data ld ON ld.Mentor_Id = u.User_Id AND ld.Skill_Id = us.Skill_Id
                 WHERE u.User_Id IN (${placeholders}) 
                   AND us.Role = 'Mentor' 
                   AND (us.Verification_Status = 'Verified' OR us.Verification_Status = 1 OR us.Verification_Status = '1')${levelFilter}
                 ORDER BY FIELD(${canonicalLevel}, 'Gold', 'Silver', 'Bronze') DESC`,
                [...mentorIds, ...queryLevels]
            );

            // Group by User_Id to combine multiple skills and avoid duplicate mentor cards
            const grouped = {};
            for (const r of rows) {
                if (!grouped[r.User_Id]) {
                    grouped[r.User_Id] = {
                        User_Id: r.User_Id,
                        First_Name: r.First_Name,
                        Last_Name: r.Last_Name,
                        University: r.University,
                        Bio: r.Bio,
                        Avatar: r.Avatar,
                        Mentor_Level: r.Mentor_Level,
                        Average_Rating: r.Average_Rating,
                        Total_Sessions: r.Total_Sessions,
                        skills: []
                    };
                }
                if (r.Skill_Name && !grouped[r.User_Id].skills.includes(r.Skill_Name)) {
                    grouped[r.User_Id].skills.push(r.Skill_Name);
                }
            }
            
            // Keep original order of mentorIds
            paginatedMentors = mentorIds.map(id => grouped[id]).filter(Boolean);
        }

        res.json({
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            total_pages: Math.ceil(total / limit),
            mentors: paginatedMentors
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
                CASE
                  WHEN UPPER(ld.Mentor_Level) IN ('GOLD', 'GOLD MENTOR') THEN 'Gold'
                  WHEN UPPER(ld.Mentor_Level) IN ('SILVER', 'SILVER MENTOR') THEN 'Silver'
                  ELSE 'Bronze'
                END AS Mentor_Level,
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
        const [sessionCountRows] = await db.query('SELECT COUNT(*) AS total FROM Session');
        const totalSessions = sessionCountRows[0]?.total || 0;
        res.json({ mentors, totalSessions });
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
         WHERE us.Role = 'Mentor' AND (us.Verification_Status = 'Verified' OR us.Verification_Status = 1 OR us.Verification_Status = '1') 
         LIMIT 10`
      );
      matches = allVerified.map(row => ({
        score: 0.8,
        metadata: { userId: row.User_Id, skillId: row.Skill_Id }
      }));
    }

    // Extract unique mentor IDs from results
    const mentorIds = [...new Set(matches
      .filter(m => m.score > 0.6) // relevance threshold
      .map(m => m.metadata.userId)
    )];

    if (mentorIds.length === 0) return res.json({ mentors: [] });

    // Fetch full mentor data from MySQL
    const placeholders = mentorIds.map(() => '?').join(',');
    const [mentors] = await db.query(
      `SELECT u.User_Id, u.First_Name, u.Last_Name, u.University, u.Bio, u.Avatar,
              s.Skill_Name, s.Category, us.Mentor_Level,
              COALESCE(ld.Average_Rating, 0) AS Average_Rating,
              COALESCE(ld.Total_Sessions, 0) AS Total_Sessions
       FROM User u
       JOIN User_Skill us ON us.User_Id = u.User_Id
       JOIN Skill s ON s.Skill_Id = us.Skill_Id
       LEFT JOIN Levelling_Data ld ON ld.Mentor_Id = u.User_Id AND ld.Skill_Id = us.Skill_Id
       WHERE u.User_Id IN (${placeholders}) 
         AND us.Role = 'Mentor' 
         AND (us.Verification_Status = 'Verified' OR us.Verification_Status = 1 OR us.Verification_Status = '1')`,
      mentorIds
    );

    // Group by User_Id to combine multiple skills and avoid duplicate rows
    const grouped = {};
    for (const r of mentors) {
      if (!grouped[r.User_Id]) {
        grouped[r.User_Id] = {
          User_Id: r.User_Id,
          First_Name: r.First_Name,
          Last_Name: r.Last_Name,
          University: r.University,
          Bio: r.Bio,
          Avatar: r.Avatar,
          Mentor_Level: r.Mentor_Level,
          Average_Rating: r.Average_Rating,
          Total_Sessions: r.Total_Sessions,
          skills: []
        };
      }
      if (r.Skill_Name && !grouped[r.User_Id].skills.includes(r.Skill_Name)) {
        grouped[r.User_Id].skills.push(r.Skill_Name);
      }
    }

    // Re-order mentors to match Pinecone's relevance ranking
    const ordered = mentorIds
      .map(id => grouped[id])
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
    const { recommendMentorsAI } = require('../config/gemini');

    // 1. Fetch skills the learner wants to learn (wishlist)
    const [learnSkills] = await db.query(
      `SELECT s.Skill_Id, s.Skill_Name, s.Category 
       FROM User_Skill us 
       JOIN Skill s ON s.Skill_Id = us.Skill_Id 
       WHERE us.User_Id = ? AND us.Role = 'Learner'`,
      [userId]
    );

    // 2. Fetch all active, verified mentors from MySQL (Verification_Status = 'Verified' or 1)
    const [allMentors] = await db.query(
      `SELECT u.User_Id, u.First_Name, u.Last_Name, u.University, u.Bio, u.Avatar as avatar,
              s.Skill_Id, s.Skill_Name, s.Category, us.Mentor_Level,
              COALESCE(ld.Average_Rating, 5.0) AS rating,
              COALESCE(ld.Total_Sessions, 0) AS reviews,
              '100 Skill Coins' as price
       FROM User u
       JOIN User_Skill us ON us.User_Id = u.User_Id
       JOIN Skill s ON s.Skill_Id = us.Skill_Id
       LEFT JOIN Levelling_Data ld ON ld.Mentor_Id = u.User_Id AND ld.Skill_Id = us.Skill_Id
       WHERE us.Role = 'Mentor' 
         AND (us.Verification_Status = 'Verified' OR us.Verification_Status = 1 OR us.Verification_Status = '1')
         AND u.Status = 'Active'
         AND u.User_Id != ?`,
      [userId]
    );

    // Group mentors by User_Id to combine multiple skills and avoid duplicate rows
    const mentorsMap = {};
    for (const row of allMentors) {
      if (!mentorsMap[row.User_Id]) {
        mentorsMap[row.User_Id] = {
          userId: row.User_Id,
          name: `${row.First_Name} ${row.Last_Name}`,
          firstName: row.First_Name,
          lastName: row.Last_Name,
          avatar: row.avatar || '/default-avatar.svg',
          mentorLevel: row.Mentor_Level || 'Bronze',
          title: row.Bio || 'Mentor',
          university: row.University,
          rating: Number(row.rating).toFixed(1),
          reviews: row.reviews,
          price: row.price,
          skills: [],
          skillIds: []
        };
      }
      if (row.Skill_Name && !mentorsMap[row.User_Id].skills.includes(row.Skill_Name)) {
        mentorsMap[row.User_Id].skills.push(row.Skill_Name);
      }
      if (row.Skill_Id && !mentorsMap[row.User_Id].skillIds.includes(row.Skill_Id)) {
        mentorsMap[row.User_Id].skillIds.push(row.Skill_Id);
      }
    }
    const mentorsList = Object.values(mentorsMap);

    let recommendedIds = null;
    if (process.env.GEMINI_API_KEY) {
      // Pass the wishlist and mentorsList to Gemini for generative matching
      recommendedIds = await recommendMentorsAI(learnSkills, mentorsList);
    }

    let ordered = [];
    if (recommendedIds && recommendedIds.length > 0) {
      const uniqueIds = [...new Set(recommendedIds)];
      ordered = uniqueIds
        .map(id => mentorsMap[id])
        .filter(Boolean);
    }

    // Fallback: If Gemini is not set up or returned no matches, run smart database wishlist-matching
    if (ordered.length === 0) {
      console.log('[AI Recommendation] Gemini returned no matches or is not set up. Using database matching fallback.');
      
      if (mentorsList.length > 0) {
        const wishlistSkillIds = learnSkills.map(s => s.Skill_Id);
        const wishlistSkillNames = learnSkills.map(s => s.Skill_Name.trim().toLowerCase());

        const wishlistMentors = mentorsList.filter(m => 
          m.skillIds.some(id => wishlistSkillIds.includes(id)) ||
          m.skills.some(name => wishlistSkillNames.includes(name.trim().toLowerCase()))
        );

        const wishlistMentorIds = wishlistMentors.map(m => m.userId);
        const otherMentors = mentorsList.filter(m => !wishlistMentorIds.includes(m.userId));

        if (wishlistMentors.length > 0) {
          ordered = [...wishlistMentors, ...otherMentors];
        } else {
          ordered = otherMentors; // show verified mentors for other skills
        }
      }
    }

    res.json({ mentors: ordered });
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
         AND (us.Verification_Status = 1 OR us.Verification_Status = 'Verified' OR us.Verification_Status = 'Draft')`
    );
    res.json({ count: rows[0].count || 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ─────────────────────────────────────────────
// GET /api/mentors/platform-stats
// Get global statistics (Active Students, Skills, Success Rate)
// ─────────────────────────────────────────────
exports.getPlatformStats = async (req, res) => {
  try {
    const [[studentsRow]] = await db.query(
      `SELECT COUNT(*) AS count FROM User WHERE Status = 'Active' OR Status IS NULL`
    );
    const [[skillsRow]] = await db.query(
      `SELECT COUNT(*) AS count FROM Skill`
    );
    const [[completedRow]] = await db.query(
      `SELECT COUNT(*) AS count FROM Session WHERE Status = 'Completed'`
    );
    const [[scheduledRow]] = await db.query(
      `SELECT COUNT(*) AS count FROM Session WHERE Status = 'Scheduled'`
    );

    const completed = completedRow ? (completedRow.count || 0) : 0;
    const scheduled = scheduledRow ? (scheduledRow.count || 0) : 0;

    // Success rate calculate as completed sessions / scheduled sessions
    let successRate = 100;
    if (scheduled > 0) {
      successRate = Math.min(100, Math.round((completed / scheduled) * 100));
    } else if (completed > 0) {
      successRate = 100;
    }

    const activeStudents = studentsRow ? (studentsRow.count || 0) : 0;
    const skillsCount = skillsRow ? (skillsRow.count || 0) : 0;

    res.json({
      activeStudents,
      skills: skillsCount,
      successRate
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};