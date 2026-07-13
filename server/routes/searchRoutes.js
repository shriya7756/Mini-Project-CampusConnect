const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const Question = require('../models/Question');

/**
 * GET /api/search?q=query
 * Full-text search across notes and Q&A posts
 */
router.get('/', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.trim().length === 0) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const textQuery = { $text: { $search: q } };
    const scoreProjection = { score: { $meta: 'textScore' } };
    const sortByScore = { score: { $meta: 'textScore' } };

    const [notes, qas] = await Promise.all([
      Note.find(textQuery, scoreProjection).sort(sortByScore).limit(10),
      Question.find(textQuery, scoreProjection).sort(sortByScore).limit(10),
    ]);

    res.json({ notes, qas, query: q });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
