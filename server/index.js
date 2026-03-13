const express = require('express');
const app = express();
const authRoutes = require('./routes/authRoutes');

app.use(express.json()); // Essential to read form data

// Use the routes
app.use('/api/auth', authRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));