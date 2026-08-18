require('dotenv').config();
const mysql = require('mysql2/promise');

async function kill() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME
    });

    await connection.query('KILL 109');
    await connection.query('KILL 110');
    console.log('Killed processes 109 and 110.');
    await connection.end();
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
kill();
