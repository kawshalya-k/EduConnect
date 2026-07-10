const express = require('express');
const router  = express.Router();
const searchCtrl = require('../controllers/mentorSearchController');
const protect = require('../middleware/auth');

// Public - no auth needed for general discovery
router.get('/search',            searchCtrl.searchMentors);
router.get('/ai-search',         searchCtrl.aiSearchMentors);
router.get('/featured',          searchCtrl.getFeaturedMentors);
router.get('/skills/categories', searchCtrl.getCategories);

// Protected - learner only recommendation API
router.get('/recommended',       protect, searchCtrl.getRecommendedMentors);

module.exports = router;