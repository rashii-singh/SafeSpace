import { GoogleGenAI } from '@google/genai';

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const MODEL = 'gemini-2.0-flash';

const SYSTEM_PROMPT = `You are a warm, empathetic AI wellness companion for SafeSpace, a mental wellness app. 
Your persona:
- You listen first before offering any advice
- You validate emotions without minimizing them  
- You never offer medical diagnoses or clinical assessments
- You only give suggestions or advice when explicitly asked
- You use warm, encouraging language — never clinical jargon
- You are NOT a therapist, but a caring companion
- If someone expresses thoughts of self-harm, or repeated signs of severe distress/burnout, gently suggest: "Would you like to speak with a professional counselor? You can explore the Professional Support Hub in the menu."
- Keep responses concise (2–4 sentences), warm, and human

You NEVER:
- Use clinical terms like "depression", "anxiety disorder", "diagnosis"
- Give medical advice
- Minimize or dismiss feelings
- Offer unsolicited advice`;

// ── Helper ────────────────────────────────────────────────────────────────────
async function generateContent(systemPart, userPrompt) {
  const response = await genAI.models.generateContent({
    model: MODEL,
    contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
    config: { systemInstruction: systemPart, maxOutputTokens: 300, temperature: 0.85 },
  });
  return response.text;
}

// ── Controller Methods ─────────────────────────────────────────────────────────

// POST /api/ai/chat — multi-turn companion chat
export async function chatCompanion(req, res) {
  try {
    const { history = [], message, mode = 'vent' } = req.body;
    if (!message) return res.status(400).json({ error: 'Message is required' });

    const modeContext = {
      vent: 'The user just wants to be heard. DO NOT give advice. Listen and validate.',
      support: 'The user needs emotional support and validation.',
      advice: 'The user is explicitly asking for advice or suggestions. You may offer gentle, practical ideas.',
    }[mode] || '';

    const systemInstruction = `${SYSTEM_PROMPT}\n\nCurrent mode: ${modeContext}`;

    const chat = genAI.chats.create({
      model: MODEL,
      config: { systemInstruction, maxOutputTokens: 300, temperature: 0.85 },
      history: history.map(m => ({
        role: m.role,
        parts: [{ text: m.text }],
      })),
    });

    const response = await chat.sendMessage({ message });
    return res.json({ reply: response.text });
  } catch (err) {
    console.error('[chatCompanion]', err.message);
    return res.status(500).json({ error: 'Companion unavailable right now.' });
  }
}

// POST /api/ai/reflect — journal entry reflection
export async function generateReflection(req, res) {
  try {
    const { content, mood, gratitude } = req.body;
    if (!content) return res.status(400).json({ error: 'Journal content is required' });

    const prompt = `A user wrote this journal entry:
"${content}"
${mood ? `Their mood: ${mood}` : ''}
${gratitude ? `Gratitude note: ${gratitude}` : ''}

Write a warm, thoughtful reflection (3–4 sentences) that:
1. Acknowledges what they shared
2. Points out something positive or insightful you noticed
3. Ends with a gentle, encouraging question or affirmation`;

    const reflection = await generateContent(SYSTEM_PROMPT, prompt);
    return res.json({ reflection });
  } catch (err) {
    console.error('[generateReflection]', err.message);
    return res.status(500).json({ error: 'Could not generate reflection.' });
  }
}

// POST /api/ai/analyze-emotion — subtle emotional analysis (non-clinical)
export async function analyzeEmotion(req, res) {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ error: 'Content is required' });

    const prompt = `Read this text and provide a gentle emotional analysis:
"${content}"

Respond in JSON with this shape:
{
  "tone": "one short phrase (e.g. 'reflective and a little tired')",
  "energyLevel": "low | medium | high",
  "encouragement": "one warm, encouraging sentence",
  "suggestBreak": true or false
}
Return ONLY valid JSON, no markdown.`;

    const raw = await generateContent(SYSTEM_PROMPT, prompt);
    const cleaned = raw.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleaned);
    return res.json(parsed);
  } catch (err) {
    console.error('[analyzeEmotion]', err.message);
    return res.status(500).json({ error: 'Could not analyze emotion.' });
  }
}

// POST /api/ai/suggest — quick grounding suggestion based on mood
export async function generateSuggestion(req, res) {
  try {
    const { mood } = req.body;

    const prompt = `A user is feeling: "${mood || 'overwhelmed'}".
Suggest one short (2–3 sentence), warm, actionable thing they can do right now to feel a little better.
Keep it gentle, grounded, and non-clinical.`;

    const suggestion = await generateContent(SYSTEM_PROMPT, prompt);
    return res.json({ suggestion });
  } catch (err) {
    console.error('[generateSuggestion]', err.message);
    return res.status(500).json({ error: 'Could not generate suggestion.' });
  }
}
