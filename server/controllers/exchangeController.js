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
	const items = await ExchangeItem.find(filter).populate('seller', 'name email').lean();
    const mapped = items.map((it) => ({
        ...it,
        interested: Array.isArray(it.interestedUserIds) ? it.interestedUserIds.length : 0,
        likes: Array.isArray(it.likedUserIds) ? it.likedUserIds.length : 0,
    }));
    return res.json({ items: mapped });
}

async function toggleLike(req, res) {
    const { id } = req.params;
    const userId = req.user.userId;
    const item = await ExchangeItem.findById(id);
    if (!item) return res.status(404).json({ message: 'Not found' });
    const already = item.likedUserIds.find((u) => String(u) === String(userId));
    if (already) {
        item.likedUserIds = item.likedUserIds.filter((u) => String(u) !== String(userId));
    } else {
        item.likedUserIds.push(userId);
    }
    await item.save();
    const populated = await ExchangeItem.findById(id).populate('seller', 'name email').lean();
    return res.json({ item: { ...populated.toObject?.() || populated, interested: populated.interestedUserIds?.length || 0, likes: populated.likedUserIds?.length || 0 } });
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
  const already = item.interestedUserIds.find((u) => String(u) === String(userId));
  if (already) {
    item.interestedUserIds = item.interestedUserIds.filter((u) => String(u) !== String(userId));
  } else {
    item.interestedUserIds.push(userId);
  }
  await item.save();
  const populated = await ExchangeItem.findById(id).populate('seller', 'name email').lean();
  return res.json({ 
    item: { ...populated.toObject?.() || populated, interested: populated.interestedUserIds?.length || 0 }, 
    toggled: !already 
  });
}

async function addView(req, res) {
	const { id } = req.params;
	const userId = req.headers['x-user-id'] || req.user?.userId;
	const item = await ExchangeItem.findById(id);
	if (!item) return res.status(404).json({ message: 'Not found' });
	
	// Only increment view if user hasn't viewed before
	if (!item.viewedUserIds?.includes(userId)) {
		item.viewedUserIds = [...(item.viewedUserIds || []), userId];
		item.views = (item.views || 0) + 1;
		await item.save();
	}
	
	const populated = await ExchangeItem.findById(id).populate('seller', 'name email').lean();
	return res.json({ item: { ...populated, interested: populated.interestedUserIds?.length || 0 } });
}

module.exports = { listItems, createItem, markInterest, addView, toggleLike };
