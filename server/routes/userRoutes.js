const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

router.get('/public/stats', userController.getPublicStats);
router.get('/debug/skills', userController.debugSkills);

router.get('/profile/skills/learning', auth, userController.getLearningSkills);
router.post('/profile/skills/learning', auth, userController.addLearningSkill);
router.delete('/profile/skills/learning/:skillId', auth, userController.removeLearningSkill);

router.get('/:id/profile', auth, userController.getProfile);
router.put('/:id/profile', auth, userController.updateProfile);
router.put('/:id/role', auth, userController.switchRole);

module.exports = router;
