require('dotenv').config();
const mysql = require('mysql2/promise');
const express = require('express');

async function run() {
  let dbInstance = null;
  const dbPromise = (async () => {
    dbInstance = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME
    });
    const conn = await dbInstance.getConnection();
    throw new Error('Fake error during table creation!');
  })().catch(e => console.error('Caught error in initDB:', e.message));

  await dbPromise;
  console.log("dbInstance is", !!dbInstance);
  
  if (!dbInstance) {
    console.log("Retrying...");
  } else {
    try {
      await dbInstance.query('SELECT 1');
      console.log('SELECT 1 succeeded!');
      const app = express();
      app.listen(5000, () => console.log('Listening on 5000'));
    } catch (e) {
      console.error('SELECT 1 failed', e.message);
    }
  }
}
run();
