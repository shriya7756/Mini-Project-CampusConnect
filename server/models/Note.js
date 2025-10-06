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
	},
	{ timestamps: true }
);

const Note = mongoose.model('Note', noteSchema);

module.exports = Note;

