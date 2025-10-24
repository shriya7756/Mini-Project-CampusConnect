const Question = require('../models/Question');

async function listQuestions(req, res) {
	const { subject } = req.query;
	const filter = {};
	if (subject && subject !== 'All Subjects') filter.subject = subject;
	const questions = await Question.find(filter).populate('author', 'name email');
	return res.json({ questions });
}

async function upvoteQuestion(req, res) {
  const { id } = req.params;
  const userId = req.user?.userId;
  const q = await Question.findById(id);
  if (!q) return res.status(404).json({ message: 'Not found' });
  const has = (q.upvotedUserIds || []).some((u) => String(u) === String(userId));
  if (has) {
    q.upvotedUserIds = q.upvotedUserIds.filter((u) => String(u) !== String(userId));
    q.upvotes = Math.max(0, (q.upvotes || 0) - 1);
  } else {
    q.upvotedUserIds = [...(q.upvotedUserIds || []), userId];
    q.upvotes = (q.upvotes || 0) + 1;
  }
  await q.save();
  const populated = await Question.findById(id)
    .populate('author', 'name email')
    .populate('answers.author', 'name email');
  return res.json({ question: populated, toggled: !has });
}

async function upvoteAnswer(req, res) {
  const { id, answerId } = req.params;
  const userId = req.user?.userId;
  const q = await Question.findById(id);
  if (!q) return res.status(404).json({ message: 'Not found' });
  const ans = q.answers.id(answerId);
  if (!ans) return res.status(404).json({ message: 'Answer not found' });
  const has = (ans.upvotedUserIds || []).some((u) => String(u) === String(userId));
  if (has) {
    ans.upvotedUserIds = ans.upvotedUserIds.filter((u) => String(u) !== String(userId));
    ans.upvotes = Math.max(0, (ans.upvotes || 0) - 1);
  } else {
    ans.upvotedUserIds = [...(ans.upvotedUserIds || []), userId];
    ans.upvotes = (ans.upvotes || 0) + 1;
  }
  await q.save();
  const populated = await Question.findById(id)
    .populate('author', 'name email')
    .populate('answers.author', 'name email');
  return res.json({ question: populated, toggled: !has });
}

async function deleteAnswer(req, res) {
  const { id, answerId } = req.params;
  const userId = req.user.userId;
  const question = await Question.findById(id);
  if (!question) return res.status(404).json({ message: 'Question not found' });
  
  const answer = question.answers.id(answerId);
  if (!answer) return res.status(404).json({ message: 'Answer not found' });
  
  if (String(answer.author) !== String(userId)) {
    return res.status(403).json({ message: 'Not authorized to delete this answer' });
  }
  
  question.answers.pull(answerId);
  await question.save();
  
  const populated = await Question.findById(id)
    .populate('author', 'name email')
    .populate('answers.author', 'name email');
  return res.json({ question: populated });
}

async function addView(req, res) {
  const { id } = req.params;
  const userId = req.headers['x-user-id'] || req.user?.userId;
  const question = await Question.findById(id);
  if (!question) return res.status(404).json({ message: 'Not found' });
  
  // Only increment view if user hasn't viewed before
  if (!question.viewedUserIds?.includes(userId)) {
    question.viewedUserIds = [...(question.viewedUserIds || []), userId];
    question.views = (question.views || 0) + 1;
    await question.save();
  }
  
  const populated = await Question.findById(id)
    .populate('author', 'name email')
    .populate('answers.author', 'name email');
  return res.json({ question: populated });
}

async function createQuestion(req, res) {
	const { title, description, tags, subject } = req.body;
	if (!title || !description) {
		return res.status(400).json({ message: 'Missing required fields' });
	}
	const question = await Question.create({
		title,
		description,
		subject,
		tags: Array.isArray(tags) ? tags : (tags ? String(tags).split(',').map(t => t.trim()) : []),
		author: req.user.userId,
	});
	return res.status(201).json({ question });
}

async function addAnswer(req, res) {
	const { id } = req.params;
	const { content } = req.body;
	if (!content) return res.status(400).json({ message: 'Missing content' });
	const question = await Question.findById(id);
	if (!question) return res.status(404).json({ message: 'Not found' });
	question.answers.push({ content, author: req.user.userId });
	await question.save();
	const populated = await Question.findById(id)
		.populate('author', 'name email')
		.populate('answers.author', 'name email');
	return res.status(201).json({ question: populated });
}

module.exports = { listQuestions, createQuestion, addAnswer, deleteAnswer, upvoteQuestion, upvoteAnswer, addView };
