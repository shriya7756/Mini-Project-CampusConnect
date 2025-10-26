const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema(
  {
    category: { type: String, enum: ['bug', 'feature', 'improvement', 'general'], required: true },
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    email: { type: String, trim: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Feedback', feedbackSchema);
