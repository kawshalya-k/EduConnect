const Session = require('../models/Session');
const db = require('../config/db');
const Notification = require('../models/Notification');
const levelingController = require('./levelingController');
const { syncMentorEmbedding } = require('../utils/embedMentor');
const gamificationController = require('./gamificationController');

// Book a session (Learner)
exports.bookSession = async (req, res) => {
  console.log('BOOKING REQUEST RECEIVED:', req.body);
  try {
    const { skill_id, mentor_id, session_type, date, time, duration, cost } = req.body;
    const learner_id = req.user.id;

    // Check wallet balance (check skill_coins as primary, fallback to Wallet_Balance)
    const [rows] = await db.query(
      'SELECT Wallet_Balance, skill_coins FROM User WHERE User_Id = ?', [learner_id]
    );

    if (!rows.length) return res.status(404).json({ message: 'User not found' });
    const userCoins = rows[0].skill_coins !== null ? rows[0].skill_coins : rows[0].Wallet_Balance;
    if (userCoins < cost) {
      return res.status(400).json({ message: 'Insufficient Skill Coins' });
    }

    // Create the session
    const result = await Session.createSession({
      skill_id, learner_id, mentor_id,
      session_type, date, time, duration, cost
    });
    const sessionId = result.insertId;

    // Deduct coins from learner's wallet (keep skill_coins and Wallet_Balance synchronized)
    const newBalance = userCoins - cost;
    await db.query(
      'UPDATE User SET skill_coins = ?, Wallet_Balance = ? WHERE User_Id = ?',
      [newBalance, newBalance, learner_id]
    );

    // Record transaction
    await db.query(
      `INSERT INTO Wallet_Transaction 
       (User_Id, Transaction_Type, Amount, Description) 
       VALUES (?, 'DEBIT', ?, ?)`,
      [learner_id, cost, `Booked session ${sessionId}`]
    );

    // Get mentor details for notification
    const [mentorRows] = await db.query(
      'SELECT First_Name, Last_Name FROM User WHERE User_Id = ?', [mentor_id]
    );
    const mentorName = mentorRows.length > 0 ? `${mentorRows[0].First_Name} ${mentorRows[0].Last_Name}` : 'Mentor';

    // Notify mentor about new booking
    await Notification.createNotification(
      mentor_id,
      'New Session Request!',
      `You have a new session booking request on ${date} at ${time}. Please review and accept or reject it.`,
      'session'
    );

    // Notify learner about booking confirmation
    await Notification.createNotification(
      learner_id,
      'Session Booked!',
      `Your session has been booked successfully with ${mentorName}. Waiting for mentor confirmation.`,
      'session'
    );

    // Award +10 XP booking bonus notification
    await Notification.createNotification(
      learner_id,
      'Booking Bonus! 🏆',
      'You earned +10 XP booking bonus for scheduling this session!',
      'gamification'
    );

    res.status(201).json({ 
      message: 'Session booked successfully!', 
      sessionId,
      newBalance
    });

  } catch (err) {
    console.error('FULL BOOKING ERROR:', err);
    res.status(500).json({ message: err.message });
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
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    await Session.updateSessionStatus(sessionId, status);

    // Get session details for notifications & transactions
    const session = await Session.getSessionById(sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    if (status === 'Scheduled') {
      await Notification.createNotification(
        session.Learner_Id,
        'Session Accepted! 🎉',
        'Your mentor has accepted your session request. Check your dashboard for details.',
        'session'
      );
    }

    if (status === 'Cancelled') {
      // Refund the learner
      const [learner] = await db.query(
        'SELECT Wallet_Balance, skill_coins FROM User WHERE User_Id = ?', [session.Learner_Id]
      );
      if (learner.length > 0) {
        const currentCoins = learner[0].skill_coins !== null ? learner[0].skill_coins : learner[0].Wallet_Balance;
        const refundedBalance = currentCoins + session.Cost;
        await db.query(
          'UPDATE User SET skill_coins = ?, Wallet_Balance = ? WHERE User_Id = ?',
          [refundedBalance, refundedBalance, session.Learner_Id]
        );

        // Record transaction
        await db.query(
          `INSERT INTO Wallet_Transaction 
           (User_Id, Transaction_Type, Amount, Description) 
           VALUES (?, 'CREDIT', ?, ?)`,
          [session.Learner_Id, session.Cost, `Refund for cancelled session ${sessionId}`]
        );
      }

      await Notification.createNotification(
        session.Learner_Id,
        'Session Cancelled',
        'Your session request has been cancelled by the mentor. Your coins have been refunded.',
        'session'
      );
    }

    if (status === 'Completed') {
      // Credit mentor
      const mentorCredit = session.Reward || session.Cost || 10;
      const [mentor] = await db.query(
        'SELECT Wallet_Balance, skill_coins FROM User WHERE User_Id = ?', [session.Mentor_Id]
      );
      if (mentor.length > 0) {
        const currentCoins = mentor[0].skill_coins !== null ? mentor[0].skill_coins : mentor[0].Wallet_Balance;
        const newBalance = currentCoins + mentorCredit;
        await db.query(
          'UPDATE User SET skill_coins = ?, Wallet_Balance = ? WHERE User_Id = ?',
          [newBalance, newBalance, session.Mentor_Id]
        );

        // Record transaction
        await db.query(
          `INSERT INTO Wallet_Transaction 
           (User_Id, Transaction_Type, Amount, Description) 
           VALUES (?, 'CREDIT', ?, ?)`,
          [session.Mentor_Id, mentorCredit, `Earnings for completed session ${sessionId}`]
        );
      }

      // Check and award badges automatically for mentor
      await gamificationController.checkAndAwardBadges(session.Mentor_Id);

      // Notify both parties
      await Notification.createNotification(
        session.Mentor_Id,
        'Session Completed! 💰',
        `Great job! You earned ${mentorCredit} Skill Coins for completing the session.`,
        'payment'
      );
      await Notification.createNotification(
        session.Learner_Id,
        'Session Completed!',
        'Your session has been completed. Please leave a review for your mentor.',
        'session'
      );
    }

    res.status(200).json({ message: `Session marked as ${status}!` });

  } catch (err) {
    console.error('updateStatus error:', err);
    res.status(500).json({ message: 'Error updating status' });
  }
};

// Add meeting link (Mentor or Learner)
exports.addMeetingLink = async (req, res) => {
  try {
    const { sessionId } = req.params;
    let { meeting_link } = req.body;

    if (!meeting_link) {
      return res.status(400).json({ message: 'Meeting link is required' });
    }

    meeting_link = meeting_link.trim();
    if (meeting_link && !/^https?:\/\//i.test(meeting_link)) {
      meeting_link = 'https://' + meeting_link;
    }

    try { new URL(meeting_link); } catch {
      return res.status(400).json({ message: 'Invalid meeting link URL' });
    }

    await Session.addMeetingLink(sessionId, meeting_link);

    const session = await Session.getSessionById(sessionId);
    if (session) {
      // Determine other party to notify
      const currentUserId = req.user.id;
      const isCurrentLearner = Number(currentUserId) === Number(session.Learner_Id);
      const recipientId = isCurrentLearner ? session.Mentor_Id : session.Learner_Id;
      const roleName = isCurrentLearner ? 'learner' : 'mentor';
      const notificationMessage = isCurrentLearner
        ? 'The learner has updated the meeting link. You can now join the session.'
        : 'Your mentor has added the meeting link. You can now join the session.';

      await Notification.createNotification(
        recipientId,
        'Meeting Link Ready! 🔗',
        notificationMessage,
        'session'
      );
    }

    res.status(200).json({ message: 'Meeting link added successfully!', meeting_link });

  } catch (err) {
    console.error('addMeetingLink error:', err);
    res.status(500).json({ message: err.message });
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

// Rate/Review a session (Learner)
exports.rateSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { rating, feedback } = req.body;
    const learner_id = req.user.id;

    // Check if session exists and belongs to learner
    const session = await Session.getSessionById(sessionId);
    if (!session) return res.status(404).json({ message: 'Session not found' });
    if (Number(session.Learner_Id) !== Number(learner_id)) return res.status(403).json({ message: 'Unauthorized' });
    if (session.Status !== 'Completed') return res.status(400).json({ message: 'Can only rate completed sessions' });

    // Update session
    await db.query(
      'UPDATE Session SET Rating = ?, Feedback = ? WHERE Session_Id = ?',
      [rating, feedback, sessionId]
    );

    // Retrieve current leveling data
    const [mentorLevels] = await db.query(
      'SELECT Record_Id, Total_Sessions, Average_Rating FROM Levelling_Data WHERE Mentor_Id = ? AND Skill_Id = ?',
      [session.Mentor_Id, session.Skill_Id]
    );

    let newAvg = rating;
    let newTotal = 1;
    let recordId = null;

    if (mentorLevels.length > 0) {
      const current = mentorLevels[0];
      recordId = current.Record_Id;
      newTotal = current.Total_Sessions + 1;
      newAvg = ((Number(current.Average_Rating) * current.Total_Sessions) + rating) / newTotal;
    }

    // Repeat sessions count
    const [repeatRows] = await db.query(
      `SELECT COUNT(*) as repeatCount FROM (
         SELECT Learner_Id FROM Session 
         WHERE Mentor_Id = ? AND Skill_Id = ? AND Status = "Completed"
         GROUP BY Learner_Id HAVING COUNT(Session_Id) > 1
       ) as temp`,
      [session.Mentor_Id, session.Skill_Id]
    );
    const repeatSessions = repeatRows[0].repeatCount || 0;

    // Evaluate mentor leveling
    const evaluation = levelingController.evaluateMentorLevel({
      sessionsCompleted: newTotal,
      avgRating: newAvg,
      repeatSessions,
      onTimeRate: 100 // default punctuality
    });

    if (recordId) {
      await db.query(
        `UPDATE Levelling_Data 
         SET Average_Rating = ?, Total_Sessions = ?, Score = ?, Mentor_Level = ?, Last_Evaluation_Date = NOW() 
         WHERE Record_Id = ?`,
        [newAvg, newTotal, evaluation.score, evaluation.level, recordId]
      );
    } else {
      const [insertRes] = await db.query(
        `INSERT INTO Levelling_Data (Mentor_Id, Skill_Id, Average_Rating, Total_Sessions, Score, Mentor_Level, Last_Evaluation_Date) 
         VALUES (?, ?, ?, ?, ?, ?, NOW())`,
        [session.Mentor_Id, session.Skill_Id, newAvg, newTotal, evaluation.score, evaluation.level]
      );
    }

    // Sync to User_Skill table
    await db.query(
      `UPDATE User_Skill 
       SET Mentor_Level = ? 
       WHERE User_Id = ? AND Skill_Id = ?`,
      [evaluation.level, session.Mentor_Id, session.Skill_Id]
    );

    // Sync Pinecone Embedding in real-time
    await syncMentorEmbedding(session.Mentor_Id, session.Skill_Id);

    res.status(200).json({ 
      message: 'Session rated successfully',
      score: evaluation.score,
      level: evaluation.level
    });
  } catch (err) {
    console.error('rateSession error:', err);
    res.status(500).json({ message: 'Server error rating session' });
  }
};

// Synonym for rateSession to support reviews endpoint
exports.submitReview = exports.rateSession;

// Get availability for a mentor on a specific date
exports.getAvailability = async (req, res) => {
  try {
    const { mentorId } = req.params;
    const { date } = req.query; // Format YYYY-MM-DD

    if (!date) {
      return res.status(400).json({ message: 'Date parameter is required' });
    }

    // Query booked sessions that are active
    const [bookedSessions] = await db.query(
      `SELECT Time FROM Session 
       WHERE Mentor_Id = ? AND Date = ? AND Status IN ('Pending', 'Scheduled', 'In-Session')`,
      [mentorId, date]
    );

    const bookedTimes = bookedSessions.map(s => s.Time);

    const standardSlots = [
      { label: "10:00 AM - 11:00 AM", value: "10:00:00" },
      { label: "11:00 AM - 12:00 PM", value: "11:00:00" },
      { label: "01:00 PM - 02:00 PM", value: "13:00:00" },
      { label: "02:00 PM - 03:00 PM", value: "14:00:00" },
      { label: "04:00 PM - 05:00 PM", value: "16:00:00" },
    ];

    const slots = standardSlots.map(slot => {
      const isBooked = bookedTimes.some(t => t.startsWith(slot.value.substring(0, 5)));
      return {
        ...slot,
        available: !isBooked
      };
    });

    res.status(200).json({ slots });
  } catch (err) {
    console.error('getAvailability error:', err);
    res.status(500).json({ message: 'Error checking availability' });
  }
};
