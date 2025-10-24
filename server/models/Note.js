const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema(
	{
		title: { type: String, required: true, trim: true },
		description: { type: String, required: true },
		subject: { type: String, required: true },
		tags: [{ type: String }],
		fileUrl: { type: String },
		fileType: { type: String },
		fileSize: { type: String },
		author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
		upvotes: { type: Number, default: 0 },
		comments: { type: Number, default: 0 },
		downloads: { type: Number, default: 0 },
		views: { type: Number, default: 0 },
		likedUserIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
		starredUserIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
		upvotedUserIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
		commentsArr: [
			{
				content: { type: String, required: true },
				author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
				createdAt: { type: Date, default: Date.now },
			},
		],
	},
	{ timestamps: true }
);

const Note = mongoose.model('Note', noteSchema);

module.exports = Note;

