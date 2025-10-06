const ExchangeItem = require('../models/ExchangeItem');

async function listItems(req, res) {
	const { q, category, condition } = req.query;
	const filter = {};
	if (q) {
		filter.$or = [
			{ title: { $regex: q, $options: 'i' } },
			{ description: { $regex: q, $options: 'i' } },
			{ tags: { $regex: q, $options: 'i' } },
		];
	}
	if (category && category !== 'All Categories') filter.category = category;
	if (condition && condition !== 'All Conditions') filter.condition = condition;
	const items = await ExchangeItem.find(filter).populate('seller', 'name email');
	return res.json({ items });
}

async function createItem(req, res) {
	const { title, description, category, price, condition, tags, images, contact } = req.body;
	if (!title || !description || !category || price == null || !condition) {
		return res.status(400).json({ message: 'Missing required fields' });
	}
	const item = await ExchangeItem.create({
		title,
		description,
		category,
		price,
		condition,
		tags: Array.isArray(tags) ? tags : (tags ? String(tags).split(',').map(t => t.trim()) : []),
		images: Array.isArray(images) ? images : [],
		contact: contact || {},
		seller: req.user.userId,
	});
	return res.status(201).json({ item });
}

async function markInterest(req, res) {
	const { id } = req.params;
	const userId = req.user.userId;
	const item = await ExchangeItem.findById(id);
	if (!item) return res.status(404).json({ message: 'Not found' });
	if (!item.interestedUserIds.find((u) => String(u) === String(userId))) {
		item.interestedUserIds.push(userId);
		await item.save();
	}
	return res.json({ item });
}

module.exports = { listItems, createItem, markInterest };

