// server/controllers/gamificationController.js
const db = require('../config/db');

const getAllBadges = async (req, res) => {
  try {
    const [badges] = await db.query('SELECT * FROM Badge');
    res.json({ success: true, badges });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getUserBadges = async (req, res) => {
  try {
    const { id } = req.params;
    const [badges] = await db.query(`
      SELECT b.*, ub.Awarded_Date AS awarded_at FROM Badge b
      JOIN User_Badge ub ON b.Badge_Id = ub.Badge_Id
      WHERE ub.User_Id = ? ORDER BY ub.Awarded_Date DESC
    `, [id]);
    res.json({ success: true, badges });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const awardBadge = async (req, res) => {
  try {
    const { user_id, badge_id } = req.body;
    const [existing] = await db.query(
      'SELECT * FROM User_Badge WHERE User_Id = ? AND Badge_Id = ?', [user_id, badge_id]
    );
    if (existing.length > 0) {
      return res.json({ success: false, message: 'User already has this badge' });
    }
    await db.query('INSERT INTO User_Badge (User_Id, Badge_Id) VALUES (?, ?)', [user_id, badge_id]);
    const [badge] = await db.query('SELECT * FROM Badge WHERE Badge_Id = ?', [badge_id]);

    const [user] = await db.query('SELECT skill_coins FROM user WHERE User_Id = ?', [user_id]);
    const newBalance = (user[0]?.skill_coins || 0) + 25;
    await db.query('UPDATE user SET skill_coins = ? WHERE User_Id = ?', [newBalance, user_id]);
    await db.query(
      `INSERT INTO Wallet_Transaction (User_Id, Transaction_Type, Amount, Description) VALUES (?, 'CREDIT', 25, ?)`,
      [user_id, `Badge earned: ${badge[0].Badge_Name || badge[0].name}`]
    );

    res.json({ success: true, message: 'Badge awarded successfully!', badge: badge[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getLeaderboard = async (req, res) => {
  try {
    const [mentors] = await db.query(`
      SELECT u.User_Id, u.First_Name, u.Last_Name, u.University, u.skill_coins,
             ld.score, ld.level, ld.session_count, ld.average_rating
      FROM user u
      JOIN Levelling_Data ld ON u.User_Id = ld.user_id
      ORDER BY ld.score DESC LIMIT 50
    `);
    res.json({ success: true, mentors });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getAllBadges, getUserBadges, awardBadge, getLeaderboard };