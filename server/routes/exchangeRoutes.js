const express = require('express');
const { listItems, createItem, markInterest, addView, toggleLike } = require('../controllers/exchangeController');
const auth = require('../middleware/auth');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const cloudinary = require('../config/cloudinary');

const router = express.Router();

router.get('/', listItems);
router.post('/', auth, createItem);
router.post('/:id/interest', auth, markInterest);
router.post('/:id/like', auth, toggleLike);
router.post('/:id/view', addView);

router.post('/upload', auth, upload.single('image'), async (req, res) => {
	try {
		if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
		const base64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
		const uploaded = await cloudinary.uploader.upload(base64, { folder: 'campusconnect/exchange' });
		return res.json({ url: uploaded.secure_url });
	} catch (e) {
		return res.status(500).json({ message: 'Upload failed' });
	}
});

module.exports = router;

