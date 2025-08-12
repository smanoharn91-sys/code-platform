const Contest = require('../models/Contest');

const createContest = async (req, res) => {
  const { title, description, problemIds, startTime, endTime } = req.body;
  try {
    const contest = new Contest({
      title,
      description,
      problemIds,
      startTime,
      endTime,
      createdBy: req.user.id,
    });
    await contest.save();
    res.json(contest);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getContests = async (req, res) => {
  try {
    const contests = await Contest.find().populate('createdBy', 'username');
    res.json(contests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getContestById = async (req, res) => {
  try {
    const contest = await Contest.findById(req.params.id).populate('createdBy', 'username');
    if (!contest) return res.status(404).json({ error: 'Contest not found' });
    res.json(contest);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createContest, getContests, getContestById };