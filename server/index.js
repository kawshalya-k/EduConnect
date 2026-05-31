require('dotenv').config();

const express = require('express');
const cors    = require('cors');
const app     = express();

// ── Routes ──
const authRoutes         = require('./routes/authRoutes');
const sessionRoutes      = require('./routes/sessionRoutes');
const adminRoutes        = require('./routes/adminRoutes');
const gamificationRoutes = require('./routes/gamificationRoutes');
const walletRoutes       = require('./routes/walletRoutes');
const { startScheduler } = require('./utils/challengeScheduler');

// ── Middleware ──
app.use(cors());
app.use(express.json());

// ── API Routes ──
app.use('/api/auth',         authRoutes);
app.use('/api/sessions',     sessionRoutes);
app.use('/api/admin',        adminRoutes);
app.use('/api/gamification', gamificationRoutes);
app.use('/api/wallet',       walletRoutes);

// ── Weekly Challenge Scheduler ──
startScheduler();

app.listen(5000, () => console.log('Server running on port 5000'));