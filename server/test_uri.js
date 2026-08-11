require('dotenv').config();
const mysql = require('mysql2/promise');

async function check() {
  try {
    const uri = `mysql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
    console.log("URI: " + uri);
    const connection = await mysql.createConnection({uri});
    await connection.query('SELECT 1');
    console.log("Success with URI!");
    await connection.end();
    process.exit(0);
  } catch (err) {
    console.error("Failed with URI:", err.message);
    process.exit(1);
  }
}
check();
