import express from 'express';
import authRoutes from './authRoutes.js';
import journalRoutes from './journalRoutes.js';
import aiRoutes from './aiRoutes.js';
import userRoutes from './userRoutes.js';
import sosRoutes from './sosRoutes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/journal', journalRoutes);
router.use('/ai', aiRoutes);
router.use('/users', userRoutes);
router.use('/sos', sosRoutes);

export default router;
