const bcrypt = require('bcrypt');
const User = require('../models/User');

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
