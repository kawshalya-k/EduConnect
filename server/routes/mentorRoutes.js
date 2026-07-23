const express = require('express');
const router = express.Router();
const db = require('../config/db');

const mentorController = require('../controllers/mentorController');
const profileCtrl = require('../controllers/userController');
const skillCtrl = require('../controllers/skillVerificationController');
const dashboardCtrl = require('../controllers/mentorDashboardController');
const upload = require('../utils/uploadProof');

const protect = require('../middleware/auth');
const auth = protect;

const isMentor = async (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: 'Not authenticated' });
    try {
        const [rows] = await db.query("SELECT Role FROM User WHERE User_Id = ?", [req.user.id]);
        if (rows.length === 0 || rows[0].Role !== 'Mentor') {
            return res.status(403).json({ message: 'Access denied. Mentors only.' });
        }
        next();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ── Public ────────────────────────────────────────────────────────────────────
router.get('/profile/:mentorId', mentorController.getPublicProfile);

// ── Auth-required (open to all logged-in users) ───────────────────────────────
router.get('/', auth, mentorController.getMentors);
router.post('/skills/verify', auth, upload.single('certificate'), mentorController.verifySkill);
router.post('/skills/start-quiz', auth, mentorController.startQuiz);
router.post('/skills/save-draft', auth, mentorController.saveOnboardingDraft);

// NEW: fetch the mentor's own draft/teaching skills so the UI can continue
router.get('/skills/draft', auth, mentorController.saveOnboardingDraft);

// ── Protected middleware for all routes below ─────────────────────────────────
router.use(protect);

router.get('/profile', profileCtrl.getProfile);
router.put('/profile/:id', profileCtrl.updateProfile);

router.get('/skills/all', skillCtrl.getAllSkills);
router.get('/skills/my', skillCtrl.getMySkills);
router.post('/skills/add', upload.single('certificate'), skillCtrl.addSkill);
router.delete('/skills/:userSkillId', skillCtrl.removeSkill);

// ── Mentor-only ───────────────────────────────────────────────────────────────
router.get('/dashboard', isMentor, dashboardCtrl.getDashboard);
router.get('/dashboard/earnings', isMentor, dashboardCtrl.getEarnings);
router.get('/dashboard/reviews', isMentor, dashboardCtrl.getReviews);

module.exports = router;