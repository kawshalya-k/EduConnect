const mysql = require('mysql2');
require('dotenv').config();

// This creates a "Pool," which is better for a team of 5 people
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});


db.getConnection((err, connection) => {
  if (err) {
    console.error(' Connection to Railway failed:', err.message);
  } else {
    console.log(' EduConnect is successfully connected to the Railway Database!');
    connection.release();
  }
});

module.exports = db.promise(); // Adding .promise() makes it easier to use later