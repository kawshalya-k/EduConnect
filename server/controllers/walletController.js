// server/controllers/walletController.js
const db = require('../config/db');

const getWalletBalance = async (req, res) => {
  try {
    const { userId } = req.params;
    const [user] = await db.query(
      'SELECT skill_coins FROM user WHERE User_Id = ?',
      [userId]
    );
    if (user.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, balance: user[0].skill_coins });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

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
      `SELECT Transaction_Id AS transaction_id,
              Transaction_Type AS type,
              Amount AS amount,
              Description AS reason,
              Timestamp AS created_at
       FROM Wallet_Transaction
       WHERE User_Id = ?
       ORDER BY Timestamp DESC
       LIMIT ? OFFSET ?`,
      [userId, limit, offset]
    );
    res.json({
      success: true, transactions, total: count[0].total, page,
      totalPages: Math.ceil(count[0].total / limit)
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const createTransaction = async (req, res) => {
  try {
    const { user_id, type, amount, reason } = req.body;
    const [user] = await db.query('SELECT skill_coins FROM user WHERE User_Id = ?', [user_id]);
    if (user.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const currentBalance = user[0].skill_coins || 0;
    if (type === 'DEBIT' && currentBalance < amount) {
      return res.status(400).json({ success: false, message: 'Insufficient coins', balance: currentBalance });
    }
    const newBalance = type === 'CREDIT' ? currentBalance + amount : currentBalance - amount;
    await db.query('UPDATE user SET skill_coins = ? WHERE User_Id = ?', [newBalance, user_id]);
    await db.query(
      `INSERT INTO Wallet_Transaction (User_Id, Transaction_Type, Amount, Description) VALUES (?, ?, ?, ?)`,
      [user_id, type, amount, reason]
    );
    res.json({ success: true, message: type === 'CREDIT' ? 'Coins credited!' : 'Coins deducted!', newBalance });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getWalletBalance, getTransactions, createTransaction };