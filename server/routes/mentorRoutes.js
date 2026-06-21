const express = require('express');
const router = express.Router();

const mentorController = require('../controllers/mentorController');
const profileCtrl = require('../controllers/userController');
const skillCtrl = require('../controllers/skillVerificationController');
const dashboardCtrl = require('../controllers/mentorDashboardController');
const upload = require('../utils/uploadProof');
const mentorLevel = require('../controllers/levelingController');

const protect = require('../middleware/auth');

const auth = protect;

const isMentor = (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "Not authenticated" });
    if (req.user.role !== 'Mentor') return res.status(403).json({ message: "Access denied. Mentors only." });
    next();
};

router.get('/', auth, mentorController.getMentors);
router.post('/skills/verify', auth, upload.single('certificate'), mentorController.verifySkill);

// Public
router.get('/profile/:mentorId', mentorController.getPublicProfile);

// Protected
router.use(protect);

router.get('/profile', profileCtrl.getProfile);        
router.put('/profile/:id', profileCtrl.updateProfile); 

router.get('/skills/all', skillCtrl.getAllSkills);
router.get('/skills/my', skillCtrl.getMySkills);
router.post('/skills/add', upload.single('certificate'), skillCtrl.addSkill);
router.delete('/skills/:userSkillId', skillCtrl.removeSkill);

// Mentor-only
router.get('/dashboard', isMentor, dashboardCtrl.getDashboard);
router.get('/dashboard/earnings', isMentor, dashboardCtrl.getEarnings);
router.get('/dashboard/reviews', isMentor, dashboardCtrl.getReviews);

module.exports = router;