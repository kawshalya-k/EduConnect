// server/utils/challengeScheduler.js

const db = require('../config/db');

const runWeeklyReset = async () => {
  try {
    console.log('Running weekly challenge reset...');

    const [users] = await db.query('SELECT user_id FROM users');

    for (const user of users) {
      const [sessions] = await db.query(`
        SELECT COUNT(*) as count FROM sessions 
        WHERE learner_id = ? 
        AND status = 'completed'
        AND created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
      `, [user.user_id]);

      if (sessions[0].count >= 3) {
        const [config] = await db.query(
          'SELECT config_value FROM Coin_Config WHERE config_key = "CHALLENGE_COMPLETE_REWARD"'
        );
        const reward = config[0].config_value;

        const [userData] = await db.query(
          'SELECT skill_coins_balance FROM users WHERE user_id = ?',
          [user.user_id]
        );

        const newBalance = userData[0].skill_coins_balance + reward;

        await db.query(
          'UPDATE users SET skill_coins_balance = ? WHERE user_id = ?',
          [newBalance, user.user_id]
        );

        await db.query(
          `INSERT INTO Wallet_Transaction 
           (user_id, type, amount, reason, running_balance)
           VALUES (?, 'CREDIT', ?, 'Weekly challenge completed!', ?)`,
          [user.user_id, reward, newBalance]
        );

        console.log(`Weekly reward given to user ${user.user_id}`);
      }
    }

    console.log('Weekly reset complete!');
  } catch (err) {
    console.error('Weekly scheduler error:', err.message);
  }
};

const startScheduler = () => {
  const now        = new Date();
  const nextMonday = new Date();
  nextMonday.setDate(now.getDate() + (7 - now.getDay() + 1) % 7 || 7);
  nextMonday.setHours(0, 0, 0, 0);

  const timeUntilMonday = nextMonday - now;

  setTimeout(() => {
    runWeeklyReset();
    setInterval(runWeeklyReset, 7 * 24 * 60 * 60 * 1000);
  }, timeUntilMonday);

  console.log(`Weekly scheduler started. Next reset: ${nextMonday}`);
};

module.exports = { startScheduler, runWeeklyReset };
