require('dotenv').config();
const mysql = require('mysql2/promise');

async function killAll() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME
    });

    const [processlist] = await connection.query('SHOW FULL PROCESSLIST');
    for (const p of processlist) {
      if (p.Command === 'Sleep' && p.Id !== connection.threadId) {
        console.log('Killing ' + p.Id);
        try {
          await connection.query('KILL ' + p.Id);
        } catch(e) {}
      }
    }
    await connection.end();
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
killAll();
