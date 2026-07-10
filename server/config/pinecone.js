const { Pinecone } = require('@pinecone-database/pinecone');

let index = null;

if (process.env.PINECONE_API_KEY) {
  try {
    const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
    index = pc.index(process.env.PINECONE_INDEX || 'educonnect-mentors');
  } catch (err) {
    console.error('[Pinecone Config] Failed to initialize Pinecone client:', err.message);
  }
}

if (!index) {
  console.warn('[Pinecone Config] PINECONE_API_KEY is not set. Pinecone vector operations will operate in mock/fallback mode.');
  // Return a mock object containing matches and placeholder functions to avoid crashes
  index = {
    upsert: async (vectors) => {
      console.log('[Pinecone Mock] Upserted vectors:', vectors.map(v => v.id));
      return { upsertedCount: vectors.length };
    },
    query: async (params) => {
      console.log('[Pinecone Mock] Queried index with parameters:', params);
      return { matches: [] };
    },
    deleteMany: async (params) => {
      console.log('[Pinecone Mock] Deleted vectors:', params);
      return {};
    }
  };
}

module.exports = index;
