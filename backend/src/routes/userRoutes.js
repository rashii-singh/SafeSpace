import express from 'express';

const router = express.Router();

router.get('/profile', (req, res) => res.json({ message: 'Get user profile' }));
router.put('/profile', (req, res) => res.json({ message: 'Update user profile' }));
router.get('/analytics/summary', (req, res) => res.json({ message: 'Get user wellness data' }));

export default router;
