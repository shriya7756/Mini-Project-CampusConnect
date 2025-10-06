const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema(
	{
		user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true, required: true },
		completedTopicIds: [{ type: Number }],
		activeTrack: { type: String, default: 'dsa' },
	},
	{ timestamps: true }
);

const Progress = mongoose.model('Progress', progressSchema);

module.exports = Progress;

