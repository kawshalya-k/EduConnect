const Session = require('../models/Session');
const db = require('../config/db');
const Notification = require('../models/Notification');

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

    // Notify mentor about new booking
    await Notification.createNotification(
      mentor_id,
      'New Session Request!',
      'You have a new session booking request. Please review and accept or reject it.',
      'session'
    );

    // Notify learner about booking confirmation
    await Notification.createNotification(
      learner_id,
      'Session Booked!',
      'Your session has been booked successfully. Waiting for mentor confirmation.',
      'session'
    );

    res.status(201).json({ message: 'Session booked successfully!', sessionId: result.insertId });

  } catch (err) {
    console.error('bookSession error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get my sessions
exports.getMySessions = async (req, res) => {
  try {
    const userId = req.user?.id || req.query.userId;
    if (!userId) return res.status(401).json({ message: 'User not authenticated' });

    const sessions = await Session.getSessionsByUser(userId);
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

    // Get session details for notifications
    const session = await Session.getSessionById(sessionId);

    // Send notifications based on status
    if (status === 'Scheduled') {
      await Notification.createNotification(
        session.Learner_Id,
        'Session Accepted! 🎉',
        'Your mentor has accepted your session request. Check your dashboard for details.',
        'session'
      );
    }

    if (status === 'Cancelled') {
      await Notification.createNotification(
        session.Learner_Id,
        'Session Cancelled',
        'Your session request has been cancelled by the mentor.',
        'session'
      );
    }

    if (status === 'Completed') {
      if (session) {
        await db.query(
          'UPDATE User SET Wallet_Balance = Wallet_Balance + ? WHERE User_Id = ?',
          [session.Reward || 10, session.Mentor_Id]
        );
        await db.query(
          'UPDATE User SET Wallet_Balance = Wallet_Balance - ? WHERE User_Id = ?',
          [session.Cost, session.Learner_Id]
        );

        // Notify both parties
        await Notification.createNotification(
          session.Mentor_Id,
          'Session Completed! 💰',
          `Great job! You earned ${session.Reward || 10} Skill Coins for completing the session.`,
          'payment'
        );
        await Notification.createNotification(
          session.Learner_Id,
          'Session Completed!',
          'Your session has been completed. Please leave a review for your mentor.',
          'session'
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

    try { new URL(meeting_link); } catch {
      return res.status(400).json({ message: 'Invalid meeting link URL' });
    }

    await Session.addMeetingLink(sessionId, meeting_link);

    // Notify learner about meeting link
    const session = await Session.getSessionById(sessionId);
    if (session) {
      await Notification.createNotification(
        session.Learner_Id,
        'Meeting Link Ready! 🔗',
        'Your mentor has added the meeting link. You can now join the session.',
        'session'
      );
    }

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

// Rate a session (Learner)
exports.rateSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { rating, feedback } = req.body;
    const learner_id = req.user.id;

    // Check if session exists and belongs to learner
    const session = await Session.getSessionById(sessionId);
    if (!session) return res.status(404).json({ message: 'Session not found' });
    if (session.Learner_Id !== learner_id) return res.status(403).json({ message: 'Unauthorized' });
    if (session.Status !== 'Completed') return res.status(400).json({ message: 'Can only rate completed sessions' });

    // Update session
    await db.query(
      'UPDATE Session SET Rating = ?, Feedback = ? WHERE Session_Id = ?',
      [rating, feedback, sessionId]
    );

    // Update mentor levelling data
    const [mentorLevels] = await db.query(
      'SELECT Record_Id, Total_Sessions, Average_Rating FROM Levelling_Data WHERE Mentor_Id = ? AND Skill_Id = ?',
      [session.Mentor_Id, session.Skill_Id]
    );

    if (mentorLevels.length > 0) {
      const current = mentorLevels[0];
      const newTotal = current.Total_Sessions + 1;
      const newAvg = ((Number(current.Average_Rating) * current.Total_Sessions) + rating) / newTotal;
      await db.query(
        'UPDATE Levelling_Data SET Average_Rating = ?, Total_Sessions = ? WHERE Record_Id = ?',
        [newAvg, newTotal, current.Record_Id]
      );
    } else {
      await db.query(
        'INSERT INTO Levelling_Data (Mentor_Id, Skill_Id, Average_Rating, Total_Sessions) VALUES (?, ?, ?, 1)',
        [session.Mentor_Id, session.Skill_Id, rating]
      );
    }

    res.status(200).json({ message: 'Session rated successfully' });
  } catch (err) {
    console.error('rateSession error:', err);
    res.status(500).json({ message: 'Server error rating session' });
  }
};