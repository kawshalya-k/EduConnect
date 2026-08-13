const db = require('./config/db');

async function test() {
  try {
    console.log('--- Testing DB connection and querying tables ---');
    
    const [users] = await db.query('SELECT User_Id, First_Name, Last_Name, Role, Status FROM User');
    console.log('Users in DB:', users);

    const [userSkills] = await db.query('SELECT * FROM User_Skill');
    console.log('User Skills in DB:', userSkills);

    const [skills] = await db.query('SELECT * FROM Skill');
    console.log('Skills in DB:', skills);

    const [levelling] = await db.query('SELECT * FROM Levelling_Data');
    console.log('Levelling Data in DB:', levelling);

    const [sessions] = await db.query('SELECT * FROM Session');
    console.log('Sessions in DB:', sessions);

  } catch (err) {
    console.error('Error running test script:', err);
  } finally {
    process.exit(0);
  }
}

test();
