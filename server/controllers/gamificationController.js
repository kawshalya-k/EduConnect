// server/controllers/gamificationController.js

const db = require('../config/db');

// ─────────────────────────────────────────
// TASK 7: GET all available badges
// GET /api/gamification/badges
// ─────────────────────────────────────────
const getAllBadges = async (req, res) => {
  try {
    const [badges] = await db.query('SELECT * FROM Badge');
    res.json({ success: true, badges });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─────────────────────────────────────────
// TASK 8: GET badges earned by a user
// GET /api/gamification/users/:id/badges
// ─────────────────────────────────────────
const getUserBadges = async (req, res) => {
  try {
    const { id } = req.params;

    const [badges] = await db.query(`
      SELECT b.*, ub.awarded_at
      FROM Badge b
      JOIN User_Badge ub ON b.badge_id = ub.badge_id
      WHERE ub.user_id = ?
      ORDER BY ub.awarded_at DESC
    `, [id]);

    res.json({ success: true, badges });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─────────────────────────────────────────
// TASK 5: POST award a badge to a user
// POST /api/gamification/badges/award
// ─────────────────────────────────────────
const awardBadge = async (req, res) => {
  try {
    const { user_id, badge_id } = req.body;

    // Check if user already has this badge
    const [existing] = await db.query(
      'SELECT * FROM User_Badge WHERE user_id = ? AND badge_id = ?',
      [user_id, badge_id]
    );

    if (existing.length > 0) {
      return res.json({
        success: false,
        message: 'User already has this badge'
      });
    }

    // Award the badge
    await db.query(
      'INSERT INTO User_Badge (user_id, badge_id) VALUES (?, ?)',
      [user_id, badge_id]
    );

    // Get badge details
    const [badge] = await db.query(
      'SELECT * FROM Badge WHERE badge_id = ?',
      [badge_id]
    );

    // Give coins reward for earning badge
    await creditCoins(
      user_id,
      25,
      `Badge earned: ${badge[0].name}`
    );

    res.json({
      success: true,
      message: 'Badge awarded successfully!',
      badge: badge[0]
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─────────────────────────────────────────
// TASK 6: GET leaderboard
// GET /api/gamification/leaderboard
// ─────────────────────────────────────────
// Levelling_Data has two schemas in the wild: the snake_case one used by
// gamification/seed scripts (user_id, session_count, level, ...) and the
// CamelCase one auto-created by db.js (Mentor_Id, Total_Sessions, Mentor_Level, ...).
// Detect the actual columns once so the leaderboard works against either.
let levellingColumns = null;
const getLevellingColumns = async () => {
  if (levellingColumns) return levellingColumns;
  const [rows] = await db.query(
    `SELECT COLUMN_NAME FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'Levelling_Data'`
  );
  const cols = new Set(rows.map((r) => r.COLUMN_NAME));
  levellingColumns = {
    userId: cols.has('user_id') ? 'user_id' : 'Mentor_Id',
    score: cols.has('score') ? 'score' : 'Score',
    sessionCount: cols.has('session_count') ? 'session_count' : 'Total_Sessions',
    averageRating: cols.has('average_rating') ? 'average_rating' : 'Average_Rating',
    level: cols.has('level') ? 'level' : 'Mentor_Level',
  };
  return levellingColumns;
};

const getLeaderboard = async (req, res) => {
  try {
    const { period = 'weekly', skill = 'all' } = req.query;
    const lc = await getLevellingColumns();
    const query = `
      SELECT
        u.User_Id AS user_id,
        u.First_Name AS first_name,
        u.Last_Name AS last_name,
        u.University AS university,
        u.Avatar AS avatar,
        u.skill_coins AS skill_coins,
        COALESCE(SUM(ld.\`${lc.score}\`), 0) AS score,
        COALESCE(SUM(ld.\`${lc.sessionCount}\`), 0) AS session_count,
        COALESCE(AVG(ld.\`${lc.averageRating}\`), 0) AS average_rating,
        COALESCE(MAX(ld.\`${lc.level}\`), 'BRONZE') AS mentor_level
      FROM User u
      LEFT JOIN Levelling_Data ld ON u.User_Id = ld.\`${lc.userId}\`
      GROUP BY u.User_Id
      ORDER BY u.skill_coins DESC, score DESC
      LIMIT 50
    `;

    const [mentors] = await db.query(query);

    const [totalRow] = await db.query(
      'SELECT COUNT(*) AS total FROM Session WHERE Status = "Completed"'
    );
    const totalSessions = totalRow[0]?.total || 0;

    res.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    res.json({ success: true, mentors, totalSessions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─────────────────────────────────────────
// TASK 9: Check and award badges automatically
// Called internally after key events
// ─────────────────────────────────────────
const checkAndAwardBadges = async (user_id) => {
  try {
    const [sessions] = await db.query(
      'SELECT COUNT(*) as count FROM Session WHERE Mentor_Id = ? AND Status = "Completed"',
      [user_id]
    );

    const sessionCount = sessions[0].count;

    const [unearned] = await db.query(`
      SELECT b.* FROM Badge b
      WHERE b.badge_id NOT IN (
        SELECT badge_id FROM User_Badge WHERE user_id = ?
      )
      AND b.trigger_type = 'session_count'
    `, [user_id]);

    for (const badge of unearned) {
      if (sessionCount >= badge.threshold) {
        await db.query(
          'INSERT INTO User_Badge (user_id, badge_id) VALUES (?, ?)',
          [user_id, badge.badge_id]
        );
        console.log(`Badge awarded: ${badge.name} to user ${user_id}`);
      }
    }
  } catch (err) {
    console.error('Badge check error:', err.message);
  }
};

// ─────────────────────────────────────────
// Helper: credit coins to a user
// ─────────────────────────────────────────
const creditCoins = async (user_id, amount, reason) => {
  try {
    const [user] = await db.query(
      'SELECT skill_coins FROM User WHERE User_Id = ?',
      [user_id]
    );

    const currentBalance = user[0].skill_coins || 0;
    const newBalance = currentBalance + amount;

    await db.query(
      'UPDATE User SET skill_coins = ? WHERE User_Id = ?',
      [newBalance, user_id]
    );

    await db.query(
      `INSERT INTO Wallet_Transaction 
       (user_id, type, amount, reason, running_balance) 
       VALUES (?, 'CREDIT', ?, ?, ?)`,
      [user_id, amount, reason, newBalance]
    );

    return newBalance;
  } catch (err) {
    console.error('Credit coins error:', err.message);
  }
};

module.exports = {
  getAllBadges,
  getUserBadges,
  awardBadge,
  getLeaderboard,
  checkAndAwardBadges,
  creditCoins,
};
