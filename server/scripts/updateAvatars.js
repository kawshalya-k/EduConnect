const db = require('../config/db');

async function updateAvatars() {
  try {
    console.log('Updating all user avatars to /default-avatar.svg...');
    const [result] = await db.query('UPDATE User SET Avatar = "/default-avatar.svg"');
    console.log(`Successfully updated ${result.affectedRows} users.`);
  } catch (err) {
    console.error('Error updating avatars:', err);
  } finally {
    process.exit(0);
  }
}

updateAvatars();
