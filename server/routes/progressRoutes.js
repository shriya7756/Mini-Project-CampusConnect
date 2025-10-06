const express = require('express');
const { getProgress, toggleTopic, setActiveTrack } = require('../controllers/progressController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, getProgress);
router.post('/toggle', auth, toggleTopic);
router.post('/track', auth, setActiveTrack);

module.exports = router;

