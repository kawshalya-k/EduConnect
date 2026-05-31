// server/routes/walletRoutes.js

const express = require('express');
const router  = express.Router();
const {
  getWalletBalance,
  getTransactions,
  createTransaction,
} = require('../controllers/walletController');

// GET wallet balance
router.get('/:userId', getWalletBalance);

// GET transaction history
router.get('/:userId/transactions', getTransactions);

// POST create a transaction
router.post('/transact', createTransaction);

module.exports = router;
