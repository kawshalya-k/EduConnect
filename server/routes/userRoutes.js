const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

router.get('/public/stats', userController.getPublicStats);

router.get('/:id/profile', auth, userController.getProfile);
router.put('/:id/profile', auth, userController.updateProfile);
router.put('/:id/role', auth, userController.switchRole);

module.exports = router;
