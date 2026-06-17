const express = require('express');
const router  = express.Router();

const searchCtrl = require('../controllers/mentorSearchController');

// All public — no auth needed for browsing mentors
router.get('/search',            searchCtrl.searchMentors);
router.get('/featured',          searchCtrl.getFeaturedMentors);
router.get('/skills/categories', searchCtrl.getCategories);

module.exports = router;