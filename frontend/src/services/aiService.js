import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// ── AI Companion Chat ──────────────────────────────────────────────────────────
export const sendChatMessage = async (history, message, mode = 'vent') => {
  const { data } = await api.post('/ai/chat', { history, message, mode });
  return data.reply;
};

// ── Journal Reflection ─────────────────────────────────────────────────────────
export const getJournalReflection = async (content, mood = '', gratitude = '') => {
  const { data } = await api.post('/ai/reflect', { content, mood, gratitude });
  return data.reflection;
};

// ── Emotion Analysis ───────────────────────────────────────────────────────────
export const analyzeEmotion = async (content) => {
  const { data } = await api.post('/ai/analyze-emotion', { content });
  return data; // { tone, energyLevel, encouragement, suggestBreak }
};

// ── Grounding Suggestion ───────────────────────────────────────────────────────
export const getSuggestion = async (mood) => {
  const { data } = await api.post('/ai/suggest', { mood });
  return data.suggestion;
};

export default api;
