const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const db = require('../config/db');
const { syncMentorEmbedding } = require('../utils/embedMentor');

async function seedEmbeddings() {
  console.log('[Seed Embeddings] Starting initial embedding sync...');
  try {
    const [rows] = await db.query(
      `SELECT User_Id, Skill_Id FROM User_Skill WHERE Role = 'Mentor' AND (Verification_Status = 1 OR Verification_Status = 'Verified')`
    );

    console.log(`[Seed Embeddings] Found ${rows.length} verified mentor-skill profiles to index.`);

    // Batch process in size of 10 to avoid Gemini API rate limits
    const batchSize = 10;
    for (let i = 0; i < rows.length; i += batchSize) {
      const batch = rows.slice(i, i + batchSize);
      console.log(`[Seed Embeddings] Processing batch ${Math.floor(i / batchSize) + 1}...`);
      
      const promises = batch.map(row => syncMentorEmbedding(row.User_Id, row.Skill_Id));
      await Promise.allSettled(promises);
      
      // Delay slightly between batches
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log('[Seed Embeddings] Initial embedding sync completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('[Seed Embeddings] Error during seeding:', err.message);
    process.exit(1);
  }
}

seedEmbeddings();
