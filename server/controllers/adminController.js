const db = require('../config/db');
const User = require('../models/User');
const Session = require('../models/Session');

// ── DASHBOARD STATS ──────────────────────────────────────
exports.getDashboardStats = async (req, res) => {
  try {
    const [totalUsers] = await db.query(`SELECT COUNT(*) AS total FROM User`);
    const [activeSessions] = await db.query(`SELECT COUNT(*) AS total FROM Session WHERE DATE(Created_At) = CURDATE()`);
    const [pendingVerifications] = await db.query(`SELECT COUNT(*) AS total FROM User WHERE is_verified = 0`);
    const [totalCoins] = await db.query(`SELECT SUM(Wallet_Balance) AS total FROM User`);

    res.status(200).json({
      totalUsers: totalUsers[0].total,
      sessionsToday: activeSessions[0].total,
      pendingVerifications: pendingVerifications[0].total,
      skillCoinsCirculation: totalCoins[0].total || 0
    });
  } catch (err) {
    console.error('getDashboardStats error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ── USER MANAGEMENT ───────────────────────────────────────
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.getAllUsers();
    res.status(200).json(users);
  } catch (err) {
    console.error('getAllUsers error:', err);
    res.status(500).json({ message: 'Error fetching users' });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.getUserById(req.params.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (err) {
    console.error('getUserById error:', err);
    res.status(500).json({ message: 'Error fetching user' });
  }
};

exports.updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['Active', 'Inactive', 'Suspended'];
    if (!allowed.includes(status))
      return res.status(400).json({ message: 'Invalid status value' });

    await User.updateUserStatus(req.params.userId, status);
    res.status(200).json({ message: `User ${status} successfully!` });
  } catch (err) {
    console.error('updateUserStatus error:', err);
    res.status(500).json({ message: 'Error updating user status' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.deleteUser(req.params.userId);
    res.status(200).json({ message: 'User deleted successfully!' });
  } catch (err) {
    console.error('deleteUser error:', err);
    res.status(500).json({ message: 'Error deleting user' });
  }
};

// ── SESSION MANAGEMENT ────────────────────────────────────
exports.getAllSessions = async (req, res) => {
  try {
    const sessions = await Session.getAllSessions();
    res.status(200).json(sessions);
  } catch (err) {
    console.error('getAllSessions error:', err);
    res.status(500).json({ message: 'Error fetching sessions' });
  }
};

exports.updateSessionStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['Pending', 'Scheduled', 'In-Session', 'Completed', 'Cancelled'];
    if (!allowed.includes(status))
      return res.status(400).json({ message: 'Invalid status value' });

    await Session.updateSessionStatus(req.params.sessionId, status);
    res.status(200).json({ message: `Session ${status} successfully!` });
  } catch (err) {
    console.error('updateSessionStatus error:', err);
    res.status(500).json({ message: 'Error updating session' });
  }
};

// ── ANALYTICS ─────────────────────────────────────────────
exports.getAnalytics = async (req, res) => {
  try {
    const [totalUsers] = await db.query(`SELECT COUNT(*) AS total FROM User`);
    const [totalSessions] = await db.query(`SELECT COUNT(*) AS total FROM Session`);
    const [completedSessions] = await db.query(`SELECT COUNT(*) AS total FROM Session WHERE Status = 'Completed'`);
    const [totalCoins] = await db.query(`SELECT SUM(Wallet_Balance) AS total FROM User`);
    const [topMentors] = await db.query(`
      SELECT u.User_Id, u.First_Name, u.Last_Name, u.Email,
        COUNT(s.Session_Id) AS total_sessions,
        AVG(s.Rating) AS avg_rating,
        SUM(s.Reward) AS total_earnings
      FROM User u
      JOIN Session s ON u.User_Id = s.Mentor_Id
      WHERE s.Status = 'Completed'
      GROUP BY u.User_Id
      ORDER BY total_sessions DESC
      LIMIT 5
    `);

    res.status(200).json({
      totalUsers: totalUsers[0].total,
      totalSessions: totalSessions[0].total,
      completedSessions: completedSessions[0].total,
      skillCoinsCirculation: totalCoins[0].total || 0,
      topMentors
    });
  } catch (err) {
    console.error('getAnalytics error:', err);
    res.status(500).json({ message: 'Error fetching analytics' });
  }
};

// ── SKILL MANAGEMENT ──────────────────────────────────────
exports.getAllSkills = async (req, res) => {
  try {
    const [skills] = await db.query(`SELECT * FROM Skill ORDER BY Skill_Id DESC`);
    res.status(200).json(skills);
  } catch (err) {
    console.error('getAllSkills error:', err);
    res.status(500).json({ message: 'Error fetching skills' });
  }
};

exports.addSkill = async (req, res) => {
  try {
    const { skill_name, category, description } = req.body;
    const [result] = await db.query(
      `INSERT INTO Skill (Skill_Name, Category, Description) VALUES (?, ?, ?)`,
      [skill_name, category, description]
    );
    res.status(201).json({ message: 'Skill added!', skillId: result.insertId });
  } catch (err) {
    console.error('addSkill error:', err);
    res.status(500).json({ message: 'Error adding skill' });
  }
};

exports.deleteSkill = async (req, res) => {
  try {
    await db.query(`DELETE FROM Skill WHERE Skill_Id = ?`, [req.params.skillId]);
    res.status(200).json({ message: 'Skill deleted!' });
  } catch (err) {
    console.error('deleteSkill error:', err);
    res.status(500).json({ message: 'Error deleting skill' });
  }
};

exports.getAllUserSkills = async (req, res) => {
  try {
    const [userSkills] = await db.query(`
      SELECT us.User_Skill_Id, us.Role, us.Verification_Status, us.Mentor_Level, us.Last_Attempt, us.Certificates,
             u.User_Id, u.First_Name, u.Last_Name, u.Email, u.Avatar,
             s.Skill_Id, s.Skill_Name, s.Category,
             COALESCE(ld.Score, 0) AS Score,
             COALESCE(ld.Average_Rating, 0.0) AS Average_Rating,
             COALESCE(ld.Total_Sessions, 0) AS Total_Sessions
      FROM User_Skill us
      JOIN User u ON u.User_Id = us.User_Id
      JOIN Skill s ON s.Skill_Id = us.Skill_Id
      LEFT JOIN Levelling_Data ld ON ld.Mentor_Id = us.User_Id AND ld.Skill_Id = us.Skill_Id
      ORDER BY us.Last_Attempt DESC, us.User_Skill_Id DESC
    `);
    res.status(200).json(userSkills);
  } catch (err) {
    console.error('getAllUserSkills error:', err);
    res.status(500).json({ message: 'Error fetching user skills' });
  }
};