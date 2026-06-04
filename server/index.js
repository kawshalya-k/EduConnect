require('dotenv').config();

const express = require('express');
<<<<<<< HEAD
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/authRoutes');
const sessionRoutes = require('./routes/sessionRoutes');
const adminRoutes = require('./routes/adminRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);

// Only start server after DB is ready
const db = require('./config/db');

async function startServer() {
  try {
    // Test DB connection first
    await db.query('SELECT 1');
    app.listen(5000, () => console.log('Server running on port 5000'));
  } catch (err) {
    console.error('Failed to start server:', err.message);
    setTimeout(startServer, 1000); // retry after 1 second
  }
}

startServer();
=======
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
>>>>>>> 6abd54809a55bdc43d6a38b3edf5a94ab30c6a87
