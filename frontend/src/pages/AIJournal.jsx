import { useState } from 'react';
import {
  BookOpen, Plus, Mic, Image, Type, Sparkles,
  ChevronLeft, ChevronRight, Trash2, Heart, Brain, X, Send
} from 'lucide-react';
import { motion } from 'framer-motion';
import { getJournalReflection } from '../services/aiService';

// ── Mock data for existing entries ──────────────────────────────────────────
const MOCK_ENTRIES = [
  {
    id: 1,
    entry_type: 'text',
    content: "Felt overwhelmed today with work deadlines stacking up. But I took a 10-minute walk and it genuinely helped clear my head. Small wins count.",
    ai_reflection: "It sounds like you're navigating a lot right now. That instinct to step away and breathe — that's wisdom, not weakness. How did you feel when you came back?",
    burnout_risk: 42,
    created_at: new Date(Date.now() - 86400000).toISOString(),
    mood: '😔',
  },
  {
    id: 2,
    entry_type: 'text',
    content: "Had a really good conversation with a friend I hadn't spoken to in months. It reminded me how much I value deep connections.",
    ai_reflection: "Reconnecting with people who truly see you is one of the most powerful forms of self-care. Hold onto that feeling — it's a signal of what nourishes you.",
    burnout_risk: 18,
    created_at: new Date(Date.now() - 172800000).toISOString(),
    mood: '😊',
  },
  {
    id: 3,
    entry_type: 'text',
    content: "Couldn't sleep again. My mind just won't quiet down. Started listing everything I'm grateful for and eventually fell asleep.",
    ai_reflection: "Sleep struggles often reflect a mind that's trying hard to process everything. Your gratitude practice is a beautiful anchor — your nervous system responds to that.",
    burnout_risk: 61,
    created_at: new Date(Date.now() - 259200000).toISOString(),
    mood: '🥱',
  },
];

const ENTRY_TYPES = [
  { id: 'text', icon: <Type className="w-4 h-4" />, label: 'Text' },
  { id: 'voice', icon: <Mic className="w-4 h-4" />, label: 'Voice' },
  { id: 'image', icon: <Image className="w-4 h-4" />, label: 'Image' },
];

const MOOD_PROMPTS = [
  "What's weighing on your mind today?",
  "What made you smile today, even briefly?",
  "If your emotions had a color right now, what would it be?",
  "What's one thing you wish people understood about how you feel?",
  "What do you need most right now — rest, connection, or clarity?",
];

function getBurnoutColor(risk) {
  if (risk < 30) return { bar: 'bg-sage', text: 'text-sage', label: 'Low' };
  if (risk < 60) return { bar: 'bg-amber-400', text: 'text-amber-500', label: 'Moderate' };
  return { bar: 'bg-rose-400', text: 'text-rose-500', label: 'High' };
}

function formatDate(iso) {
  const date = new Date(iso);
  const today = new Date();
  const diffDays = Math.floor((today - date) / 86400000);
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  return date.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' });
}

export default function AIJournal() {
  const [view, setView] = useState('list'); // 'list' | 'new' | 'detail'
  const [entries, setEntries] = useState(MOCK_ENTRIES);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [entryType, setEntryType] = useState('text');
  const [content, setContent] = useState('');
  const [selectedMood, setSelectedMood] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiReflection, setAiReflection] = useState('');
const [gratitude, setGratitude] = useState('');
  const [promptIdx, setPromptIdx] = useState(Math.floor(Math.random() * MOOD_PROMPTS.length));

  const openDetail = (entry) => { setSelectedEntry(entry); setView('detail'); };
  const openNew   = ()       => { setContent(''); setAiReflection(''); setSelectedMood(''); setView('new'); };
  const goList    = ()       => setView('list');

  const handleAnalyze = async () => {
    if (!content.trim()) return;
    setIsAnalyzing(true);
    try {
      // Backend Gemini Call
      const reflection = await getJournalReflection(content, selectedMood, gratitude);
      setAiReflection(reflection);
    } catch (err) {
      console.error(err);
      setAiReflection("I'm here for you, even though I'm having trouble connecting right now. Keep holding on. 💙");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSave = () => {
    if (!content.trim()) return;
    const newEntry = {
      id: Date.now(),
      entry_type: entryType,
      content,
      gratitude,
      ai_reflection: aiReflection,
      burnout_risk: Math.floor(Math.random() * 60) + 10,
      created_at: new Date().toISOString(),
      mood: selectedMood || '😊',
    };
    setEntries(prev => [newEntry, ...prev]);
    goList();
  };

  const handleDelete = (id) => {
    setEntries(prev => prev.filter(e => e.id !== id));
    goList();
  };

  return (
    <div className="min-h-screen bg-cream">
      {/* ── Header ─────────────────────────────────────── */}
      <header className="bg-white/60 backdrop-blur-sm border-b border-gray-100 px-6 py-5 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          {view !== 'list' ? (
            <button onClick={goList} className="flex items-center gap-1.5 text-gray-500 hover:text-gray-800 font-medium transition-colors">
              <ChevronLeft className="w-5 h-5" /> Back
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-sage/15 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-sage" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">AI Journal</h1>
                <p className="text-gray-400 text-xs">{entries.length} entries</p>
              </div>
            </div>
          )}
          {view === 'list' && (
            <button
              onClick={openNew}
              className="flex items-center gap-2 px-5 py-2.5 bg-sage text-white rounded-full font-semibold text-sm hover:bg-sage/90 shadow-sm hover:shadow transition-all"
            >
              <Plus className="w-4 h-4" /> New Entry
            </button>
          )}
          {view === 'new' && (
            <p className="text-gray-500 text-sm font-medium">New Entry</p>
          )}
          {view === 'detail' && selectedEntry && (
            <div className="flex items-center gap-3">
              <span className="text-gray-400 text-sm">{formatDate(selectedEntry.created_at)}</span>
              <button onClick={() => handleDelete(selectedEntry.id)} className="text-gray-300 hover:text-rose-400 transition-colors p-1">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 md:px-6 py-8">

        {/* ════════════════ LIST VIEW ════════════════ */}
        {view === 'list' && (
          <div className="space-y-6">
            {/* Prompt card */}
            <div className="bg-gradient-to-r from-lavender/50 to-softBlue/20 rounded-3xl border border-lavender p-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-white/60 flex items-center justify-center flex-shrink-0 text-xl">🤍</div>
              <div className="flex-1">
                <p className="text-gray-700 italic mb-3">"{MOOD_PROMPTS[promptIdx]}"</p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={openNew}
                    className="px-4 py-2 bg-sage text-white rounded-full text-sm font-semibold hover:bg-sage/90 transition-all flex items-center gap-2"
                  >
                    <Plus className="w-3.5 h-3.5" /> Write
                  </button>
                  <button
                    onClick={() => setPromptIdx((promptIdx + 1) % MOOD_PROMPTS.length)}
                    className="text-gray-400 hover:text-sage text-sm transition-colors"
                  >
                    Try another prompt
                  </button>
                </div>
              </div>
            </div>

            {/* Entry cards */}
            {entries.length === 0 && (
              <div className="text-center py-20 text-gray-400">
                <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p className="font-medium">No entries yet.</p>
                <p className="text-sm">Your first reflection is just a tap away.</p>
              </div>
            )}
            {entries.map(entry => {
              const risk = getBurnoutColor(entry.burnout_risk);
              return (
                <motion.button
                  key={entry.id}
                  onClick={() => openDetail(entry)}
                  className="w-full text-left bg-white border border-gray-100 rounded-3xl p-6 hover:shadow-md transition-all hover:-translate-y-0.5 group"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: entry.id % 5 * 0.1 }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{entry.mood}</span>
                      <span className="text-gray-400 text-sm font-medium">{formatDate(entry.created_at)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-50 ${risk.text}`}>
                        {risk.label} risk
                      </span>
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed line-clamp-2 mb-4">{entry.content}</p>
                    {entry.gratitude && (
                      <div className="mt-2 text-gray-600 text-sm">
                        <span className="font-medium text-sage">Gratitude:</span> {entry.gratitude}
                      </div>
                    )}
                  {entry.ai_reflection && (
                    <div className="flex items-start gap-2 bg-sage/5 rounded-2xl px-4 py-3 border border-sage/15">
                      <Sparkles className="w-3.5 h-3.5 text-sage flex-shrink-0 mt-0.5" />
                      <p className="text-sage text-xs line-clamp-1">{entry.ai_reflection}</p>
                    </div>
                  )}
                  {/* Burnout risk bar */}
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Burnout risk</span>
                      <span>{entry.burnout_risk}%</span>
                    </div>
                    <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full ${risk.bar} rounded-full`} style={{ width: `${entry.burnout_risk}%` }} />
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        )}

        {/* ════════════════ NEW ENTRY VIEW ════════════════ */}
        {view === 'new' && (
          <div className="space-y-6">
            {/* Entry type tabs */}
            <div className="flex gap-2 bg-white rounded-2xl p-1.5 border border-gray-100 shadow-sm w-fit">
              {ENTRY_TYPES.map(t => (
                <button
                  key={t.id}
                  onClick={() => setEntryType(t.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                    entryType === t.id ? 'bg-sage text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {t.icon} {t.label}
                </button>
              ))}
            </div>

            {/* Mood selector */}
            <div>
              <p className="text-sm font-semibold text-gray-500 mb-3">How are you feeling?</p>
              <div className="flex gap-3 flex-wrap">
                {['😊','😐','😔','😤','😰','🥱','😢','🤯'].map(emoji => (
                  <button
                    key={emoji}
                    onClick={() => setSelectedMood(emoji)}
                    className={`text-2xl p-2.5 rounded-xl border-2 transition-all hover:scale-110 ${
                      selectedMood === emoji ? 'border-sage bg-sage/10 scale-110' : 'border-transparent bg-white hover:bg-gray-50'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Text area */}
            {entryType === 'text' && (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <textarea
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  placeholder={MOOD_PROMPTS[promptIdx]}
                  rows={6}
                  className="w-full px-4 py-3 text-gray-800 placeholder-gray-300 text-base leading-relaxed resize-none outline-none border border-sage/20 rounded-md mb-2"
                />
                <textarea
                  value={gratitude}
                  onChange={e => setGratitude(e.target.value)}
                  placeholder="What are you grateful for today? (optional)"
                  rows={3}
                  className="w-full px-4 py-2 text-gray-800 placeholder-gray-400 text-sm leading-relaxed resize-none outline-none border border-sage/10 rounded-md"
                />
                <div className="px-6 py-3 border-t border-gray-50 flex items-center justify-between bg-gray-50/50">
                  <span className="text-xs text-gray-400">{content.length} characters</span>
                  <button
                    onClick={handleAnalyze}
                    disabled={!content.trim() || isAnalyzing}
                    className="flex items-center gap-2 px-4 py-2 bg-sage/10 text-sage rounded-full text-sm font-semibold hover:bg-sage/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    <Sparkles className="w-4 h-4" />
                    {isAnalyzing ? 'Reflecting…' : 'Get AI Reflection'}
                  </button>
                </div>
              </div>
            )}

            {entryType === 'voice' && (
              <div className="bg-white rounded-3xl border-2 border-dashed border-sage/30 p-12 text-center">
                <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mic className="w-10 h-10 text-rose-400" />
                </div>
                <p className="font-semibold text-gray-700 mb-2">Voice Recording</p>
                <p className="text-gray-400 text-sm">Tap to start recording your thoughts aloud.</p>
                <button className="mt-6 px-6 py-3 bg-rose-50 text-rose-500 rounded-full font-semibold border border-rose-200 hover:bg-rose-100 transition-colors">
                  Start Recording
                </button>
              </div>
            )}

            {entryType === 'image' && (
              <div className="bg-white rounded-3xl border-2 border-dashed border-sage/30 p-12 text-center">
                <div className="w-20 h-20 bg-softBlue/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Image className="w-10 h-10 text-blue-400" />
                </div>
                <p className="font-semibold text-gray-700 mb-2">Upload an Image</p>
                <p className="text-gray-400 text-sm">Share a photo that represents how you're feeling.</p>
                <button className="mt-6 px-6 py-3 bg-softBlue/20 text-blue-500 rounded-full font-semibold border border-softBlue/40 hover:bg-softBlue/30 transition-colors">
                  Choose File
                </button>
              </div>
            )}

            {/* AI Reflection output */}
            {aiReflection && (
              <div className="bg-gradient-to-br from-lavender/40 to-softBlue/20 rounded-3xl border border-lavender p-6 animate-fade-in">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-4 h-4 text-sage" />
                  <span className="text-sage font-bold text-sm">Your companion reflects:</span>
                </div>
                <p className="text-gray-700 leading-relaxed italic">"{aiReflection}"</p>
              </div>
            )}

            {/* Save button */}
            <div className="flex gap-3">
              <button
                onClick={goList}
                className="flex-1 py-3.5 bg-white border border-gray-200 text-gray-600 rounded-2xl font-semibold hover:bg-gray-50 transition-all"
              >
                Discard
              </button>
              <button
                onClick={handleSave}
                disabled={!content.trim() && entryType === 'text'}
                className="flex-1 py-3.5 bg-gray-800 text-white rounded-2xl font-bold hover:bg-gray-900 disabled:opacity-40 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" /> Save Entry
              </button>
            </div>
          </div>
        )}

        {/* ════════════════ DETAIL VIEW ════════════════ */}
        {view === 'detail' && selectedEntry && (() => {
          const risk = getBurnoutColor(selectedEntry.burnout_risk);
          return (
            <div className="space-y-6 animate-fade-in">
              {/* Mood + date */}
              <div className="flex items-center gap-3">
                <span className="text-4xl">{selectedEntry.mood}</span>
                <div>
                  <p className="font-bold text-gray-800 text-lg">{formatDate(selectedEntry.created_at)}</p>
                  <p className={`text-sm font-semibold ${risk.text}`}>Burnout risk: {risk.label} ({selectedEntry.burnout_risk}%)</p>
                </div>
              </div>

              {/* Risk bar */}
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full ${risk.bar} rounded-full transition-all duration-700`} style={{ width: `${selectedEntry.burnout_risk}%` }} />
              </div>

              {/* Content */}
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                <p className="text-gray-700 leading-relaxed text-base whitespace-pre-wrap">{selectedEntry.content}</p>
              </div>

              {/* AI Reflection */}
              {selectedEntry.ai_reflection && (
                <div className="bg-gradient-to-br from-lavender/40 to-softBlue/20 rounded-3xl border border-lavender p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-4 h-4 text-sage" />
                    <span className="text-sage font-bold text-sm">Companion reflection</span>
                  </div>
                  <p className="text-gray-700 leading-relaxed italic">"{selectedEntry.ai_reflection}"</p>
                </div>
              )}

              {/* Related action */}
              <div className="bg-white border border-gray-100 rounded-3xl p-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
                    <Brain className="w-5 h-5 text-amber-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">Feeling heavy?</p>
                    <p className="text-gray-400 text-xs">A 2-min breathing exercise might help</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-300" />
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
