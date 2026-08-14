const { GoogleGenerativeAI } = require('@google/generative-ai');

const genai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'mock-key');

async function embedText(text) {
  // If not configured, throw a warning/error or provide a placeholder for testing
  if (!process.env.GEMINI_API_KEY) {
    console.warn('[Gemini Config] GEMINI_API_KEY is not set. Returning a mock 768-dim float array.');
    return Array.from({ length: 768 }, () => Math.random());
  }
  const model = genai.getGenerativeModel({ model: 'text-embedding-004' });
  const result = await model.embedContent(text);
  return result.embedding.values; // float array of 768 dims
}

async function recommendMentorsAI(wishlist, mentorsList) {
  if (!process.env.GEMINI_API_KEY) {
    console.warn('[Gemini Config] GEMINI_API_KEY is not set. Cannot run generative recommendations.');
    return null;
  }
  
  try {
    const model = genai.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const prompt = `
You are an AI recommendation engine for EduConnect, a peer-to-peer university mentoring platform.
Your task is to recommend the best mentors for a learner based on their wishlist of skills they want to learn.

Learner Wishlist (Skills to learn):
${JSON.stringify(wishlist, null, 2)}

Available Mentors:
${JSON.stringify(mentorsList, null, 2)}

Instructions:
1. Analyze the learner's wishlist and match them with mentors who have verified skills matching the wishlist.
2. Rank the mentors such that verified mentors teaching skills on the learner's wishlist are shown first. Then, rank other verified mentors who teach other skills. If no verified mentor is available, return an empty array under "recommended_ids".
3. Return ONLY a JSON object containing an array of recommended mentor user IDs under the key "recommended_ids".
4. Do NOT include any markdown code blocks, explanation, or conversational text. Return raw JSON text.

Example response:
{
  "recommended_ids": [10, 12, 15, 3]
}
`;

    const response = await model.generateContent(prompt);
    const text = response.response.text();
    
    // clean markdown JSON wrappers if any
    const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const data = JSON.parse(jsonStr);
    return data.recommended_ids;
  } catch (err) {
    console.error('[AI Recommendation] Failed to generate/parse recommendations via Gemini:', err.message);
    return null;
  }
}

module.exports = { embedText, recommendMentorsAI };
