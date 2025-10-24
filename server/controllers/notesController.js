const Note = require('../models/Note');

async function listNotes(_req, res) {
	const notes = await Note.find({}).populate('author', 'name email');
	return res.json({ notes });
}

async function createNote(req, res) {
	const { title, description, subject, tags, fileUrl, fileType, fileSize } = req.body;
	if (!title || !description || !subject) {
		return res.status(400).json({ message: 'Missing required fields' });
	}
	const note = await Note.create({
		title,
		description,
		subject,
		tags: Array.isArray(tags) ? tags : (tags ? String(tags).split(',').map(t => t.trim()) : []),
		fileUrl,
		fileType,
		fileSize,
		author: req.user.userId,
	});
	const populated = await Note.findById(note._id).populate('author', 'name email');
	return res.status(201).json({ note: populated });
}

async function upvoteNote(req, res) {
  const { id } = req.params;
  const userId = req.user.userId;
  const note = await Note.findById(id);
  if (!note) return res.status(404).json({ message: 'Not found' });
  const hasUpvoted = note.upvotedUserIds?.some((u) => String(u) === String(userId));
  if (hasUpvoted) {
    note.upvotedUserIds = note.upvotedUserIds.filter((u) => String(u) !== String(userId));
    note.upvotes = Math.max(0, (note.upvotes || 0) - 1);
  } else {
    note.upvotedUserIds = [...(note.upvotedUserIds || []), userId];
    note.upvotes = (note.upvotes || 0) + 1;
  }
  await note.save();
  const populated = await Note.findById(id).populate('author', 'name email');
  return res.json({ note: populated, toggled: !hasUpvoted });
}

async function likeNote(req, res) {
  const { id } = req.params;
  const userId = req.user.userId;
  const note = await Note.findById(id);
  if (!note) return res.status(404).json({ message: 'Not found' });
  const hasLiked = note.likedUserIds?.some((u) => String(u) === String(userId));
  if (hasLiked) {
    note.likedUserIds = note.likedUserIds.filter((u) => String(u) !== String(userId));
  } else {
    note.likedUserIds = [...(note.likedUserIds || []), userId];
  }
  await note.save();
  const populated = await Note.findById(id).populate('author', 'name email');
  return res.json({ note: populated, likes: populated.likedUserIds.length, toggled: !hasLiked });
}

async function starNote(req, res) {
  const { id } = req.params;
  const userId = req.user.userId;
  const note = await Note.findById(id);
  if (!note) return res.status(404).json({ message: 'Not found' });
  const hasStarred = note.starredUserIds?.some((u) => String(u) === String(userId));
  if (hasStarred) {
    note.starredUserIds = note.starredUserIds.filter((u) => String(u) !== String(userId));
  } else {
    note.starredUserIds = [...(note.starredUserIds || []), userId];
  }
  await note.save();
  const populated = await Note.findById(id).populate('author', 'name email');
  return res.json({ note: populated, stars: populated.starredUserIds.length, toggled: !hasStarred });
}

async function addCommentCount(req, res) {
  const { id } = req.params;
  const note = await Note.findByIdAndUpdate(id, { $inc: { comments: 1 } }, { new: true }).populate('author', 'name email');
  if (!note) return res.status(404).json({ message: 'Not found' });
  return res.json({ note });
}

async function addComment(req, res) {
  const { id } = req.params;
  const { content } = req.body;
  if (!content || !content.trim()) return res.status(400).json({ message: 'Missing content' });
  const note = await Note.findById(id);
  if (!note) return res.status(404).json({ message: 'Not found' });
  note.commentsArr = [...(note.commentsArr || []), { content: content.trim(), author: req.user.userId }];
  note.comments = (note.comments || 0) + 1;
  await note.save();
  const populated = await Note.findById(id).populate('author', 'name email').populate('commentsArr.author', 'name email');
  return res.status(201).json({ note: populated });
}

async function deleteComment(req, res) {
  const { id, commentId } = req.params;
  const userId = req.user.userId;
  const note = await Note.findById(id);
  if (!note) return res.status(404).json({ message: 'Note not found' });
  
  const commentIndex = note.commentsArr.findIndex(c => String(c._id) === String(commentId));
  if (commentIndex === -1) return res.status(404).json({ message: 'Comment not found' });
  
  const comment = note.commentsArr[commentIndex];
  if (String(comment.author) !== String(userId)) {
    return res.status(403).json({ message: 'Not authorized to delete this comment' });
  }
  
  note.commentsArr.splice(commentIndex, 1);
  note.comments = Math.max(0, (note.comments || 0) - 1);
  await note.save();
  
  const populated = await Note.findById(id).populate('author', 'name email').populate('commentsArr.author', 'name email');
  return res.json({ note: populated });
}

async function addView(req, res) {
  const { id } = req.params;
  const userId = req.headers['x-user-id'] || req.user?.userId;
  const note = await Note.findById(id);
  if (!note) return res.status(404).json({ message: 'Not found' });
  
  // Only increment view if user hasn't viewed before
  if (!note.viewedUserIds?.includes(userId)) {
    note.viewedUserIds = [...(note.viewedUserIds || []), userId];
    note.views = (note.views || 0) + 1;
    await note.save();
  }
  
  const populated = await Note.findById(id).populate('author', 'name email');
  return res.json({ note: populated });
}

module.exports = { listNotes, createNote, upvoteNote, likeNote, starNote, addCommentCount, addComment, deleteComment, addView };

