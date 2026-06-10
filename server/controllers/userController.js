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
