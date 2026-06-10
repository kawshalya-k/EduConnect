// server/utils/challengeScheduler.js

const db = require('../config/db');

const runWeeklyReset = async () => {
  try {
    console.log('Running weekly challenge reset...');

    const [users] = await db.query('SELECT User_Id FROM User');

    for (const user of users) {
      const [sessions] = await db.query(`
        SELECT COUNT(*) as count FROM Session 
        WHERE Learner_Id = ? 
        AND Status = 'completed'
        AND Created_At >= DATE_SUB(NOW(), INTERVAL 7 DAY)
      `, [user.User_Id]);

      if (sessions[0].count >= 3) {
        // Since Coin_Config might not exist, we'll hardcode the reward for now or query it if it exists.
        // Assuming reward is 50.
        const reward = 50;

        const [userData] = await db.query(
          'SELECT skill_coins FROM User WHERE User_Id = ?',
          [user.User_Id]
        );

        const newBalance = userData[0].skill_coins + reward;

        await db.query(
          'UPDATE User SET skill_coins = ? WHERE User_Id = ?',
          [newBalance, user.User_Id]
        );

        await db.query(
          `INSERT INTO Wallet_Transaction 
           (User_Id, Transaction_Type, Amount, Description)
           VALUES (?, 'CREDIT', ?, 'Weekly challenge completed!')`,
          [user.User_Id, reward]
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
