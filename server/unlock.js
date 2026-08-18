require('dotenv').config({ path: __dirname + '/.env' });
const mysql = require('mysql2/promise');

async function unlock() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME
    });

    const [processlist] = await connection.query('SHOW FULL PROCESSLIST');
    let killed = 0;
    for (const process of processlist) {
      if (process.Command === 'Sleep' && process.Time > 1) {
        console.log(`Killing sleeping process ${process.Id}...`);
        try { await connection.query(`KILL ${process.Id}`); killed++; } catch(e){}
      }
    }
    console.log(`Killed ${killed} locked/sleeping processes.`);
    await connection.end();
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
unlock();
