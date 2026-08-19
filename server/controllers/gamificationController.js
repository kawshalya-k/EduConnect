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

    const [badges] = await db.query(`
      SELECT b.*, ub.\`${bc.awardedAt}\` AS awarded_at
      FROM Badge b
      JOIN User_Badge ub ON b.\`${bc.badgeId}\` = ub.\`${bc.ubBadgeId}\`
      WHERE ub.\`${bc.userId}\` = ?
      ORDER BY ub.\`${bc.awardedAt}\` DESC
    `, [id]);

    res.json({ success: true, badges });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

let transactionColumns = null;
const getTransactionColumns = async () => {
  if (transactionColumns) return transactionColumns;
  const [rows] = await db.query(
    `SELECT COLUMN_NAME FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'Wallet_Transaction'`
  );
  const cols = new Set(rows.map((row) => row.COLUMN_NAME));
  transactionColumns = {
    userId: cols.has('user_id') ? 'user_id' : 'User_Id',
    type: cols.has('type') ? 'type' : 'Transaction_Type',
    amount: cols.has('amount') ? 'amount' : 'Amount',
  };
  return transactionColumns;
};

const getBadgeProgress = async (req, res) => {
  try {
    const userId = Number(req.params.id);
    const bc = await getBadgeColumns();
    const tc = await getTransactionColumns();
    const [badges] = await db.query(`SELECT * FROM Badge ORDER BY \`${bc.badgeId}\``);
    const [earned] = await db.query(
      `SELECT \`${bc.ubBadgeId}\` AS badge_id FROM User_Badge WHERE \`${bc.userId}\` = ?`,
      [userId]
    );
    const earnedIds = new Set(earned.map((badge) => Number(badge.badge_id)));

    const [sessionRows] = await db.query(
      `SELECT Date AS session_date, Created_At AS created_at
       FROM Session WHERE (Learner_Id = ? OR Mentor_Id = ?) AND Status = 'Completed'
       ORDER BY Date ASC`,
      [userId, userId]
    );
    let longestStreak = 0;
    let currentStreak = 0;
    let previousDate = null;
    for (const session of sessionRows) {
      const date = new Date(session.session_date || session.created_at);
      date.setHours(0, 0, 0, 0);
      if (previousDate && (date - previousDate) / 86400000 === 1) currentStreak += 1;
      else if (!previousDate || date.getTime() !== previousDate.getTime()) currentStreak = 1;
      longestStreak = Math.max(longestStreak, currentStreak);
      previousDate = date;
    }

    const [coinRows] = await db.query(
      `SELECT COALESCE(SUM(CASE WHEN \`${tc.type}\` = 'CREDIT' THEN \`${tc.amount}\` ELSE 0 END), 0) AS earned_coins
       FROM Wallet_Transaction WHERE \`${tc.userId}\` = ?`,
      [userId]
    );
    const [rankRows] = await db.query(
      `SELECT user_id FROM (
        SELECT u.User_Id AS user_id, ROW_NUMBER() OVER (ORDER BY u.skill_coins DESC) AS rank_no
        FROM User u
      ) ranked WHERE user_id = ? AND rank_no = 1`,
      [userId]
    );
    const metrics = {
      session_count: sessionRows.length,
      fast_learner: 0,
      leaderboard_top: rankRows.length ? 1 : 0,
      streak_days: longestStreak,
      community: 0,
      courses: 0,
      coins_earned: Number(coinRows[0]?.earned_coins || 0),
    };

    const definitions = {
      'First Session': { description: 'Complete your very first learning session', trigger: 'session_count', threshold: 1 },
      'Fast Learner': { description: 'Finish a full course module in 24 hours', trigger: 'fast_learner', threshold: 1 },
      'Top Student': { description: 'Reach #1 on the weekly leaderboard', trigger: 'leaderboard_top', threshold: 1 },
      '7-Day Streak': { description: 'Study for 7 consecutive days', trigger: 'streak_days', threshold: 7 },
      Collaborator: { description: 'Contribute to 5 community discussions', trigger: 'community', threshold: 5 },
      'Course Master': { description: 'Complete 10 full courses at 90% average', trigger: 'courses', threshold: 10 },
      'Coin Collector': { description: 'Earn over 1000 Skill Coins', trigger: 'coins_earned', threshold: 1000 },
    };

    const progress = badges.map((badge) => {
      const name = badge[bc.name];
      const definition = definitions[name] || { description: badge.Description || '', trigger: 'session_count', threshold: 1 };
      const trigger = badge.trigger_type || definition.trigger;
      const threshold = badge.trigger_type ? Number(badge.threshold || definition.threshold) : definition.threshold;
      const value = Number(metrics[trigger] || 0);
      const badgeId = Number(badge[bc.badgeId]);
      const percent = earnedIds.has(badgeId) ? 100 : Math.min(100, Math.round((value / threshold) * 100));
      return {
        badge_id: badgeId,
        name,
        description: definition.description,
        progress: value,
        threshold,
        percent,
        completed: percent === 100,
        stateLabel: percent === 100 ? 'Completed' : `${value}/${threshold}`,
      };
    });

    res.set('Cache-Control', 'no-store');
    res.json({ success: true, badges: progress });
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
      WHERE u.Role != 'Admin'
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
  getBadgeProgress,
  awardBadge,
  getLeaderboard,
  checkAndAwardBadges,
  creditCoins,
};
