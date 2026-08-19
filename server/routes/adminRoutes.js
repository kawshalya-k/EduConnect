const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');
const skillCtrl    = require('../controllers/skillVerificationController');
const adminAuth = require('../middleware/adminAuth');
const uploadAvatar = require('../utils/uploadAvatar');

// Public — Admin Login
router.post('/login', adminController.adminLogin);

// Protected — Dashboard
router.get('/stats', adminAuth, adminController.getDashboardStats);

// Protected — User Management
router.get('/users', adminAuth, adminController.getAllUsers);
router.get('/users/:userId', adminAuth, adminController.getUserById);
router.put('/users/:userId/status', adminAuth, adminController.updateUserStatus);
router.delete('/users/:userId', adminAuth, adminController.deleteUser);

// Protected — Session Management
router.get('/sessions', adminAuth, adminController.getAllSessions);
router.put('/sessions/:sessionId/status', adminAuth, adminController.updateSessionStatus);

// Protected — Analytics
router.get('/analytics', adminAuth, adminController.getAnalytics);

// Protected — Skill Management
router.get('/skills', adminAuth, adminController.getAllSkills);
router.post('/skills', adminAuth, adminController.addSkill);
router.delete('/skills/:skillId', adminAuth, adminController.deleteSkill);
router.get('/user-skills', adminAuth, adminController.getAllUserSkills);

// Admin Profile
router.get('/profile', adminAuth, adminController.getAdminProfile);
router.put('/profile', adminAuth, adminController.updateAdminProfile);
router.put('/profile/password', adminAuth, adminController.changeAdminPassword);
router.post('/profile/avatar', adminAuth, uploadAvatar.single('avatar'), adminController.uploadAdminAvatar);

// Mentor Management
router.get('/', skillCtrl.getPendingVerifications);          // GET all pending
router.patch('/:userSkillId/verify', skillCtrl.verifySkill);            // approve or reject

module.exports = router;

