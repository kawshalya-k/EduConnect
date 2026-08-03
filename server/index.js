const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const express = require('express');
const cors = require('cors');
const app = express();

// ── Middleware ──
app.use(cors());
app.use(express.json());

// ── Routes ──
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const mentorRoutes = require('./routes/mentorRoutes');
const sessionRoutes = require('./routes/sessionRoutes');
const adminRoutes = require('./routes/adminRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const gamificationRoutes = require('./routes/GamificationRoutes');
const walletRoutes = require('./routes/WalletRoutes');
const { startScheduler } = require('./utils/challengeScheduler');
const mentorSearchRoutes = require('./routes/mentorSearchRoutes');

// ── API Routes ──
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/mentors', mentorSearchRoutes);
app.use('/api/mentors', mentorRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/gamification', gamificationRoutes);
app.use('/api/wallet', walletRoutes);

// Health check
app.get('/health', (req, res) => res.json({ ok: true }));

// Suggested skills endpoint
app.get('/api/skills/suggested', async (req, res) => {
  try {
    const db = require('./config/db');
    const [rows] = await db.query('SELECT Skill_Name FROM Skill LIMIT 6');
    const skills = rows.map(r => r.Skill_Name);
    res.json({ skills: skills.length > 0 ? skills : ['TypeScript', 'Node.js', 'Figma', 'SQL'] });
  } catch (err) {
    console.error('Suggested skills fetch error:', err);
    res.json({ skills: ['TypeScript', 'Node.js', 'Figma', 'SQL'] });
  }
});

// Dev-only: issue JWT for local testing (not for production)
const jwt = require('jsonwebtoken');
app.post('/dev/token', (req, res) => {
  if (process.env.NODE_ENV === 'production') return res.status(404).json({ message: 'Not found' });
  const { userId } = req.body || {};
  if (!userId) return res.status(400).json({ message: 'userId required' });
  const token = jwt.sign({ id: Number(userId), role: 'Mentor' }, process.env.JWT_SECRET || 'dev-secret');
  res.json({ token });
});

// Debug route to list registered routes
app.get('/_routes', (req, res) => {
  const routes = [];
  app._router.stack.forEach((middleware) => {
    if (middleware.route) {
      // routes registered directly on the app
      routes.push(middleware.route.path);
    } else if (middleware.name === 'router') {
      middleware.handle.stack.forEach((handler) => {
        const route = handler.route && handler.route.path;
        if (route) routes.push(route);
      });
    }
  });
  res.json({ routes });
});

// Print registered routes to console
setTimeout(() => {
  try {
    const registered = [];
    app._router.stack.forEach((middleware) => {
      if (middleware.route) {
        registered.push(middleware.route.path);
      } else if (middleware.name === 'router') {
        middleware.handle.stack.forEach((handler) => {
          const route = handler.route && handler.route.path;
          if (route) registered.push(route);
        });
      }
    });
    console.log('Registered routes:', registered);
  } catch (e) {
    console.error('Failed listing routes:', e.message);
  }
}, 1000);

// ── Weekly Challenge Scheduler ──
startScheduler();

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
