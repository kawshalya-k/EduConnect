require('dotenv').config();
const mysql = require('mysql2/promise');

async function test() {
  try {
    const conn = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: ''
    });
    console.log('Connected to MySQL without database selected!');
    
    await conn.query('CREATE DATABASE IF NOT EXISTS educonnect');
    console.log('Created/Verified database educonnect');
    
    await conn.changeUser({ database: 'educonnect' });
    console.log('Successfully switched to educonnect database!');
    
    conn.end();
  } catch (err) {
    console.error('Connection failed:', err.message);
  }
}

test();
