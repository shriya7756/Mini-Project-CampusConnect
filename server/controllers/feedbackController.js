const Feedback = require('../models/Feedback');
const { sendFeedbackMail } = require('../utils/mailer');

const VALID_CATEGORIES = ['bug', 'feature', 'improvement', 'general'];

async function createFeedback(req, res) {
  try {
    const { category, subject, message, email } = req.body || {};

    if (!category || !VALID_CATEGORIES.includes(category)) {
      return res.status(400).json({ message: 'Invalid category' });
    }
    if (!subject || !message) {
      return res.status(400).json({ message: 'Subject and message are required' });
    }

    const userId = req.user?.userId; // optional

    const feedback = await Feedback.create({
      category,
      subject: String(subject).trim(),
      message: String(message).trim(),
      email: email ? String(email).trim() : undefined,
      user: userId,
    });

    let emailSent = false;
    try {
      const resMail = await sendFeedbackMail({ category, subject, message, email, user: userId });
      emailSent = !!resMail?.sent;
    } catch (e) {
      // Do not fail the request if email fails
      console.warn('[feedback] email send failed:', e?.message || e);
    }

    // Return minimal info
    return res.status(201).json({ message: 'Feedback received', feedback: { id: feedback._id }, emailSent });
  } catch (e) {
    console.error('createFeedback error', e);
    return res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { createFeedback };

async function listFeedback(req, res) {
  try {
    const limit = Math.min(Number(req.query.limit) || 50, 100);
    const docs = await Feedback.find({}, 'category subject message createdAt user')
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('user', 'name')
      .lean();
    return res.json({ feedback: docs });
  } catch (e) {
    return res.status(500).json({ message: 'Server error' });
  }
}

module.exports.listFeedback = listFeedback;
