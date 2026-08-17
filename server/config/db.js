require('dotenv').config();
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

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

console.log('DB poolConfig preview:', { host: poolConfig.host, user: poolConfig.user, passwordPresent: Boolean(poolConfig.password), port: poolConfig.port });

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
      skill_coins INT DEFAULT 100
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
      Verification_Status VARCHAR(50) DEFAULT 'Pending',
      Certificates TEXT,
      Last_Attempt DATETIME,
      FOREIGN KEY (User_Id) REFERENCES User(User_Id) ON DELETE CASCADE,
      FOREIGN KEY (Skill_Id) REFERENCES Skill(Skill_Id) ON DELETE CASCADE
    )`);

    // Dynamically add Confidence column if not exists
    try {
      await connection.query(`ALTER TABLE User_Skill ADD COLUMN Confidence INT DEFAULT 5`);
      console.log('✅ Added Confidence column to User_Skill table');
    } catch (e) {
      // Column might already exist, ignore error
    }

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

    // Schema updates
    try {
      await connection.query('ALTER TABLE User ADD COLUMN Avatar VARCHAR(500)');
      console.log('✅ Added Avatar column to User table.');
    } catch (e) {
      if (e.code !== 'ER_DUP_FIELDNAME') {
        console.error('Error adding Avatar column:', e.message);
      }
    }

    try {
      await connection.query('ALTER TABLE User ADD COLUMN Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP');
      console.log('✅ Added Created_At column to User table.');
    } catch (e) {
      if (e.code !== 'ER_DUP_FIELDNAME') {
        console.error('Error adding Created_At column to User:', e.message);
      }
    }

    try {
      await connection.query("ALTER TABLE User_Skill MODIFY COLUMN Verification_Status VARCHAR(50) DEFAULT 'Pending'");
      console.log("✅ Modified Verification_Status column in User_Skill table to VARCHAR(50).");
    } catch (e) {
      console.error('Error modifying Verification_Status column:', e.message);
    }

    try {
      await connection.query('ALTER TABLE User_Skill ADD COLUMN Last_Attempt DATETIME');
      console.log('✅ Added Last_Attempt column to User_Skill table.');
    } catch (e) {
      if (e.code !== 'ER_DUP_FIELDNAME') {
        console.error('Error adding Last_Attempt column:', e.message);
      }
    }

    try {
      await connection.query('ALTER TABLE Session ADD COLUMN Meeting_Link VARCHAR(500)');
      console.log('✅ Added Meeting_Link column to Session table.');
    } catch (e) {
      if (e.code !== 'ER_DUP_FIELDNAME') {
        console.error('Error adding Meeting_Link column:', e.message);
      }
    }

    try {
      await connection.query('ALTER TABLE Session ADD COLUMN Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP');
      console.log('✅ Added Created_At column to Session table.');
    } catch (e) {
      if (e.code !== 'ER_DUP_FIELDNAME') {
        console.error('Error adding Created_At column:', e.message);
      }
    }

    // Seed 10 core skills
    try {
      const skillsToSeed = [
        { name: 'JavaScript', category: 'Web Development', desc: 'Core JavaScript language assessment' },
        { name: 'Python', category: 'Web Development', desc: 'Core Python programming language assessment' },
        { name: 'SQL', category: 'Web Development', desc: 'Relational database queries and optimization assessment' },
        { name: 'Git', category: 'Web Development', desc: 'Distributed version control and collaboration assessment' },
        { name: 'Figma', category: 'UI/UX Design', desc: 'Interface design and collaborative prototyping assessment' },
        { name: 'Information Architecture', category: 'UI/UX Design', desc: 'Structuring, labeling, and organizing content assessment' },
        { name: 'Statistics', category: 'Data Science', desc: 'Quantitative data analysis, probability, and hypothesis testing assessment' },
        { name: 'NLP', category: 'Data Science', desc: 'Natural language processing and computational linguistics assessment' },
        { name: 'Android Development', category: 'Mobile Development', desc: 'Native Android application development assessment' },
        { name: 'Flutter', category: 'Mobile Development', desc: 'Cross-platform mobile development using Flutter and Dart assessment' }
      ];
      for (const s of skillsToSeed) {
        const [existing] = await connection.query('SELECT Skill_Id FROM Skill WHERE Skill_Name = ?', [s.name]);
        if (existing.length === 0) {
          await connection.query('INSERT INTO Skill (Skill_Name, Category, Description) VALUES (?, ?, ?)', [s.name, s.category, s.desc]);
          console.log(`✅ Seeded skill: ${s.name}`);
        } else {
          await connection.query('UPDATE Skill SET Category = ?, Description = ? WHERE Skill_Id = ?', [s.category, s.desc, existing[0].Skill_Id]);
        }
      }
      console.log('✅ 10 core verification skills are seeded/verified.');
    } catch (e) {
      console.error('Error seeding core skills:', e.message);
    }

    // Seed default Admin user
    try {
      const adminEmail = 'admin@sliit.ac.lk';
      const [existingAdmin] = await connection.query('SELECT User_Id FROM User WHERE Email = ?', [adminEmail]);
      let adminUserId;

      if (existingAdmin.length === 0) {
        const hashedPassword = await bcrypt.hash('admin123', 10);
        const [insertRes] = await connection.query(
          `INSERT INTO User (First_Name, Last_Name, Email, Password, University, Role, is_verified, skill_coins) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          ['System', 'Administrator', adminEmail, hashedPassword, 'SLIIT', 'Admin', 1, 9999]
        );
        adminUserId = insertRes.insertId;
        console.log(`✅ Seeded default Admin user: ${adminEmail}`);
      } else {
        adminUserId = existingAdmin[0].User_Id;
      }

      const [adminRecord] = await connection.query('SELECT Admin_Id FROM Admin WHERE User_Id = ?', [adminUserId]);
      if (adminRecord.length === 0) {
        await connection.query('INSERT INTO Admin (User_Id, Role) VALUES (?, ?)', [adminUserId, 'Administrator']);
        console.log(`✅ Linked Admin record for User_Id: ${adminUserId}`);
      }
    } catch (e) {
      console.error('Error seeding default admin:', e.message);
    }

    connection.release();
    console.log('✅ All 10 MySQL tables are verified and ready.');

  } catch (err) {
    console.error('❌ Failed to initialize MySQL database:', err);
  }
}

const dbPromise = initDB();

const db = {
  query: async (sql, params = []) => {
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