const Progress = require('../models/Progress');

async function getProgress(req, res) {
	let progress = await Progress.findOne({ user: req.user.userId });
	if (!progress) {
		progress = await Progress.create({ user: req.user.userId, completedTopicIds: [], activeTrack: 'dsa' });
	}
	return res.json({ progress });
}

async function toggleTopic(req, res) {
	const { topicId } = req.body;
	if (typeof topicId !== 'number') return res.status(400).json({ message: 'topicId must be a number' });
	let progress = await Progress.findOne({ user: req.user.userId });
	if (!progress) {
		progress = await Progress.create({ user: req.user.userId, completedTopicIds: [topicId], activeTrack: 'dsa' });
		return res.json({ progress });
	}
	const idx = progress.completedTopicIds.indexOf(topicId);
	if (idx >= 0) progress.completedTopicIds.splice(idx, 1); else progress.completedTopicIds.push(topicId);
	await progress.save();
	return res.json({ progress });
}

async function setActiveTrack(req, res) {
	const { track } = req.body;
	let progress = await Progress.findOne({ user: req.user.userId });
	if (!progress) progress = await Progress.create({ user: req.user.userId, completedTopicIds: [], activeTrack: track || 'dsa' });
	progress.activeTrack = track || 'dsa';
	await progress.save();
	return res.json({ progress });
}

module.exports = { getProgress, toggleTopic, setActiveTrack };

