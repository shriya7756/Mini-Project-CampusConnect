const express = require('express');
const { listNotes, createNote } = require('../controllers/notesController');
const auth = require('../middleware/auth');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const cloudinary = require('../config/cloudinary');

const router = express.Router();

router.get('/', listNotes);
router.post('/', auth, createNote);

router.post('/upload', auth, upload.single('file'), async (req, res) => {
	try {
		if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
		const base64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
		const uploaded = await cloudinary.uploader.upload(base64, { folder: 'campusconnect/notes', resource_type: 'auto' });
		return res.json({ url: uploaded.secure_url, type: uploaded.resource_type, bytes: uploaded.bytes });
	} catch (e) {
		return res.status(500).json({ message: 'Upload failed' });
	}
});

module.exports = router;

