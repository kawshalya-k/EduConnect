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

    const [locks] = await connection.query('SELECT * FROM performance_schema.metadata_locks WHERE OBJECT_NAME = "User_Skill"');
    console.log("Locks:", locks);
    
    const [innodb] = await connection.query('SELECT * FROM information_schema.innodb_trx');
    console.log("InnoDB TRX:", innodb);

    await connection.end();
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
check();
