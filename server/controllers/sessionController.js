const Session = require('../models/Session');
const db = require('../config/db');

// Book a session (Learner)
exports.bookSession = async (req, res) => {
  try {
    const { skill_id, mentor_id, session_type, date, time, duration, cost } = req.body;
    const learner_id = req.user.id;

    // Check wallet balance
    const [rows] = await db.query(
      'SELECT Wallet_Balance FROM User WHERE User_Id = ?', [learner_id]
    );

    if (!rows.length) return res.status(404).json({ message: 'User not found' });
    if (rows[0].Wallet_Balance < cost)
      return res.status(400).json({ message: 'Insufficient Skill Coins' });

    const result = await Session.createSession({
      skill_id, learner_id, mentor_id,
      session_type, date, time, duration, cost
    });

    res.status(201).json({ message: 'Session booked successfully!', sessionId: result.insertId });

  } catch (err) {
    console.error('bookSession error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get my sessions
exports.getMySessions = async (req, res) => {
  try {
    const sessions = await Session.getSessionsByUser(req.user.id);
    res.status(200).json(sessions);
  } catch (err) {
    console.error('getMySessions error:', err);
    res.status(500).json({ message: 'Error fetching sessions' });
  }
};

// Update session status (Mentor accepts/rejects)
exports.updateStatus = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { status } = req.body;

    const allowed = ['Scheduled', 'Cancelled', 'Completed', 'In-Session'];
    if (!allowed.includes(status))
      return res.status(400).json({ message: 'Invalid status value' });

    await Session.updateSessionStatus(sessionId, status);

    // If completed — reward mentor, deduct from learner
    if (status === 'Completed') {
      const session = await Session.getSessionById(sessionId);
      if (session) {
        await db.query(
          'UPDATE User SET Wallet_Balance = Wallet_Balance + ? WHERE User_Id = ?',
          [session.Reward || 10, session.Mentor_Id]
        );
        await db.query(
          'UPDATE User SET Wallet_Balance = Wallet_Balance - ? WHERE User_Id = ?',
          [session.Cost, session.Learner_Id]
        );
      }
    }

    res.status(200).json({ message: `Session marked as ${status}!` });

  } catch (err) {
    console.error('updateStatus error:', err);
    res.status(500).json({ message: 'Error updating status' });
  }
};

// Add meeting link (Mentor)
exports.addMeetingLink = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { meeting_link } = req.body;

    // Validate URL
    try { new URL(meeting_link); } catch {
      return res.status(400).json({ message: 'Invalid meeting link URL' });
    }

    await Session.addMeetingLink(sessionId, meeting_link);
    res.status(200).json({ message: 'Meeting link added successfully!' });

  } catch (err) {
    console.error('addMeetingLink error:', err);
    res.status(500).json({ message: 'Error adding meeting link' });
  }
};

// Get single session
exports.getSessionById = async (req, res) => {
  try {
    const session = await Session.getSessionById(req.params.sessionId);
    if (!session) return res.status(404).json({ message: 'Session not found' });
    res.status(200).json(session);
  } catch (err) {
    console.error('getSessionById error:', err);
    res.status(500).json({ message: 'Error fetching session' });
  }
};