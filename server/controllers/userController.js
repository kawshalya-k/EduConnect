const db = require('../config/db');

exports.getProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    // Check if the requesting user matches the requested id, or admin? We'll just let them fetch any profile for now.
    const [userRows] = await db.query(
      'SELECT User_Id, First_Name, Last_Name, Email, University, Role, Bio, Avatar, is_verified, skill_coins FROM User WHERE User_Id = ?',
      [userId]
    );

    if (userRows.length === 0) return res.status(404).json({ message: 'User not found' });
    const user = userRows[0];

    // Fetch skills
    const [skillRows] = await db.query(
      `SELECT s.Skill_Id, s.Skill_Name, s.Category, us.Role as Skill_Role, us.Mentor_Level
       FROM User_Skill us 
       JOIN Skill s ON us.Skill_Id = s.Skill_Id 
       WHERE us.User_Id = ?`,
      [userId]
    );

    res.status(200).json({ ...user, skills: skillRows });
  } catch (error) {
    console.error('getProfile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    if (parseInt(req.user.id) !== parseInt(userId)) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const { bio, avatar, first_name, last_name, skillsToTeach = [], skillsToLearn = [] } = req.body;

    // Update basic info
    await db.query(
      'UPDATE User SET Bio = ?, Avatar = ?, First_Name = ?, Last_Name = ? WHERE User_Id = ?',
      [bio, avatar, first_name, last_name, userId]
    );

    // Update skills (Simplest way: delete all existing and re-insert)
    // Note: In a production app, we might want to preserve mentor levels/certificates, but for MVP this is fine.
    await db.query('DELETE FROM User_Skill WHERE User_Id = ?', [userId]);

    // Re-insert skills
    for (const skill of skillsToTeach) {
      if (skill.Skill_Id) {
        await db.query(
          'INSERT INTO User_Skill (User_Id, Skill_Id, Role) VALUES (?, ?, ?)',
          [userId, skill.Skill_Id, 'Mentor']
        );
      }
    }
    
    for (const skill of skillsToLearn) {
      if (skill.Skill_Id) {
        await db.query(
          'INSERT INTO User_Skill (User_Id, Skill_Id, Role) VALUES (?, ?, ?)',
          [userId, skill.Skill_Id, 'Learner']
        );
      }
    }

    // Fetch all verified mentor skills for this user and re-sync their embeddings
    const [userSkills] = await db.query(
      `SELECT Skill_Id FROM User_Skill WHERE User_Id = ? AND Role = 'Mentor' AND (Verification_Status = 1 OR Verification_Status = 'Verified')`,
      [userId]
    );
    const { syncMentorEmbedding } = require('../utils/embedMentor');
    for (const row of userSkills) {
      syncMentorEmbedding(userId, row.Skill_Id).catch(err => {
        console.error(`[Pinecone Sync Error] Failed to re-sync profile skill ${row.Skill_Id}:`, err.message);
      });
    }

    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('updateProfile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.switchRole = async (req, res) => {
  try {
    const userId = req.params.id;
    if (parseInt(req.user.id) !== parseInt(userId)) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const { role } = req.body; // 'Student' or 'Mentor'
    const allowedRoles = ['Student', 'Mentor'];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    await db.query('UPDATE User SET Role = ? WHERE User_Id = ?', [role, userId]);

    res.status(200).json({ message: `Role switched to ${role}` });
  } catch (error) {
    console.error('switchRole error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getPublicStats = async (req, res) => {
  try {
    const [countRows] = await db.query('SELECT COUNT(*) AS total FROM User');
    const totalUsers = countRows[0]?.total || 0;

    const [userRows] = await db.query(
      'SELECT First_Name, Last_Name, Avatar FROM User WHERE Status = "Active" ORDER BY User_Id DESC LIMIT 3'
    );

    res.status(200).json({
      totalUsers,
      recentUsers: userRows
    });
  } catch (error) {
    console.error('getPublicStats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getLearningSkills = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("[DEBUG] getLearningSkills for user ID:", userId);
    const [rows] = await db.query(
      `SELECT s.Skill_Id, s.Skill_Name, s.Category, s.Description
       FROM User_Skill us
       JOIN Skill s ON us.Skill_Id = s.Skill_Id
       WHERE us.User_Id = ? AND us.Role = 'Learner'
       ORDER BY s.Skill_Name`,
      [userId]
    );
    console.log("[DEBUG] getLearningSkills retrieved rows:", rows);
    res.status(200).json(rows);
  } catch (error) {
    console.error('getLearningSkills error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.addLearningSkill = async (req, res) => {
  try {
    const userId = req.user.id;
    const { skillId, skillName } = req.body;
    console.log("[DEBUG] addLearningSkill for user ID:", userId, "skillId:", skillId, "skillName:", skillName);

    let targetSkillId = skillId;
    let targetSkillName = skillName;

    if (!targetSkillId && !targetSkillName) {
      return res.status(400).json({ message: 'Skill ID or name is required' });
    }

    if (targetSkillId) {
      const [rows] = await db.query('SELECT Skill_Name FROM Skill WHERE Skill_Id = ?', [targetSkillId]);
      if (rows.length === 0) {
        return res.status(404).json({ message: 'Skill not found' });
      }
      targetSkillName = rows[0].Skill_Name;
    } else {
      const trimmedName = targetSkillName.trim();
      let [rows] = await db.query('SELECT Skill_Id FROM Skill WHERE Skill_Name = ?', [trimmedName]);
      if (rows.length > 0) {
        targetSkillId = rows[0].Skill_Id;
      } else {
        const [result] = await db.query(
          "INSERT INTO Skill (Skill_Name, Category, Description) VALUES (?, 'Technical', ?)",
          [trimmedName, `Assessment of expertise in ${trimmedName}.`]
        );
        targetSkillId = result.insertId;
      }
      targetSkillName = trimmedName;
    }

    // 2. Insert into User_Skill
    await db.query(
      "INSERT IGNORE INTO User_Skill (User_Id, Skill_Id, Role, Verification_Status) VALUES (?, ?, 'Learner', 'Verified')",
      [userId, targetSkillId]
    );

    console.log("[DEBUG] addLearningSkill success, skillId:", targetSkillId);
    res.status(200).json({ 
      message: 'Learning skill added successfully', 
      Skill_Id: targetSkillId, 
      Skill_Name: targetSkillName 
    });
  } catch (error) {
    console.error('addLearningSkill error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.removeLearningSkill = async (req, res) => {
  try {
    const userId = req.user.id;
    const { skillId } = req.params;
    console.log("[DEBUG] removeLearningSkill for user ID:", userId, "skillId:", skillId);

    await db.query(
      "DELETE FROM User_Skill WHERE User_Id = ? AND Skill_Id = ? AND Role = 'Learner'",
      [userId, skillId]
    );

    console.log("[DEBUG] removeLearningSkill success");
    res.status(200).json({ message: 'Learning skill removed successfully' });
  } catch (error) {
    console.error('removeLearningSkill error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.debugSkills = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT us.*, s.Skill_Name 
       FROM User_Skill us 
       LEFT JOIN Skill s ON us.Skill_Id = s.Skill_Id`
    );
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
