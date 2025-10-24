const express = require('express');
const { listQuestions, createQuestion, addAnswer, deleteAnswer, upvoteQuestion, upvoteAnswer, addView } = require('../controllers/qaController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/questions', listQuestions);
router.post('/questions', auth, createQuestion);
router.post('/questions/:id/answers', auth, addAnswer);
router.post('/questions/:id/answers/:answerId/delete', auth, deleteAnswer);
router.post('/questions/:id/upvote', auth, upvoteQuestion);
router.post('/questions/:id/view', addView);
router.post('/questions/:id/answers/:answerId/upvote', auth, upvoteAnswer);

module.exports = router;

