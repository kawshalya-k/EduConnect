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

module.exports = { embedText };
