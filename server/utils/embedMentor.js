const { embedText } = require('../config/gemini');
const pineconeIndex = require('../config/pinecone');
const db = require('../config/db');

async function upsertMentorEmbedding(mentorData) {
  try {
    const text = buildMentorText(mentorData);
    const vector = await embedText(text);
    
    await pineconeIndex.upsert([{
      id: `mentor_${mentorData.userId}_skill_${mentorData.skillId}`,
      values: vector,
      metadata: {
        userId: Number(mentorData.userId),
        skillId: Number(mentorData.skillId),
        level: String(mentorData.mentorLevel || 'Bronze'),
        category: String(mentorData.category || 'General'),
        university: String(mentorData.university || ''),
        rating: Number(mentorData.avgRating || 0.00),
        sessions: Number(mentorData.totalSessions || 0)
      }
    }]);
    console.log(`[Embed Mentor] Successfully indexed mentor_${mentorData.userId}_skill_${mentorData.skillId}`);
  } catch (err) {
    console.error(`[Embed Mentor] Error indexing mentor_${mentorData.userId}_skill_${mentorData.skillId}:`, err.message);
  }
}

async function syncMentorEmbedding(userId, skillId) {
  try {
    const [rows] = await db.query(
      `SELECT 
          u.User_Id AS userId, u.First_Name AS firstName, u.Last_Name AS lastName, u.University AS university, u.Bio AS bio,
          s.Skill_Id AS skillId, s.Skill_Name AS skillName, s.Category AS category,
          us.Mentor_Level AS mentorLevel,
          COALESCE(ld.Average_Rating, 0.00) AS avgRating,
          COALESCE(ld.Total_Sessions, 0) AS totalSessions
       FROM User u
       JOIN User_Skill us ON us.User_Id = u.User_Id
       JOIN Skill s ON s.Skill_Id = us.Skill_Id
       LEFT JOIN Levelling_Data ld ON ld.Mentor_Id = u.User_Id AND ld.Skill_Id = us.Skill_Id
       WHERE u.User_Id = ? AND s.Skill_Id = ? AND us.Role = 'Mentor' AND (us.Verification_Status = 1 OR us.Verification_Status = 'Verified')`,
      [userId, skillId]
    );

    if (rows.length === 0) {
      console.log(`[Embed Mentor Sync] No verified mentor-skill profile found for User_Id=${userId}, Skill_Id=${skillId}. Skipping.`);
      return;
    }

    await upsertMentorEmbedding(rows[0]);
  } catch (err) {
    console.error(`[Embed Mentor Sync] Error syncing User_Id=${userId}, Skill_Id=${skillId}:`, err.message);
  }
}

function buildMentorText(m) {
  let technologies = [];
  try {
    if (Array.isArray(m.technologies)) {
      technologies = m.technologies;
    } else if (typeof m.technologies === 'string') {
      technologies = JSON.parse(m.technologies || '[]');
    }
  } catch (e) {
    technologies = [];
  }

  return `${m.firstName || ''} ${m.lastName || ''} is a ${m.mentorLevel || 'Bronze'} level mentor at ${m.university || 'university'} ` +
    `specializing in ${m.skillName || ''} (${m.category || ''}). ` +
    `Technologies: ${technologies.join(', ') || 'General'}. ` +
    `${m.bio || ''}`;
}

module.exports = { upsertMentorEmbedding, syncMentorEmbedding };
