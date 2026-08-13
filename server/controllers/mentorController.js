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
      `SELECT User_Id, First_Name, Last_Name, University, Bio, Created_At, Avatar, Role
             FROM User WHERE User_Id = ? AND Status = 'Active'`,
      [mentorId]
    );
    if (userRows.length === 0) return res.status(404).json({ message: "Mentor not found." });

    const [skills] = await db.query(
      `SELECT s.Skill_Id, s.Skill_Name, s.Category, s.Description,
                     us.Mentor_Level, us.Certificates
             FROM User_Skill us
             JOIN Skill s ON s.Skill_Id = us.Skill_Id
             LEFT JOIN Levelling_Data ld 
                    ON ld.Mentor_Id = us.User_Id AND ld.Skill_Id = us.Skill_Id
             WHERE us.User_Id = ? AND us.Role = 'Mentor' AND (us.Verification_Status = 1 OR us.Verification_Status = 'Verified')`,
      [mentorId]
    );

    const [reviews] = await db.query(
      `SELECT se.Session_Id as id, se.Rating, se.Feedback,
                     u.First_Name, u.Last_Name, u.Avatar as learnerAvatar,
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

    // Fetch sessions stats
    const [statsRows] = await db.query(
      `SELECT 
         COALESCE(AVG(Rating), 0) as avgRating,
         COUNT(Session_Id) as sessionsTaught
       FROM Session
       WHERE Mentor_Id = ? AND Status = 'Completed'`,
      [mentorId]
    );
    const avgRating = Number(statsRows[0].avgRating || 0);
    const sessionsTaught = Number(statsRows[0].sessionsTaught || 0);

    // Fetch levelling data
    const [levellingRows] = await db.query(
      `SELECT 
         COALESCE(SUM(Score), 0) as totalScore,
         MAX(Mentor_Level) as maxLevel
       FROM Levelling_Data 
       WHERE Mentor_Id = ?`,
      [mentorId]
    );
    const totalXP = Number(levellingRows[0].totalScore || 0);
    const dbLevel = (levellingRows[0].maxLevel || 'BRONZE').toUpperCase();

    let calculatedLevel = dbLevel === 'GOLD' || dbLevel === 'SILVER' || dbLevel === 'BRONZE' ? dbLevel : 'BRONZE';
    let currentXP = totalXP;
    let nextLevelXP = 200;
    let levelProgress = 70;

    if (calculatedLevel === 'GOLD') {
      currentXP = totalXP;
      nextLevelXP = 1000;
      levelProgress = Math.min(100, Math.round((totalXP / 1000) * 100)) || 100;
    } else if (calculatedLevel === 'SILVER') {
      currentXP = totalXP >= 200 ? totalXP - 200 : totalXP;
      nextLevelXP = 500;
      levelProgress = Math.min(100, Math.round((currentXP / 300) * 100)) || 50;
    } else {
      currentXP = totalXP;
      nextLevelXP = 200;
      levelProgress = Math.min(100, Math.round((totalXP / 200) * 100)) || 20;
    }

    const memberSinceDate = userRows[0].Created_At
      ? new Date(userRows[0].Created_At).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      : 'Oct 2023';

    const mentorData = {
      id: userRows[0].User_Id,
      userId: userRows[0].User_Id,
      name: `${userRows[0].First_Name} ${userRows[0].Last_Name}`,
      firstName: userRows[0].First_Name,
      lastName: userRows[0].Last_Name,
      university: userRows[0].University || 'University',
      bio: userRows[0].Bio || '',
      title: userRows[0].Bio || 'Expert Mentor',
      avatar: userRows[0].Avatar,
      level: calculatedLevel,
      levelProgress: levelProgress,
      currentXP: currentXP,
      nextLevelXP: nextLevelXP,
      sessionsTaught: sessionsTaught,
      rating: avgRating > 0 ? avgRating : 0,
      memberSince: memberSinceDate,
      verified: true,
      skills: skills.map(s => ({
        id: s.Skill_Id,
        name: s.Skill_Name,
        category: s.Category,
        description: s.Description || `Expertise in ${s.Skill_Name}`,
        level: s.Mentor_Level,
        technologies: [] // Fallback if no specific tech column
      })),
      reviews: reviews.map(r => ({
        id: r.id,
        learnerName: `${r.First_Name} ${r.Last_Name}`,
        learnerAvatar: r.learnerAvatar,
        sessionTopic: r.Skill_Name,
        rating: r.Rating,
        comment: r.Feedback
      })),
      badges
    };

    res.json({ mentor: mentorData });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMentors = async (req, res) => {
  try {
    const { search, skill } = req.query;

    let sql = `
      SELECT DISTINCT u.User_Id as id, u.First_Name, u.Last_Name, u.Email, u.Avatar as avatar, u.Bio as role, u.University,
      (SELECT JSON_ARRAYAGG(s.Skill_Name) FROM User_Skill us2 JOIN Skill s ON us2.Skill_Id = s.Skill_Id WHERE us2.User_Id = u.User_Id AND us2.Role = 'Mentor') as skills,
      IFNULL((SELECT AVG(Average_Rating) FROM Levelling_Data ld WHERE ld.Mentor_Id = u.User_Id), 5.0) as rating,
      IFNULL((SELECT SUM(Total_Sessions) FROM Levelling_Data ld WHERE ld.Mentor_Id = u.User_Id), 0) as reviews,
      '100 Skill Coins' as price,
      'GOLD MENTOR' as level
      FROM User u
      LEFT JOIN User_Skill us ON u.User_Id = us.User_Id
      LEFT JOIN Skill s ON us.Skill_Id = s.Skill_Id
      WHERE u.Role = 'Mentor' AND u.is_verified = 1
    `;

    const params = [];

    if (search) {
      sql += ` AND (u.First_Name LIKE ? OR u.Last_Name LIKE ? OR s.Skill_Name LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (skill) {
      sql += ` AND s.Skill_Name = ?`;
      params.push(skill);
    }

    const [rows] = await db.query(sql, params);

    // Format the response to match what the frontend expects
    const formattedMentors = rows.map(row => ({
      id: row.id,
      name: `${row.First_Name} ${row.Last_Name}`,
      avatar: row.avatar || '/default-avatar.svg',
      level: row.level,
      role: row.role || 'Mentor',
      rating: Number(row.rating).toFixed(1),
      reviews: row.reviews,
      price: row.price,
      skills: row.skills ? (typeof row.skills === 'string' ? JSON.parse(row.skills) : row.skills) : []
    }));

    res.status(200).json(formattedMentors);
  } catch (error) {
    console.error('getMentors error:', error);
    res.status(500).json({ message: 'Server error fetching mentors' });
  }
};

exports.verifySkill = async (req, res) => {
  try {
    const { skillId, passed, score, level } = req.body;
    const isPassed = String(passed) === 'true' || passed === true;
    const userId = req.user?.User_Id || req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized. Please log in to take the quiz.' });
    }

    if (!skillId) {
      return res.status(400).json({ message: 'Skill ID is required' });
    }

    // Check existing User_Skill record
    const [existing] = await db.query(
      'SELECT * FROM User_Skill WHERE User_Id = ? AND Skill_Id = ?',
      [userId, skillId]
    );

    let userSkill = existing.length > 0 ? existing[0] : null;

    // Cooldown check (4 hours) - only if they are not actively testing
    if (userSkill && userSkill.Verification_Status !== 'Testing' && userSkill.Last_Attempt) {
      const lastAttempt = new Date(userSkill.Last_Attempt);
      const now = new Date();
      const diffMs = now - lastAttempt;
      const cooldownMs = 4 * 60 * 60 * 1000; // 4 hours

      if (diffMs < cooldownMs) {
        const remainingMs = cooldownMs - diffMs;
        const remainingHours = Math.floor(remainingMs / (1000 * 60 * 60));
        const remainingMinutes = Math.ceil((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
        return res.status(403).json({
          message: `Cooldown active. Please try again in ${remainingHours}h ${remainingMinutes}m.`,
          remainingHours,
          remainingMinutes,
          cooldownActive: true
        });
      }
    }

    if (isPassed) {
      // Determine Skill Coin reward based on level
      let coinsAwarded = 0;
      if (level === 'Beginner') coinsAwarded = 5;
      else if (level === 'Intermediate') coinsAwarded = 10;
      else if (level === 'Expert') coinsAwarded = 15;

      // Auto-verify in User_Skill
      if (userSkill) {
        await db.query(
          "UPDATE User_Skill SET Verification_Status = 'Verified', Role = 'Mentor', Mentor_Level = ?, Last_Attempt = NOW(), Certificates = NULL WHERE User_Skill_Id = ?",
          [level, userSkill.User_Skill_Id]
        );
      } else {
        await db.query(
          "INSERT INTO User_Skill (User_Id, Skill_Id, Role, Verification_Status, Mentor_Level, Last_Attempt) VALUES (?, ?, 'Mentor', 'Verified', ?, NOW())",
          [userId, skillId, level]
        );
      }

      // Upsert Levelling_Data
      const [existingLvl] = await db.query(
        'SELECT * FROM Levelling_Data WHERE Mentor_Id = ? AND Skill_Id = ?',
        [userId, skillId]
      );
      if (existingLvl.length > 0) {
        await db.query(
          "UPDATE Levelling_Data SET Mentor_Level = ?, Last_Evaluation_Date = NOW() WHERE Mentor_Id = ? AND Skill_Id = ?",
          [level, userId, skillId]
        );
      } else {
        await db.query(
          "INSERT INTO Levelling_Data (Mentor_Id, Skill_Id, Average_Rating, Total_Sessions, Mentor_Level, Score) VALUES (?, ?, 0.00, 0, ?, ?)",
          [userId, skillId, level, score || 0]
        );
      }

      // Award Skill Coins
      if (coinsAwarded > 0) {
        const [userRows] = await db.query(
          'SELECT skill_coins, Wallet_Balance FROM User WHERE User_Id = ?',
          [userId]
        );
        if (userRows.length > 0) {
          const currentCoins = userRows[0].skill_coins !== null ? userRows[0].skill_coins : userRows[0].Wallet_Balance;
          const newBalance = currentCoins + coinsAwarded;
          await db.query(
            'UPDATE User SET skill_coins = ?, Wallet_Balance = ? WHERE User_Id = ?',
            [newBalance, newBalance, userId]
          );

          // Fetch skill name to use in transaction description
          const [skillRows] = await db.query(
            'SELECT Skill_Name FROM Skill WHERE Skill_Id = ?',
            [skillId]
          );
          const skillName = skillRows.length > 0 ? skillRows[0].Skill_Name : 'Skill';

          // Record transaction
          await db.query(
            `INSERT INTO Wallet_Transaction (User_Id, Transaction_Type, Amount, Description) VALUES (?, 'CREDIT', ?, ?)`,
            [userId, coinsAwarded, `Skill verified: ${skillName} (${level} level)`]
          );
        }
      }

      // Give Bronze Mentor badge if not already awarded
      let [badges] = await db.query('SELECT Badge_Id FROM Badge WHERE Badge_Name = ?', ['Bronze Mentor']);
      let badgeId;
      if (badges.length === 0) {
        const [result] = await db.query(
          'INSERT INTO Badge (Badge_Name, Criteria, Description) VALUES (?, ?, ?)',
          ['Bronze Mentor', 'Verify first skill', 'Awarded for successfully verifying a skill']
        );
        badgeId = result.insertId;
      } else {
        badgeId = badges[0].Badge_Id;
      }
      await db.query(
        'INSERT IGNORE INTO User_Badge (user_id, badge_id) VALUES (?, ?)',
        [userId, badgeId]
      );

      // Create notification
      const [skillRows] = await db.query('SELECT Skill_Name FROM Skill WHERE Skill_Id = ?', [skillId]);
      const skillName = skillRows.length > 0 ? skillRows[0].Skill_Name : 'Skill';
      try {
        const Notification = require('../models/Notification');
        await Notification.createNotification(
          userId,
          'Skill Verified! 🎉',
          `Congratulations! You passed the assessment for "${skillName}" at ${level} level. +${coinsAwarded} SC credited.`,
          'gamification'
        );
      } catch (notifErr) {
        console.error('Failed to create notification:', notifErr.message);
      }

      // Sync embedding to Pinecone
      try {
        const { syncMentorEmbedding } = require('../utils/embedMentor');
        await syncMentorEmbedding(userId, skillId);
      } catch (err) {
        console.error('[Pinecone Sync Error] Failed to sync verified skill to Pinecone:', err.message);
      }

      return res.status(200).json({ message: 'Skill verified successfully.', level, score, coinsAwarded });
    } else {
      // Handle failure: set to Rejected and start 4-hour cooldown
      if (userSkill) {
        await db.query(
          "UPDATE User_Skill SET Last_Attempt = NOW(), Verification_Status = 'Rejected', Certificates = NULL, Mentor_Level = NULL WHERE User_Skill_Id = ?",
          [userSkill.User_Skill_Id]
        );
      } else {
        await db.query(
          "INSERT INTO User_Skill (User_Id, Skill_Id, Role, Last_Attempt, Verification_Status, Mentor_Level) VALUES (?, ?, 'Student', NOW(), 'Rejected', NULL)",
          [userId, skillId]
        );
      }

      return res.status(400).json({ message: 'Skill verification failed. 4-hour cooldown started.', score });
    }
  } catch (error) {
    console.error('verifySkill error:', error);
    res.status(500).json({ message: 'Server error verifying skill' });
  }
};

exports.startQuiz = async (req, res) => {
  try {
    const { skillId } = req.body;
    const userId = req.user?.User_Id || req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized. Please log in to start the quiz.' });
    }

    if (!skillId) {
      return res.status(400).json({ message: 'Skill ID is required' });
    }

    // Check existing User_Skill record
    const [existing] = await db.query(
      'SELECT * FROM User_Skill WHERE User_Id = ? AND Skill_Id = ?',
      [userId, skillId]
    );

    let userSkill = existing.length > 0 ? existing[0] : null;

    if (userSkill) {
      // If they already passed and are verified, check 4-hour cooldown for upgrades
      if (userSkill.Verification_Status === 'Verified') {
        if (userSkill.Last_Attempt) {
          const lastAttempt = new Date(userSkill.Last_Attempt);
          const now = new Date();
          const diffMs = now - lastAttempt;
          const cooldownMs = 4 * 60 * 60 * 1000; // 4 hours
          if (diffMs < cooldownMs) {
            const remainingMs = cooldownMs - diffMs;
            const remainingHours = Math.floor(remainingMs / (1000 * 60 * 60));
            const remainingMinutes = Math.ceil((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
            return res.status(403).json({
              message: `Cooldown active. Please try again in ${remainingHours}h ${remainingMinutes}m.`,
              remainingHours,
              remainingMinutes,
              cooldownActive: true,
              cooldownTimeLeft: remainingMs
            });
          }
        }
        // Cooldown inactive, allowed to start quiz again (upgrade)
        await db.query(
          "UPDATE User_Skill SET Role = 'Mentor', Verification_Status = 'Testing', Last_Attempt = NOW(), Certificates = NULL, Mentor_Level = NULL WHERE User_Skill_Id = ?",
          [userSkill.User_Skill_Id]
        );
        return res.status(200).json({ message: 'Quiz started for upgrade.', quizTimeLeft: 600 });
      }

      // If they are in 'Testing' state (midquiz)
      if (userSkill.Verification_Status === 'Testing') {
        const lastAttempt = new Date(userSkill.Last_Attempt);
        const now = new Date();
        const diffSecs = Math.floor((now - lastAttempt) / 1000);
        const quizDuration = 600; // 10 minutes in seconds

        if (diffSecs < quizDuration) {
          // Quiz is still active, return the remaining seconds
          const timeLeft = quizDuration - diffSecs;
          return res.status(200).json({ message: 'Quiz in progress resumed.', quizTimeLeft: timeLeft });
        } else {
          // Time passed, auto-fail it and enter cooldown state
          await db.query(
            "UPDATE User_Skill SET Verification_Status = 'Rejected', Certificates = NULL, Mentor_Level = NULL WHERE User_Skill_Id = ?",
            [userSkill.User_Skill_Id]
          );

          const cooldownMs = 4 * 60 * 60 * 1000;
          const cooldownRemaining = cooldownMs - (now - lastAttempt);

          return res.status(400).json({
            message: 'Skill verification failed due to timeout. 4-hour cooldown active.',
            timeoutExpired: true,
            cooldownTimeLeft: cooldownRemaining > 0 ? cooldownRemaining : 0
          });
        }
      }

      // If they failed earlier, check the cooldown
      if (userSkill.Verification_Status === 'Rejected') {
        if (userSkill.Last_Attempt) {
          const lastAttempt = new Date(userSkill.Last_Attempt);
          const now = new Date();
          const diffMs = now - lastAttempt;
          const cooldownMs = 4 * 60 * 60 * 1000; // 4 hours
          if (diffMs < cooldownMs) {
            const remainingMs = cooldownMs - diffMs;
            const remainingHours = Math.floor(remainingMs / (1000 * 60 * 60));
            const remainingMinutes = Math.ceil((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
            return res.status(403).json({
              message: `Cooldown active. Please try again in ${remainingHours}h ${remainingMinutes}m.`,
              remainingHours,
              remainingMinutes,
              cooldownActive: true,
              cooldownTimeLeft: remainingMs
            });
          }
        }
        // Cooldown passed, update status to 'Testing'
        await db.query(
          "UPDATE User_Skill SET Role = 'Mentor', Verification_Status = 'Testing', Last_Attempt = NOW(), Certificates = NULL, Mentor_Level = NULL WHERE User_Skill_Id = ?",
          [userSkill.User_Skill_Id]
        );
        return res.status(200).json({ message: 'Quiz started.', quizTimeLeft: 600 });
      }

      // Default (e.g. Draft)
      await db.query(
        "UPDATE User_Skill SET Role = 'Mentor', Verification_Status = 'Testing', Last_Attempt = NOW(), Certificates = NULL, Mentor_Level = NULL WHERE User_Skill_Id = ?",
        [userSkill.User_Skill_Id]
      );
      return res.status(200).json({ message: 'Quiz started.', quizTimeLeft: 600 });

    } else {
      // User_Skill does not exist, insert as 'Testing' and start 10 min quiz
      await db.query(
        "INSERT INTO User_Skill (User_Id, Skill_Id, Role, Verification_Status, Last_Attempt) VALUES (?, ?, 'Mentor', 'Testing', NOW())",
        [userId, skillId]
      );
      return res.status(200).json({ message: 'Quiz started.', quizTimeLeft: 600 });
    }

  } catch (error) {
    console.error('startQuiz error:', error);
    res.status(500).json({ message: 'Server error starting quiz' });
  }
};

exports.saveOnboardingDraft = async (req, res) => {
  const userId = req.user?.User_Id || req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized. Please log in.' });
  }

  const { learningSkills = [], teachingSkills = [] } = req.body;

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // 1. Delete existing Draft/Testing teaching skills and Learner skills
    await connection.query(
      "DELETE FROM User_Skill WHERE User_Id = ? AND (Role = 'Learner' OR Verification_Status = 'Draft' OR Verification_Status = 'Testing')",
      [userId]
    );

    // 2. Insert learning skills (Role = 'Learner')
    for (const skillName of learningSkills) {
      if (!skillName) continue;
      let [rows] = await connection.query('SELECT Skill_Id FROM Skill WHERE Skill_Name = ?', [skillName]);
      let skillId;
      if (rows.length > 0) {
        skillId = rows[0].Skill_Id;
      } else {
        const [result] = await connection.query(
          "INSERT INTO Skill (Skill_Name, Category, Description) VALUES (?, 'Technical', ?)",
          [skillName, `Assessment of expertise in ${skillName}.`]
        );
        skillId = result.insertId;
      }
      await connection.query(
        "INSERT IGNORE INTO User_Skill (User_Id, Skill_Id, Role, Verification_Status) VALUES (?, ?, 'Learner', 'Verified')",
        [userId, skillId]
      );
    }

    // 3. Insert teaching skills (Role = 'Mentor', Verification_Status = 'Draft')
    const savedSkills = [];
    for (const skill of teachingSkills) {
      const skillName = typeof skill === 'string' ? skill : skill.name;
      const confidence = (typeof skill === 'object' && skill.confidence) ? skill.confidence : 5;
      if (!skillName) continue;

      let [rows] = await connection.query(
        'SELECT Skill_Id, Skill_Name, Description FROM Skill WHERE Skill_Name = ?',
        [skillName]
      );
      let skillId, description;
      if (rows.length > 0) {
        skillId = rows[0].Skill_Id;
        description = rows[0].Description;
      } else {
        const [result] = await connection.query(
          "INSERT INTO Skill (Skill_Name, Category, Description) VALUES (?, 'Technical', ?)",
          [skillName, `Assessment of expertise in ${skillName}.`]
        );
        skillId = result.insertId;
        description = `Assessment of expertise in ${skillName}.`;
      }

      // INSERT IGNORE (safe — no unique key dependency) then UPDATE confidence separately
      await connection.query(
        "INSERT IGNORE INTO User_Skill (User_Id, Skill_Id, Role, Verification_Status, Confidence) VALUES (?, ?, 'Mentor', 'Draft', ?)",
        [userId, skillId, confidence]
      );

      // Always update confidence in case the row already existed
      await connection.query(
        "UPDATE User_Skill SET Confidence = ?, Verification_Status = 'Draft' WHERE User_Id = ? AND Skill_Id = ? AND Role = 'Mentor'",
        [confidence, userId, skillId]
      );

      savedSkills.push({ skillId, skillName, confidence, description });
    }

    await connection.commit();

    res.status(200).json({
      message: 'Draft saved successfully.',
      savedSkills,
    });
  } catch (error) {
    await connection.rollback();
    console.error('saveOnboardingDraft error:', error);
    res.status(500).json({ message: 'Server error saving onboarding draft.' });
  } finally {
    connection.release();
  }
};