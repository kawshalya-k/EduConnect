// server/controllers/gamificationController.js

const db = require('../config/db');

const getBadgeProgress = async (userId) => {
  const progress = {};
  if (!userId) return progress;

  const [[sessionStats]] = await db.query(
    `SELECT
       SUM(CASE WHEN Learner_Id = ? AND Status = 'Completed' THEN 1 ELSE 0 END) AS completed_sessions,
       SUM(CASE WHEN Learner_Id = ? AND Status <> 'Completed' THEN 1 ELSE 0 END) AS active_sessions
     FROM Session`,
    [userId, userId]
  );
  const completedSessions = Number(sessionStats?.completed_sessions || 0);
  const activeSessions = Number(sessionStats?.active_sessions || 0);

  const [sessionDays] = await db.query(
    `SELECT DISTINCT DATE_FORMAT(Date, '%Y-%m-%d') AS study_day
     FROM Session
     WHERE Learner_Id = ? AND Status = 'Completed'
    ORDER BY study_day DESC`,
    [userId]
  );
  let streakDays = 0;
  for (let index = 0; index < sessionDays.length; index += 1) {
    const currentDay = new Date(`${sessionDays[index].study_day}T00:00:00Z`);
    const previousDay = index === 0
      ? null
      : new Date(`${sessionDays[index - 1].study_day}T00:00:00Z`);
    if (index === 0 || (previousDay - currentDay) / 86400000 === 1) {
      streakDays += 1;
    } else {
      break;
    }
  }

  const [[coinStats]] = await db.query(
    `SELECT COALESCE(SUM(Amount), 0) AS earned_coins
     FROM Wallet_Transaction
     WHERE User_Id = ? AND Transaction_Type = 'CREDIT'`,
    [userId]
  );
  const earnedCoins = Number(coinStats?.earned_coins || 0);

  progress['First Session'] = completedSessions > 0 ? 100 : activeSessions > 0 ? 50 : 0;
  progress['7-Day Streak'] = Math.min(100, Math.round((streakDays / 7) * 100));
  progress['Course Master'] = Math.min(100, Math.round((completedSessions / 10) * 100));
  progress['Coin Collector'] = Math.min(100, Math.round((earnedCoins / 1000) * 100));
  return progress;
};

// ─────────────────────────────────────────
// TASK 7: GET all available badges
// GET /api/gamification/badges
// ─────────────────────────────────────────
const getAllBadges = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Badge');
    const bc = await getBadgeColumns();
    const progress = await getBadgeProgress(req.query.user_id);
    const badges = rows.map((badge) => ({
      badge_id: badge[bc.badgeId],
      name: badge[bc.name],
      description: badge.Description || badge.description,
      progress: progress[badge[bc.name]] || 0,
    }));
    res.json({ success: true, badges });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Badge/User_Badge also exist under two schemas: the snake_case one used by
// the app (badge_id, name, trigger_type, threshold, awarded_at, ...) and the
// legacy CamelCase one auto-created by db.js (Badge_Id, Badge_Name, Awarded_Date, ...).
// Detect once so badge endpoints work against either.
let badgeColumns = null;
const getBadgeColumns = async () => {
  if (badgeColumns) return badgeColumns;
  const [badgeRows] = await db.query(
    `SELECT COLUMN_NAME FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'Badge'`
  );
  const [ubRows] = await db.query(
    `SELECT COLUMN_NAME FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'User_Badge'`
  );
  const b = new Set(badgeRows.map((r) => r.COLUMN_NAME));
  const ub = new Set(ubRows.map((r) => r.COLUMN_NAME));
  badgeColumns = {
    badgeId: b.has('badge_id') ? 'badge_id' : 'Badge_Id',
    name: b.has('name') ? 'name' : 'Badge_Name',
    userId: ub.has('user_id') ? 'user_id' : 'User_Id',
    ubBadgeId: ub.has('badge_id') ? 'badge_id' : 'Badge_Id',
    awardedAt: ub.has('awarded_at') ? 'awarded_at' : 'Awarded_Date',
    hasTriggers: b.has('trigger_type') && b.has('threshold'),
  };
  return badgeColumns;
};

// ─────────────────────────────────────────
// TASK 8: GET badges earned by a user
// GET /api/gamification/users/:id/badges
// ─────────────────────────────────────────
const getUserBadges = async (req, res) => {
  try {
    const { id } = req.params;
    const bc = await getBadgeColumns();

    const [rows] = await db.query(`
      SELECT b.*, ub.\`${bc.awardedAt}\` AS awarded_at
      FROM Badge b
      JOIN User_Badge ub ON b.\`${bc.badgeId}\` = ub.\`${bc.ubBadgeId}\`
      WHERE ub.\`${bc.userId}\` = ?
      ORDER BY ub.\`${bc.awardedAt}\` DESC
    `, [id]);
    const badges = rows.map((badge) => ({
      badge_id: badge[bc.badgeId],
      name: badge[bc.name],
      description: badge.Description || badge.description,
    }));

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
    const bc = await getBadgeColumns();

    // Check if user already has this badge
    const [existing] = await db.query(
      `SELECT * FROM User_Badge WHERE \`${bc.userId}\` = ? AND \`${bc.ubBadgeId}\` = ?`,
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
      `INSERT INTO User_Badge (\`${bc.userId}\`, \`${bc.ubBadgeId}\`) VALUES (?, ?)`,
      [user_id, badge_id]
    );

    // Get badge details
    const [badge] = await db.query(
      `SELECT * FROM Badge WHERE \`${bc.badgeId}\` = ?`,
      [badge_id]
    );

    // Give coins reward for earning badge
    await creditCoins(
      user_id,
      25,
      `Badge earned: ${badge[0][bc.name]}`
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
    const bc = await getBadgeColumns();
    if (!bc.hasTriggers) {
      console.log('Badge check skipped: Badge table has no trigger columns');
      return;
    }

    const [sessions] = await db.query(
      'SELECT COUNT(*) as count FROM Session WHERE Mentor_Id = ? AND Status = "Completed"',
      [user_id]
    );

    const sessionCount = sessions[0].count;

    const [unearned] = await db.query(`
      SELECT b.* FROM Badge b
      WHERE b.\`${bc.badgeId}\` NOT IN (
        SELECT \`${bc.ubBadgeId}\` FROM User_Badge WHERE \`${bc.userId}\` = ?
      )
      AND b.\`trigger_type\` = 'session_count'
    `, [user_id]);

    for (const badge of unearned) {
      if (sessionCount >= badge.threshold) {
        await db.query(
          `INSERT INTO User_Badge (\`${bc.userId}\`, \`${bc.ubBadgeId}\`) VALUES (?, ?)`,
          [user_id, badge[bc.badgeId]]
        );
        console.log(`Badge awarded: ${badge[bc.name]} to user ${user_id}`);
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
