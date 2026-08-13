const { getLeaderboard } = require('./controllers/gamificationController');
const { searchMentors } = require('./controllers/mentorSearchController');

const mockRes = {
  status: function(code) {
    this.statusCode = code;
    return this;
  },
  json: function(data) {
    this.body = data;
    return this;
  },
  set: function(name, val) {
    this[name] = val;
  }
};

async function runTests() {
  console.log('--- Testing getLeaderboard controller ---');
  const leaderboardReq = { query: {} };
  const leaderboardRes = Object.create(mockRes);
  await getLeaderboard(leaderboardReq, leaderboardRes);
  console.log('Leaderboard Response success:', leaderboardRes.body?.success, 'Mentors count:', leaderboardRes.body?.mentors?.length);

  console.log('\n--- Testing searchMentors with level: GOLD,SILVER (frontend default filter) ---');
  const searchReq1 = { query: { levels: 'GOLD,SILVER' } };
  const searchRes1 = Object.create(mockRes);
  await searchMentors(searchReq1, searchRes1);
  console.log('Search Res 1 - Mentors count:', searchRes1.body?.mentors?.length);

  console.log('\n--- Testing searchMentors with levels: Expert ---');
  const searchReq2 = { query: { levels: 'Expert' } };
  const searchRes2 = Object.create(mockRes);
  await searchMentors(searchReq2, searchRes2);
  console.log('Search Res 2 - Mentors count:', searchRes2.body?.mentors?.length, 'Mentors:', JSON.stringify(searchRes2.body?.mentors, null, 2));

  console.log('\n--- Testing searchMentors with no level filters ---');
  const searchReq3 = { query: {} };
  const searchRes3 = Object.create(mockRes);
  await searchMentors(searchReq3, searchRes3);
  console.log('Search Res 3 - Mentors count:', searchRes3.body?.mentors?.length, 'Mentors:', JSON.stringify(searchRes3.body?.mentors, null, 2));
}

runTests();
