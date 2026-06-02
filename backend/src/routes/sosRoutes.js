import express from 'express';

const router = express.Router();

router.post('/alert', (req, res) => res.json({ message: 'Trigger SOS alert' }));

export default router;
