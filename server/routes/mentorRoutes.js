const express = require('express');
const router = express.Router();
const mentorController = require('../controllers/mentorController');

// It's a public/semi-public route, might or might not need auth depending on the app's requirements. We'll add auth middleware just in case.
const auth = require('../middleware/auth');

router.get('/', auth, mentorController.getMentors);

module.exports = router;
