const express = require('express');
const { listQuestions, createQuestion, addAnswer } = require('../controllers/qaController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/questions', listQuestions);
router.post('/questions', auth, createQuestion);
router.post('/questions/:id/answers', auth, addAnswer);

module.exports = router;

