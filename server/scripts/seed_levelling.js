const db = require('../config/db');

async function seed() {
  try {
    const [mentors] = await db.query("SELECT User_Id, First_Name, Last_Name FROM user WHERE role = 'Mentor'");
    if (!mentors || mentors.length === 0) {
      console.log('No mentors found to seed Levelling_Data for.');
      process.exit(0);
    }

    // pick a default skill id (first skill) or create one if none
    const [skills] = await db.query('SELECT Skill_Id FROM Skill LIMIT 1');
    let skillId;
    if (skills.length > 0) skillId = skills[0].Skill_Id;
    else {
      const [res] = await db.query("INSERT INTO Skill (Skill_Name, Category) VALUES ('General', 'General')");
      skillId = res.insertId;
    }

    for (const m of mentors) {
      const [exists] = await db.query('SELECT * FROM Levelling_Data WHERE user_id = ?', [m.User_Id]);
      if (exists.length > 0) {
        console.log(`Levelling_Data exists for user ${m.User_Id} (${m.First_Name})`);
        continue;
      }

      const score = Math.floor(Math.random() * 5000) + 100;
      const level = score > 3000 ? 'Gold' : score > 1500 ? 'Silver' : 'Bronze';
      const totalSessions = Math.floor(Math.random() * 200);
      const avgRating = (Math.random() * 2 + 3).toFixed(2);

      await db.query(
        'INSERT INTO Levelling_Data (user_id, skill_id, score, level, session_count, average_rating, updated_at) VALUES (?, ?, ?, ?, ?, ?, NOW())',
        [m.User_Id, skillId, score, level, totalSessions, avgRating]
      );
      console.log(`Inserted levelling for ${m.User_Id} - ${m.First_Name} ${m.Last_Name}: score=${score}`);
    }

    console.log('Seeding complete.');
    process.exit(0);
  } catch (err) {
    console.error('Failed to seed levelling data:', err);
    process.exit(1);
  }
}

seed();
