const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');
const auth = require('../middleware/auth');

router.post('/book', auth, sessionController.bookSession);
router.get('/my', auth, sessionController.getMySessions);
router.put('/:sessionId/status', auth, sessionController.updateStatus);
router.put('/:sessionId/meeting-link', auth, sessionController.addMeetingLink);
router.get('/:sessionId', auth, sessionController.getSessionById);
router.post('/:sessionId/rate', auth, sessionController.rateSession);

module.exports = router;