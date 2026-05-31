// server/index.js

const express = require('express');
const app = express();
const authRoutes         = require('./routes/authRoutes');
const gamificationRoutes = require('./routes/gamificationRoutes');
const walletRoutes       = require('./routes/walletRoutes');
const { startScheduler } = require('./utils/challengeScheduler');

app.use(express.json());

// Existing routes
app.use('/api/auth', authRoutes);

// Your new routes
app.use('/api/gamification', gamificationRoutes);
app.use('/api/wallet',       walletRoutes);

// Start weekly challenge scheduler
startScheduler();

app.listen(5000, () => console.log("Server running on port 5000"));
