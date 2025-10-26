const bcrypt = require('bcrypt');
const User = require('../models/User');
const Note = require('../models/Note');
const ExchangeItem = require('../models/ExchangeItem');
const Question = require('../models/Question');

async function getMe(req, res) {
  const user = await User.findById(req.user.userId).select('name email year major');
  if (!user) return res.status(404).json({ message: 'Not found' });
  return res.json({ user });
}

async function updateProfile(req, res) {
  const { name, year, major } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user.userId,
    { $set: { ...(name != null ? { name } : {}), ...(year != null ? { year } : {}), ...(major != null ? { major } : {}) } },
    { new: true }
  ).select('name email year major');
  if (!user) return res.status(404).json({ message: 'Not found' });
  return res.json({ user });
}

async function changePassword(req, res) {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) return res.status(400).json({ message: 'Missing fields' });
  const user = await User.findById(req.user.userId);
  if (!user) return res.status(404).json({ message: 'Not found' });
  const ok = await user.comparePassword(currentPassword);
  if (!ok) return res.status(400).json({ message: 'Current password incorrect' });
  user.passwordHash = await bcrypt.hash(newPassword, 10);
  await user.save();
  return res.json({ message: 'Password updated' });
}

module.exports = { getMe, updateProfile, changePassword };

async function getActivity(req, res) {
  try {
    const userId = req.user.userId;

    const [likedNotes, starredNotes, upvotedNotes, interestedItems, likedItems, upvotedQuestions] = await Promise.all([
      Note.find({ likedUserIds: userId }).select('title subject author').populate('author','name').lean(),
      Note.find({ starredUserIds: userId }).select('title subject author').populate('author','name').lean(),
      Note.find({ upvotedUserIds: userId }).select('title subject author').populate('author','name').lean(),
      ExchangeItem.find({ interestedUserIds: userId }).select('title category price seller').populate('seller','name').lean(),
      ExchangeItem.find({ likedUserIds: userId }).select('title category price seller').populate('seller','name').lean(),
      Question.find({ upvotedUserIds: userId }).select('title subject author').populate('author','name').lean(),
    ]);

    // For answers upvoted by user, return parent questions and mark matches
    const questionsWithAnswers = await Question.find({ 'answers.upvotedUserIds': userId })
      .select('title subject author answers')
      .populate('author','name')
      .lean();

    const answersUpvoted = questionsWithAnswers.map(q => ({
      questionId: q._id,
      title: q.title,
      answers: (q.answers || []).filter(a => (a.upvotedUserIds || []).some(u => String(u) === String(userId)))
        .map(a => ({ id: a._id, content: a.content }))
    }));

    return res.json({
      activity: {
        likedNotes,
        starredNotes,
        upvotedNotes,
        interestedItems,
        likedItems,
        upvotedQuestions,
        answersUpvoted,
      }
    });
  } catch (e) {
    return res.status(500).json({ message: 'Server error' });
  }
}

module.exports.getActivity = getActivity;
