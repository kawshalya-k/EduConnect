require('dotenv').config();
const mysql = require('mysql2/promise');

const poolConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  multipleStatements: true
};

let dbInstance = null;

async function initDB() {
  try {
    const initialConnection = await mysql.createConnection({
      host: poolConfig.host,
      user: poolConfig.user,
      password: poolConfig.password,
      port: poolConfig.port
    });

    await initialConnection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'educonnect'}\``);
    await initialConnection.end();

    dbInstance = mysql.createPool({
      ...poolConfig,
      database: process.env.DB_NAME || 'educonnect'
    });

    console.log('✅ EduConnect is successfully connected to the local MySQL Database!');

    const connection = await dbInstance.getConnection();

    await connection.query(`CREATE TABLE IF NOT EXISTS User (
      User_Id INT AUTO_INCREMENT PRIMARY KEY,
      First_Name VARCHAR(100) NOT NULL,
      Last_Name VARCHAR(100) NOT NULL,
      Email VARCHAR(255) UNIQUE NOT NULL,
      Password VARCHAR(255) NOT NULL,
      University VARCHAR(255),
      Role VARCHAR(50) DEFAULT 'Student',
      Wallet_Balance INT DEFAULT 0,
      Bio TEXT,
      Status VARCHAR(50) DEFAULT 'Active',
      otp_code VARCHAR(10),
      otp_expiry DATETIME,
      is_verified BOOLEAN DEFAULT FALSE,
      reset_token VARCHAR(255),
      reset_token_expiry DATETIME,
      skill_coins INT DEFAULT 0
    )`);

    await connection.query(`CREATE TABLE IF NOT EXISTS Admin (
      Admin_Id INT AUTO_INCREMENT PRIMARY KEY,
      User_Id INT NOT NULL,
      Role VARCHAR(50) DEFAULT 'Administrator',
      FOREIGN KEY (User_Id) REFERENCES User(User_Id) ON DELETE CASCADE
    )`);

    await connection.query(`CREATE TABLE IF NOT EXISTS Skill (
      Skill_Id INT AUTO_INCREMENT PRIMARY KEY,
      Skill_Name VARCHAR(100) NOT NULL,
      Category VARCHAR(100),
      Description TEXT
    )`);

    await connection.query(`CREATE TABLE IF NOT EXISTS Session (
      Session_Id INT AUTO_INCREMENT PRIMARY KEY,
      Skill_Id INT NOT NULL,
      Learner_Id INT NOT NULL,
      Mentor_Id INT NOT NULL,
      Session_Type VARCHAR(50),
      Date DATE,
      Time TIME,
      Duration INT,
      Status VARCHAR(50) DEFAULT 'Pending',
      Rating INT,
      Cost INT DEFAULT 0,
      Reward INT DEFAULT 0,
      Feedback TEXT,
      Meeting_Link VARCHAR(500),
      Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (Skill_Id) REFERENCES Skill(Skill_Id) ON DELETE CASCADE,
      FOREIGN KEY (Learner_Id) REFERENCES User(User_Id) ON DELETE CASCADE,
      FOREIGN KEY (Mentor_Id) REFERENCES User(User_Id) ON DELETE CASCADE
    )`);

    await connection.query(`CREATE TABLE IF NOT EXISTS Badge (
      Badge_Id INT AUTO_INCREMENT PRIMARY KEY,
      Badge_Name VARCHAR(100) NOT NULL,
      Criteria TEXT,
      Description TEXT
    )`);

    await connection.query(`CREATE TABLE IF NOT EXISTS User_Skill (
      User_Skill_Id INT AUTO_INCREMENT PRIMARY KEY,
      User_Id INT NOT NULL,
      Skill_Id INT NOT NULL,
      Role VARCHAR(50),
      Mentor_Level VARCHAR(50),
      Verification_Status BOOLEAN DEFAULT FALSE,
      Certificates TEXT,
      FOREIGN KEY (User_Id) REFERENCES User(User_Id) ON DELETE CASCADE,
      FOREIGN KEY (Skill_Id) REFERENCES Skill(Skill_Id) ON DELETE CASCADE
    )`);

    await connection.query(`CREATE TABLE IF NOT EXISTS User_Badge (
      User_Id INT NOT NULL,
      Badge_Id INT NOT NULL,
      Awarded_Date DATETIME DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (User_Id, Badge_Id),
      FOREIGN KEY (User_Id) REFERENCES User(User_Id) ON DELETE CASCADE,
      FOREIGN KEY (Badge_Id) REFERENCES Badge(Badge_Id) ON DELETE CASCADE
    )`);

    await connection.query(`CREATE TABLE IF NOT EXISTS Wallet_Transaction (
      Transaction_Id INT AUTO_INCREMENT PRIMARY KEY,
      User_Id INT NOT NULL,
      Transaction_Type VARCHAR(50),
      Amount INT,
      Timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      Description TEXT,
      FOREIGN KEY (User_Id) REFERENCES User(User_Id) ON DELETE CASCADE
    )`);

    await connection.query(`CREATE TABLE IF NOT EXISTS Levelling_Data (
      Record_Id INT AUTO_INCREMENT PRIMARY KEY,
      Mentor_Id INT NOT NULL,
      Skill_Id INT NOT NULL,
      Average_Rating DECIMAL(3, 2) DEFAULT 0.00,
      Total_Sessions INT DEFAULT 0,
      Score INT DEFAULT 0,
      Mentor_Level VARCHAR(50) DEFAULT 'Bronze',
      Last_Evaluation_Date DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (Mentor_Id) REFERENCES User(User_Id) ON DELETE CASCADE,
      FOREIGN KEY (Skill_Id) REFERENCES Skill(Skill_Id) ON DELETE CASCADE
    )`);

    await connection.query(`CREATE TABLE IF NOT EXISTS Notification (
      Notification_Id INT AUTO_INCREMENT PRIMARY KEY,
      User_Id INT NOT NULL,
      Title VARCHAR(255) NOT NULL,
      Message TEXT NOT NULL,
      Type VARCHAR(50) DEFAULT 'system',
      Is_Read BOOLEAN DEFAULT FALSE,
      Created_At DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (User_Id) REFERENCES User(User_Id) ON DELETE CASCADE
    )`);

    connection.release();
    console.log('✅ All 10 MySQL tables are verified and ready.');

  } catch (err) {
    console.error('❌ Failed to initialize MySQL database:', err.message);
  }
}

const dbPromise = initDB();

const db = {
  query: async (sqitl, params = []) => {
    await dbPromise;
    if (!dbInstance) throw new Error('Database not initialized yet');
    const [rows, fields] = await dbInstance.query(sql, params);
    return [rows, fields];
  },
  getConnection: async () => {
    await dbPromise;
    if (!dbInstance) throw new Error('Database not initialized yet');
    return dbInstance.getConnection();
  }
};

module.exports = db;