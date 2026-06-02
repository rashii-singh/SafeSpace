import express from 'express';

const router = express.Router();

router.get('/entries', (req, res) => res.json({ message: 'Get journal entries' }));
router.post('/entries', (req, res) => res.json({ message: 'Create journal entry' }));

export default router;
