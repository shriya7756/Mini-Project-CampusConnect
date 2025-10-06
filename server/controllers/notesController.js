const Note = require('../models/Note');

async function listNotes(_req, res) {
	const notes = await Note.find({}).populate('author', 'name email');
	return res.json({ notes });
}

async function createNote(req, res) {
	const { title, description, subject, tags, fileUrl, fileType, fileSize } = req.body;
	if (!title || !description || !subject) {
		return res.status(400).json({ message: 'Missing required fields' });
	}
	const note = await Note.create({
		title,
		description,
		subject,
		tags: Array.isArray(tags) ? tags : (tags ? String(tags).split(',').map(t => t.trim()) : []),
		fileUrl,
		fileType,
		fileSize,
		author: req.user.userId,
	});
	const populated = await Note.findById(note._id).populate('author', 'name email');
	return res.status(201).json({ note: populated });
}

module.exports = { listNotes, createNote };

