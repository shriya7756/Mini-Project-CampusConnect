const Question = require('../models/Question');

async function listQuestions(req, res) {
	const { subject } = req.query;
	const filter = {};
	if (subject && subject !== 'All Subjects') filter.subject = subject;
	const questions = await Question.find(filter).populate('author', 'name email');
	return res.json({ questions });
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

module.exports = { listQuestions, createQuestion, addAnswer };

