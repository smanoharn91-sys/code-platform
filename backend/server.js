const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const codeRoutes = require('./routes/codeRoutes');
const authRoutes = require('./routes/authRoutes');
const contestRoutes = require('./routes/contestRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use('/api/code', codeRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/contests', contestRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});