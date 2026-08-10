// server/controllers/walletController.js

const db = require('../config/db');

// ─────────────────────────────────────────
// TASK 18: GET wallet balance
// GET /api/wallet/:userId
// ─────────────────────────────────────────
const getWalletBalance = async (req, res) => {
  try {
    const { userId } = req.params;

      const [user] = await db.query(
        'SELECT skill_coins FROM `User` WHERE User_Id = ?',
        [userId]
      );

    if (user.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      balance: user[0].skill_coins
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─────────────────────────────────────────
// TASK 20: GET transaction history
// GET /api/wallet/:userId/transactions
// ─────────────────────────────────────────
const getTransactions = async (req, res) => {
  try {
    const { userId } = req.params;
    const page   = parseInt(req.query.page)  || 1;
    const limit  = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const [count] = await db.query(
      'SELECT COUNT(*) as total FROM Wallet_Transaction WHERE User_Id = ?',
      [userId]
    );

    const [transactions] = await db.query(
      `SELECT * FROM Wallet_Transaction 
       WHERE User_Id = ? 
       ORDER BY created_at DESC 
       LIMIT ? OFFSET ?`,
      [userId, limit, offset]
    );

    const mapped = transactions.map(t => ({
      transaction_id: t.transaction_id,
      user_id: t.user_id,
      type: t.type,
      amount: t.amount,
      created_at: t.created_at,
      reason: t.reason
    }));

    res.json({
      success: true,
      transactions: mapped,
      total: count[0].total,
      page,
      totalPages: Math.ceil(count[0].total / limit)
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─────────────────────────────────────────
// TASK 19: POST create a transaction
// POST /api/wallet/transact
// ─────────────────────────────────────────
const createTransaction = async (req, res) => {
  try {
    const { user_id, type, amount, reason, session_id } = req.body;

    const [user] = await db.query(
      'SELECT skill_coins FROM User WHERE User_Id = ?',
      [user_id]
    );

    if (user.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const currentBalance = user[0].skill_coins || 0;

    // Check if enough coins for debit
    if (type === 'DEBIT' && currentBalance < amount) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient coins',
        balance: currentBalance
      });
    }

    const newBalance = type === 'CREDIT'
      ? currentBalance + amount
      : currentBalance - amount;

    await db.query(
      'UPDATE User SET skill_coins = ? WHERE User_Id = ?',
      [newBalance, user_id]
    );

    await db.query(
      `INSERT INTO Wallet_Transaction 
       (user_id, type, amount, reason, session_id, running_balance)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [user_id, type, amount, reason, session_id || null, newBalance]
    );

    res.json({
      success: true,
      message: type === 'CREDIT' ? 'Coins credited!' : 'Coins deducted!',
      newBalance
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─────────────────────────────────────────
// TASK 21: Hook — deduct coins on booking
// ─────────────────────────────────────────
const deductCoinsOnBooking = async (user_id, session_id, mentor_name, skill) => {
  try {
    const [config] = await db.query(
      'SELECT config_value FROM Coin_Config WHERE config_key = "SESSION_BOOKING_COST"'
    );
    const cost = config[0].config_value;

    const [user] = await db.query(
      'SELECT skill_coins FROM User WHERE User_Id = ?',
      [user_id]
    );

    const currentBalance = user[0].skill_coins || 0;

    if (currentBalance < cost) {
      throw new Error('Insufficient coins to book session');
    }

    const newBalance = currentBalance - cost;

    await db.query(
      'UPDATE User SET skill_coins = ? WHERE User_Id = ?',
      [newBalance, user_id]
    );

    await db.query(
      `INSERT INTO Wallet_Transaction 
       (user_id, type, amount, reason, session_id, running_balance)
       VALUES (?, 'DEBIT', ?, ?, ?, ?)`,
      [user_id, cost, `Booked session: ${skill} with ${mentor_name}`, session_id, newBalance]
    );

    return { success: true, newBalance, cost };
  } catch (err) {
    throw new Error(err.message);
  }
};

// ─────────────────────────────────────────
// TASK 22: Hook — credit coins on session complete
// ─────────────────────────────────────────
const creditCoinsOnSessionComplete = async (mentor_id, session_id, learner_name, skill) => {
  try {
    const [config] = await db.query(
      'SELECT config_value FROM Coin_Config WHERE config_key = "SESSION_COMPLETE_REWARD"'
    );
    const reward = config[0].config_value;

    const [mentor] = await db.query(
      'SELECT skill_coins FROM User WHERE User_Id = ?',
      [mentor_id]
    );

    const currentBalance = mentor[0].skill_coins || 0;
    const newBalance = currentBalance + reward;

    await db.query(
      'UPDATE User SET skill_coins = ? WHERE User_Id = ?',
      [newBalance, mentor_id]
    );

    await db.query(
      `INSERT INTO Wallet_Transaction 
       (user_id, type, amount, reason, session_id, running_balance)
       VALUES (?, 'CREDIT', ?, ?, ?, ?)`,
      [mentor_id, reward, `Session completed: ${skill} with ${learner_name}`, session_id, newBalance]
    );

    return { success: true, newBalance, reward };
  } catch (err) {
    throw new Error(err.message);
  }
};

// ─────────────────────────────────────────
// TASK 23: Hook — credit coins on verification
// ─────────────────────────────────────────
const creditCoinsOnVerification = async (user_id, skill_name) => {
  try {
    const [config] = await db.query(
      'SELECT config_value FROM Coin_Config WHERE config_key = "SKILL_VERIFY_REWARD"'
    );
    const reward = config[0].config_value;

    const [user] = await db.query(
      'SELECT skill_coins FROM User WHERE User_Id = ?',
      [user_id]
    );

    const currentBalance = user[0].skill_coins || 0;
    const newBalance = currentBalance + reward;

    await db.query(
      'UPDATE User SET skill_coins = ? WHERE User_Id = ?',
      [newBalance, user_id]
    );

    await db.query(
      `INSERT INTO Wallet_Transaction 
       (user_id, type, amount, reason, running_balance)
       VALUES (?, 'CREDIT', ?, ?, ?)`,
      [user_id, reward, `Skill verified: ${skill_name}`, newBalance]
    );

    return { success: true, newBalance, reward };
  } catch (err) {
    throw new Error(err.message);
  }
};

module.exports = {
  getWalletBalance,
  getTransactions,
  createTransaction,
  deductCoinsOnBooking,
  creditCoinsOnSessionComplete,
  creditCoinsOnVerification,
};
