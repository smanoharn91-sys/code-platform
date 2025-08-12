const mongoose = require('mongoose');

const contestSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  problemIds: [{ type: Number }], // Ordered list of problem IDs
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  submissionOrder: { type: Boolean, default: true }, // Enforce sequential solving
});

module.exports = mongoose.model('Contest', contestSchema);