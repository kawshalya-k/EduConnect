// server/routes/gamificationRoutes.js

const express = require('express');
const router  = express.Router();
const {
  getAllBadges,
  getUserBadges,
  getBadgeProgress,
  awardBadge,
  getLeaderboard,
} = require('../controllers/gamificationController');

// GET all badges
router.get('/badges', getAllBadges);

// GET badges for a specific user
router.get('/users/:id/badges', getUserBadges);
router.get('/users/:id/badges/progress', getBadgeProgress);

// POST award a badge to a user
router.post('/badges/award', awardBadge);

// GET leaderboard
router.get('/leaderboard', getLeaderboard);

module.exports = router;
