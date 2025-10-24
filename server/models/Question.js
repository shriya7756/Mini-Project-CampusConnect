const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema(
	{
		content: { type: String, required: true },
		author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
		upvotes: { type: Number, default: 0 },
		upvotedUserIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
		isAccepted: { type: Boolean, default: false },
	},
	{ timestamps: true }
);

const questionSchema = new mongoose.Schema(
	{
		title: { type: String, required: true },
		description: { type: String, required: true },
		subject: { type: String },
		tags: [{ type: String }],
		author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
		solved: { type: Boolean, default: false },
		answers: [answerSchema],
		views: { type: Number, default: 0 },
		upvotes: { type: Number, default: 0 },
		upvotedUserIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
	},
	{ timestamps: true }
);

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;

