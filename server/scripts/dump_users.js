const db = require('../config/db');

(async () => {
  await new Promise(r => setTimeout(r, 500));
  try {
    const [rows] = await db.query('SELECT User_Id, First_Name, Email, skill_coins FROM `User` LIMIT 50');
    console.log(rows);
  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    process.exit();
  }
})();
