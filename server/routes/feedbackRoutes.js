const express = require('express');
const { createFeedback, listFeedback } = require('../controllers/feedbackController');

const router = express.Router();

// Feedback can be submitted by anyone (authenticated optional)
router.post('/', createFeedback);
router.get('/', listFeedback);

module.exports = router;
