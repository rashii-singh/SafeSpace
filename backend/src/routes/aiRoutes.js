import express from 'express';
import { chatCompanion, generateReflection, analyzeEmotion, generateSuggestion } from '../controllers/aiController.js';

const router = express.Router();

router.post('/chat',           chatCompanion);
router.post('/reflect',        generateReflection);
router.post('/analyze-emotion',analyzeEmotion);
router.post('/suggest',        generateSuggestion);

export default router;
