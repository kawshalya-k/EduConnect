require('dotenv').config();
const mysql = require('mysql2/promise');

async function check() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME
    });

    console.log("Running ALTER TABLE...");
    await connection.query('ALTER TABLE User_Skill ADD COLUMN Last_Attempt DATETIME');
    console.log("Done!");
    await connection.end();
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
check();
