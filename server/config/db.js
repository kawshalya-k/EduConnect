const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

let dbInstance = null;

async function initDB() {
  dbInstance = await open({
    filename: './educonnect.db',
    driver: sqlite3.Database
  });

  // Create Users table
  await dbInstance.exec(`
    CREATE TABLE IF NOT EXISTS Users (
      user_id INTEGER PRIMARY KEY AUTOINCREMENT,
      full_name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'Learner',
      otp_code TEXT,
      otp_expiry DATETIME,
      is_verified BOOLEAN DEFAULT 0,
      skill_coins INTEGER DEFAULT 0
    )
  `);

  console.log('✅ EduConnect is successfully connected to the local SQLite Database!');
}

initDB().catch(err => {
  console.error('❌ Failed to initialize local SQLite database:', err.message);
});

// Wrapper to mimic mysql2's API so we don't have to change controllers
const db = {
  query: async (sql, params = []) => {
    if (!dbInstance) throw new Error('Database not initialized yet');
    
    // SQLite uses $1, $2 or ? but mysql2 uses ?
    // Check if it's a SELECT query
    if (sql.trim().toUpperCase().startsWith('SELECT')) {
      const rows = await dbInstance.all(sql, params);
      return [rows]; // mimic mysql2 returning [rows, fields]
    } else {
      const result = await dbInstance.run(sql, params);
      return [result]; // For INSERT, UPDATE, DELETE
    }
  }
};

module.exports = db;