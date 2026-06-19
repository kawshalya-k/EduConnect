const db = require('../config/db');

async function seed() {
  // Wait for DB init
  await new Promise(r => setTimeout(r, 1000));
  try {
    console.log('Seeding Verification Center skills...');

    // 1. Upsert Skills
    const skillSpecs = [
      ['Python Development', 'Technical', 'Advanced scripting, data structures, and backend logic assessment.'],
      ['UI/ UX Strategy', 'Technical', 'Evaluation of layout principles, color theory, and modern prototyping.'],
      ['Project Management', 'Non-Technical', 'Agile methodologies, sprint planning, and team leadership verification.']
    ];

    const skillMap = {};
    for (const [name, category, desc] of skillSpecs) {
      const [existing] = await db.query('SELECT Skill_Id FROM Skill WHERE Skill_Name = ?', [name]);
      let skillId;
      if (existing.length > 0) {
        skillId = existing[0].Skill_Id;
        await db.query('UPDATE Skill SET Description = ? WHERE Skill_Id = ?', [desc, skillId]);
      } else {
        const [res] = await db.query(
          'INSERT INTO Skill (Skill_Name, Category, Description) VALUES (?, ?, ?)',
          [name, category, desc]
        );
        skillId = res.insertId;
      }
      skillMap[name] = skillId;
    }
    console.log('Skills upserted:', skillMap);

    // 2. Fetch all mentors
    const [mentors] = await db.query("SELECT User_Id FROM User WHERE Role = 'Mentor'");
    if (mentors.length === 0) {
      console.log('No mentors found to link skills to.');
      process.exit(0);
    }

    const targetTime = new Date();
    // subtract 1.76 hours so remaining cooldown is exactly 22.24 hours (22h 14m)
    targetTime.setMilliseconds(targetTime.getMilliseconds() - (1.76 * 60 * 60 * 1000));

    for (const m of mentors) {
      const userId = m.User_Id;
      console.log(`Linking skills for mentor User_Id: ${userId}`);

      // Python Development: Verified
      const pythonId = skillMap['Python Development'];
      const [hasPython] = await db.query('SELECT * FROM User_Skill WHERE User_Id = ? AND Skill_Id = ?', [userId, pythonId]);
      if (hasPython.length > 0) {
        await db.query(
          'UPDATE User_Skill SET Verification_Status = TRUE, Role = ?, Mentor_Level = ?, Last_Attempt = NULL WHERE User_Skill_Id = ?',
          ['Mentor', 'Bronze', hasPython[0].User_Skill_Id]
        );
      } else {
        await db.query(
          'INSERT INTO User_Skill (User_Id, Skill_Id, Role, Mentor_Level, Verification_Status, Last_Attempt) VALUES (?, ?, ?, ?, ?, NULL)',
          [userId, pythonId, 'Mentor', 'Bronze', true]
        );
      }

      // UI/ UX Strategy: Available (not verified, no cooldown)
      const uiUxId = skillMap['UI/ UX Strategy'];
      const [hasUiUx] = await db.query('SELECT * FROM User_Skill WHERE User_Id = ? AND Skill_Id = ?', [userId, uiUxId]);
      if (hasUiUx.length > 0) {
        await db.query(
          'UPDATE User_Skill SET Verification_Status = FALSE, Role = ?, Mentor_Level = NULL, Last_Attempt = NULL WHERE User_Skill_Id = ?',
          ['Student', hasUiUx[0].User_Skill_Id]
        );
      } else {
        await db.query(
          'INSERT INTO User_Skill (User_Id, Skill_Id, Role, Mentor_Level, Verification_Status, Last_Attempt) VALUES (?, ?, ?, NULL, ?, NULL)',
          [userId, uiUxId, 'Student', false]
        );
      }

      // Project Management: Cooldown (locked, retry in 22h 14m)
      const pmId = skillMap['Project Management'];
      const [hasPm] = await db.query('SELECT * FROM User_Skill WHERE User_Id = ? AND Skill_Id = ?', [userId, pmId]);
      if (hasPm.length > 0) {
        await db.query(
          'UPDATE User_Skill SET Verification_Status = FALSE, Role = ?, Mentor_Level = NULL, Last_Attempt = ? WHERE User_Skill_Id = ?',
          ['Student', targetTime, hasPm[0].User_Skill_Id]
        );
      } else {
        await db.query(
          'INSERT INTO User_Skill (User_Id, Skill_Id, Role, Mentor_Level, Verification_Status, Last_Attempt) VALUES (?, ?, ?, NULL, ?, ?)',
          [userId, pmId, 'Student', false, targetTime]
        );
      }
    }

    console.log('Verification skills seeding successfully completed!');
    process.exit(0);
  } catch (err) {
    console.error('Failed to seed verification skills:', err);
    process.exit(1);
  }
}

seed();
