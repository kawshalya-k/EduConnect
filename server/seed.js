require('dotenv').config();
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function seed() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'educonnect'
  });

  try {
    console.log('Seeding started...');

    // 1. Seed Skills
    const skills = [
      ['Python Development', 'Engineering', 'Backend development with Python and Django/Flask'],
      ['UX Design & Research', 'Design', 'User experience and interface design'],
      ['Data Science', 'Engineering', 'Machine learning and data analysis'],
      ['Digital Marketing', 'Marketing', 'SEO, SEM, and social media strategy'],
      ['Public Speaking', 'Soft Skills', 'Communication and presentation skills']
    ];

    for (const skill of skills) {
      await connection.query(
        'INSERT IGNORE INTO Skill (Skill_Name, Category, Description) VALUES (?, ?, ?)',
        skill
      );
    }
    console.log('Skills seeded.');

    // Fetch skill IDs
    const [skillRows] = await connection.query('SELECT * FROM Skill');
    const skillMap = {};
    skillRows.forEach(s => skillMap[s.Skill_Name] = s.Skill_Id);

    // Schema update
    try {
      await connection.query('ALTER TABLE User ADD COLUMN Avatar VARCHAR(500)');
    } catch (e) {
      if (e.code !== 'ER_DUP_FIELDNAME') throw e;
    }

    // 2. Seed Mentors
    const defaultPassword = await bcrypt.hash('password123', 10);
    const mentors = [
      ['Sarah', 'Chen', 'sarah.c@test.ac.lk', defaultPassword, 'University of Colombo', 'Mentor', 1, 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah&backgroundColor=E2E8F0', 'UX Strategy & Design Thinking'],
      ['David', 'Miller', 'david.m@test.ac.lk', defaultPassword, 'University of Peradeniya', 'Mentor', 1, 'https://api.dicebear.com/7.x/avataaars/svg?seed=David&backgroundColor=E2E8F0', 'Python Developer & Data Engineer'],
      ['Elena', 'Rodriguez', 'elena.r@test.ac.lk', defaultPassword, 'University of Moratuwa', 'Mentor', 1, 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena&backgroundColor=E2E8F0', 'Product Management Lead']
    ];

    for (const mentor of mentors) {
      const [existing] = await connection.query('SELECT User_Id FROM User WHERE Email = ?', [mentor[2]]);
      if (existing.length === 0) {
        await connection.query(
          'INSERT INTO User (First_Name, Last_Name, Email, Password, University, Role, is_verified, Avatar, Bio) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
          mentor
        );
      }
    }
    console.log('Mentors seeded.');

    // Fetch mentor IDs
    const [userRows] = await connection.query('SELECT User_Id, Email FROM User WHERE Role = "Mentor"');
    
    // 3. Link Mentors to Skills
    const mentorSkillLinks = {
      'sarah.c@test.ac.lk': ['UX Design & Research'],
      'david.m@test.ac.lk': ['Python Development', 'Data Science'],
      'elena.r@test.ac.lk': ['Digital Marketing', 'Public Speaking']
    };

    for (const user of userRows) {
      const userSkills = mentorSkillLinks[user.Email];
      if (!userSkills) continue;

      for (const skillName of userSkills) {
        const skillId = skillMap[skillName];
        if (skillId) {
          const [existingLink] = await connection.query(
            'SELECT * FROM User_Skill WHERE User_Id = ? AND Skill_Id = ?',
            [user.User_Id, skillId]
          );
          if (existingLink.length === 0) {
            await connection.query(
              'INSERT INTO User_Skill (User_Id, Skill_Id, Role, Mentor_Level, Verification_Status) VALUES (?, ?, ?, ?, ?)',
              [user.User_Id, skillId, 'Mentor', 'GOLD MENTOR', true]
            );
          }
        }
      }
    }
    console.log('Mentor skills seeded.');

    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Error during seeding:', error);
  } finally {
    await connection.end();
  }
}

seed();
