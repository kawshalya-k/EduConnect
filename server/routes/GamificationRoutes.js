// server/routes/gamificationRoutes.js

const express = require('express');
const router  = express.Router();
const {
  getAllBadges,
  getUserBadges,
  awardBadge,
  getLeaderboard,
} = require('../controllers/gamificationController');

// GET all badges
router.get('/badges', getAllBadges);

// GET badges for a specific user
router.get('/users/:id/badges', getUserBadges);

// POST award a badge to a user
router.post('/badges/award', awardBadge);

// GET leaderboard
router.get('/leaderboard', getLeaderboard);

module.exports = router;
