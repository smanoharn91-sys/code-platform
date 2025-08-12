const User = require('../models/User');
const Submission = require('../models/Submission');

const calculateStreak = async (userId) => {
  try {
    const submissions = await Submission.find({ userId, status: 'Accepted' })
      .sort({ createdAt: -1 })
      .select('createdAt');

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const submissionDates = submissions.map(sub => {
      const date = new Date(sub.createdAt);
      date.setHours(0, 0, 0, 0);
      return date.getTime();
    }).filter((value, index, self) => self.indexOf(value) === index); // Unique dates

    let currentDate = today;
    let i = 0;
    while (i < submissionDates.length) {
      const submissionDate = new Date(submissionDates[i]);
      submissionDate.setHours(0, 0, 0, 0);
      if (currentDate.getTime() === submissionDate.getTime()) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
        i++;
      } else if (currentDate.getTime() > submissionDate.getTime()) {
        break;
      } else {
        currentDate.setDate(currentDate.getDate() - 1);
      }
    }

    await User.findByIdAndUpdate(userId, { streak });
    return streak;
  } catch (error) {
    console.error('Error in calculateStreak:', error.message);
    return 0;
  }
};

const getLeaderboard = async (req, res) => {
  try {
    const users = await User.find({ role: 'student' }) // Filter for students only
      .select('username solvedProblems streak')
      .sort({ solvedProblems: -1 });
    
    const leaderboard = users.map((user, index) => ({
      rank: index + 1,
      username: user.username,
      solvedProblems: user.solvedProblems.length,
      streak: user.streak || 0,
    }));

    res.json(leaderboard);
  } catch (error) {
    console.error('Error in getLeaderboard:', error.message);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getLeaderboard, calculateStreak };