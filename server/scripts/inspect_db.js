const db = require('../config/db');

(async () => {
  // Wait for DB init
  await new Promise(r => setTimeout(r, 1000));
  try {
    const [tables] = await db.query("SHOW TABLES");
    console.log('Tables:');
    console.log(tables);

    try {
      const [cols] = await db.query('SHOW COLUMNS FROM Levelling_Data');
      console.log('Levelling_Data columns:');
      console.log(cols);
    } catch (e) {
      console.error('Error describing Levelling_Data:', e.message);
    }

    // Also try lowercase table name
    try {
      const [cols2] = await db.query('SHOW COLUMNS FROM levelling_data');
      console.log('levelling_data columns:');
      console.log(cols2);
    } catch (e) {
      console.error('Error describing levelling_data:', e.message);
    }

    try {
      const [userCols] = await db.query('SHOW COLUMNS FROM user');
      console.log('user columns:');
      console.log(userCols);
    } catch (e) {
      console.error('Error describing user:', e.message);
    }

  } catch (err) {
    console.error('DB inspect failed:', err.message);
  } finally {
    process.exit();
  }
})();
