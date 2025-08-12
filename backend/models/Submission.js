const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  problemId: { type: Number, required: true },
  contestId: { type: mongoose.Schema.Types.ObjectId, ref: 'Contest' }, // Optional, for contest submissions
  status: { type: String, enum: ['Accepted', 'Wrong Answer'], required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Submission', submissionSchema);