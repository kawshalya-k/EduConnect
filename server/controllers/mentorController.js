const db = require('../config/db');

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
      avatar: row.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${row.First_Name}&backgroundColor=E2E8F0`,
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
    const { skillId, passed } = req.body;
    // req.user could be from auth middleware. Handle both id and User_Id.
    // If testing without login, we need a fallback or they must log in. The prompt warned they must log in.
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

    if (userSkill && userSkill.Verification_Status) {
      return res.status(400).json({ message: 'Skill is already verified' });
    }

    // Cooldown check
    if (userSkill && userSkill.Last_Attempt) {
      const lastAttempt = new Date(userSkill.Last_Attempt);
      const now = new Date();
      const diffHours = (now - lastAttempt) / (1000 * 60 * 60);

      if (diffHours < 24) {
        const remainingTime = Math.ceil(24 - diffHours);
        return res.status(403).json({ 
          message: `Cooldown active. Please try again in ${remainingTime} hours.`,
          remainingHours: remainingTime
        });
      }
    }

    if (passed) {
      // Handle success
      if (userSkill) {
        await db.query(
          'UPDATE User_Skill SET Verification_Status = TRUE, Mentor_Level = ?, Role = ?, Last_Attempt = NULL WHERE User_Skill_Id = ?',
          ['Bronze', 'Mentor', userSkill.User_Skill_Id]
        );
      } else {
        await db.query(
          'INSERT INTO User_Skill (User_Id, Skill_Id, Role, Mentor_Level, Verification_Status) VALUES (?, ?, ?, ?, ?)',
          [userId, skillId, 'Mentor', 'Bronze', true]
        );
      }

      // Update User skill_coins
      await db.query(
        'UPDATE User SET skill_coins = skill_coins + 100 WHERE User_Id = ?',
        [userId]
      );

      // Give Bronze Mentor badge
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

      // Insert User_Badge ignoring duplicates
      await db.query(
        'INSERT IGNORE INTO User_Badge (User_Id, Badge_Id) VALUES (?, ?)',
        [userId, badgeId]
      );

      return res.status(200).json({ message: 'Skill verified successfully', skill_coins: 100 });
    } else {
      // Handle failure
      if (userSkill) {
        await db.query(
          'UPDATE User_Skill SET Last_Attempt = NOW() WHERE User_Skill_Id = ?',
          [userSkill.User_Skill_Id]
        );
      } else {
        await db.query(
          'INSERT INTO User_Skill (User_Id, Skill_Id, Role, Last_Attempt, Verification_Status) VALUES (?, ?, ?, NOW(), ?)',
          [userId, skillId, 'Student', false]
        );
      }

      return res.status(400).json({ message: 'Skill verification failed. 24-hour cooldown started.' });
    }
  } catch (error) {
    console.error('verifySkill error:', error);
    res.status(500).json({ message: 'Server error verifying skill' });
  }
};
