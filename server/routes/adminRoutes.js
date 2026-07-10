const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');
const skillCtrl    = require('../controllers/skillVerificationController');

// Dashboard
router.get('/stats', auth, adminController.getDashboardStats);

// User Management
router.get('/users', auth, adminController.getAllUsers);
router.get('/users/:userId', auth, adminController.getUserById);
router.put('/users/:userId/status', auth, adminController.updateUserStatus);
router.delete('/users/:userId', auth, adminController.deleteUser);

// Session Management
router.get('/sessions', auth, adminController.getAllSessions);
router.put('/sessions/:sessionId/status', auth, adminController.updateSessionStatus);

// Analytics
router.get('/analytics', auth, adminController.getAnalytics);

// Skill Management
router.get('/skills', auth, adminController.getAllSkills);
router.post('/skills', auth, adminController.addSkill);
router.delete('/skills/:skillId', auth, adminController.deleteSkill);
router.get('/user-skills', auth, adminController.getAllUserSkills);

// Mentor Management
router.get('/', skillCtrl.getPendingVerifications);          // GET all pending
router.patch('/:userSkillId/verify', skillCtrl.verifySkill);            // approve or reject

module.exports = router;
