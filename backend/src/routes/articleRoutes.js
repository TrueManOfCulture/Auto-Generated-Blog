import express from 'express';
import db from '../services/db.js';

const router = express.Router();

// GET /articles - list all articles (id, title, created_at)
router.get('/articles', async (req, res) => {
	try {
		const result = await db.query(
			'SELECT id, title, created_at FROM articles ORDER BY created_at DESC'
		);
		res.json(result.rows);
	} catch (err) {
		console.error('Error fetching articles:', err.message);
		res.status(500).json({ error: 'Failed to fetch articles' });
	}
});

// GET /articles/:id - full article
router.get('/articles/:id', async (req, res) => {
	try {
		const { id } = req.params;
		const result = await db.query(
			'SELECT id, title, content, created_at FROM articles WHERE id = $1',
			[id]
		);
		if (result.rows.length === 0) {
			return res.status(404).json({ error: 'Article not found' });
		}
		res.json(result.rows[0]);
	} catch (err) {
		console.error('Error fetching article:', err.message);
		res.status(500).json({ error: 'Failed to fetch article' });
	}
});

export default router;
