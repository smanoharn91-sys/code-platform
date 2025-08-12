const { executeCode } = require('../utils/executeCode');
const Submission = require('../models/Submission');
const User = require('../models/User');
const Contest = require('../models/Contest');
const { calculateStreak } = require('./leaderboardController');

const runCode = async (req, res) => {
  const { code, language, input, problemId, expectedOutput, contestId } = req.body;
  const userId = req.user?.id;

  try {
    if (!code || !language || !problemId || expectedOutput === undefined) {
      return res.status(400).json({ error: 'Code, language, problemId, and expectedOutput are required' });
    }

    const output = await executeCode(code, language, input);
    const status = output === expectedOutput ? 'Accepted' : 'Wrong Answer';

    if (userId) {
      const submission = new Submission({
        userId,
        problemId,
        contestId: contestId || null,
        status,
      });
      await submission.save();

      if (status === 'Accepted') {
        await User.findByIdAndUpdate(userId, { $addToSet: { solvedProblems: problemId } });
        await calculateStreak(userId);
      }
    }

    res.json({ output, status });
  } catch (error) {
    console.error('Error in runCode:', error.message, error.stack);
    res.status(500).json({ error: `Internal Server Error: ${error.message}` });
  }
};

const getUnlockedProblems = async (req, res) => {
  const { contestId } = req.params;
  const userId = req.user?.id;

  try {
    const contest = await Contest.findById(contestId);
    if (!contest) return res.status(404).json({ error: 'Contest not found' });

    if (!contest.submissionOrder) {
      return res.json({ unlockedProblems: contest.problemIds });
    }

    const submissions = await Submission.find({ userId, contestId, status: 'Accepted' })
      .sort({ createdAt: 1 });
    const solvedProblemIds = submissions.map(s => s.problemId);

    const unlockedProblems = [];
    for (let i = 0; i < contest.problemIds.length; i++) {
      const problemId = contest.problemIds[i];
      if (i === 0 || solvedProblemIds.includes(contest.problemIds[i - 1])) {
        unlockedProblems.push(problemId);
      } else {
        break;
      }
    }

    res.json({ unlockedProblems });
  } catch (error) {
    console.error('Error in getUnlockedProblems:', error.message);
    res.status(500).json({ error: `Internal Server Error: ${error.message}` });
  }
};

module.exports = { runCode, getUnlockedProblems };