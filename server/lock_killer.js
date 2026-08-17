require('dotenv').config();
const mysql = require('mysql2/promise');

async function run() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME
  });

  console.log("Starting lock killer...");
  
  for(let i=0; i<60; i++) {
    const [processlist] = await connection.query('SHOW FULL PROCESSLIST');
    for (const p of processlist) {
      if (p.Command === 'Sleep' && p.Id !== connection.threadId) {
        console.log(`Killing sleep process ${p.Id}`);
        try {
          await connection.query(`KILL ${p.Id}`);
        } catch(e) {}
      }
    }
    await new Promise(r => setTimeout(r, 1000));
  }
  await connection.end();
}
run();
