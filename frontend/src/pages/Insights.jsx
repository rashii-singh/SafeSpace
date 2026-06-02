import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Star, Heart, Activity, Target, Sun, Cloud, Moon, Zap, Coffee,
  BookOpen, MessageCircle, Wind, TrendingUp, CheckCircle, Flame, Award
} from 'lucide-react';

// ─── Animated Counter Hook ────────────────────────────────────────────────────
function useCounter(target, duration = 1500, delay = 0) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => {
      let start = 0;
      const step = target / (duration / 16);
      const interval = setInterval(() => {
        start += step;
        if (start >= target) { setCount(target); clearInterval(interval); }
        else setCount(Math.floor(start));
      }, 16);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timer);
  }, [target, duration, delay]);
  return count;
}

// ─── Sparkline SVG ────────────────────────────────────────────────────────────
function Sparkline({ data, color = '#6B9E7A', height = 40 }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 100;
  const h = height;

  const coords = data.map((v, i) => ({
    x: (i / (data.length - 1)) * w,
    y: h - ((v - min) / range) * (h * 0.85) - h * 0.075,
  }));

  // Smooth line path using cubic bezier curves
  const linePath = coords.reduce((path, pt, i) => {
    if (i === 0) return `M ${pt.x},${pt.y}`;
    const prev = coords[i - 1];
    const cpx = (prev.x + pt.x) / 2;
    return `${path} C ${cpx},${prev.y} ${cpx},${pt.y} ${pt.x},${pt.y}`;
  }, '');

  // Fill area closes back along the bottom
  const fillPath = `${linePath} L ${coords[coords.length - 1].x},${h} L ${coords[0].x},${h} Z`;

  return (
    <svg viewBox={`0 0 100 ${h}`} className="w-full h-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`grad-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      {/* Fill area */}
      <path d={fillPath} fill={`url(#grad-${color.replace('#','')})`} stroke="none" />
      {/* Line */}
      <path d={linePath} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Dots at each data point */}
      {coords.map((pt, i) => (
        <circle key={i} cx={pt.x} cy={pt.y} r="2" fill={color} opacity="0.7" />
      ))}
    </svg>
  );
}

// ─── Mood Week Calendar ───────────────────────────────────────────────────────
const WEEK_MOODS = [
  { day: 'M', emoji: '😔', label: 'Low', color: 'bg-blue-100' },
  { day: 'T', emoji: '😌', label: 'Calm', color: 'bg-sage/20' },
  { day: 'W', emoji: '😊', label: 'Good', color: 'bg-amber-100' },
  { day: 'T', emoji: '🌱', label: 'Growing', color: 'bg-green-100' },
  { day: 'F', emoji: '☀️', label: 'Great', color: 'bg-yellow-100' },
  { day: 'S', emoji: '😌', label: 'Calm', color: 'bg-sage/20' },
  { day: 'S', emoji: '✨', label: 'Glowing', color: 'bg-lavender/40' },
];

// ─── Radial Burnout Indicator ─────────────────────────────────────────────────
function RadialIndicator({ value, label, color }) {
  const r = 36; const circ = 2 * Math.PI * r;
  const dash = (value / 100) * circ;
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-24 h-24">
        <svg viewBox="0 0 88 88" className="w-full h-full -rotate-90">
          <circle cx="44" cy="44" r={r} fill="none" stroke="#f3f4f6" strokeWidth="8" />
          <motion.circle
            cx="44" cy="44" r={r} fill="none" stroke={color} strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: circ - dash }}
            transition={{ duration: 1.4, ease: 'easeOut', delay: 0.3 }}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-xl font-bold text-gray-700">
          {value}%
        </span>
      </div>
      <p className="text-xs font-medium text-gray-500 text-center">{label}</p>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function Insights() {
  const [liveTime, setLiveTime] = useState(new Date());
  useEffect(() => { const t = setInterval(() => setLiveTime(new Date()), 1000); return () => clearInterval(t); }, []);

  const streak = useCounter(7, 1200, 200);
  const journalCount = useCounter(12, 1000, 400);
  const stressBreaks = useCounter(3, 800, 600);
  const ventSessions = useCounter(5, 900, 800);

  const moodData = [3, 4, 5, 4, 6, 5, 7];
  const journalData = [1, 0, 2, 1, 2, 1, 2];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-lavender/10 to-softBlue/10 p-4 md:p-8 pb-28">
      <motion.div className="max-w-5xl mx-auto space-y-6" variants={containerVariants} initial="hidden" animate="show">

        {/* ── Header ───────────────────────────────────────────────────────── */}
        <motion.header variants={cardVariants} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-sage/10 text-sage rounded-full text-xs font-semibold mb-2 border border-sage/20">
              <span className="w-1.5 h-1.5 bg-sage rounded-full animate-pulse" />
              Live • {liveTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Your Wellness Journey</h1>
            <p className="text-gray-500 mt-1">You're showing great consistency this week. Keep going! ✨</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-2xl shadow-sm border border-gray-100">
            <Flame className="w-5 h-5 text-amber-500" />
            <div>
              <p className="text-xs text-gray-400">Wellness Streak</p>
              <p className="text-xl font-bold text-gray-800">{streak} days</p>
            </div>
          </div>
        </motion.header>

        {/* ── Today's Snapshot Row ─────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: <BookOpen className="w-5 h-5" />, count: journalCount, label: 'Journal Entries', sub: 'This week', color: 'text-sage', bg: 'bg-sage/10' },
            { icon: <MessageCircle className="w-5 h-5" />, count: ventSessions, label: 'Vent Sessions', sub: 'This month', color: 'text-indigo-500', bg: 'bg-indigo-50' },
            { icon: <Coffee className="w-5 h-5" />, count: stressBreaks, label: 'Stress Breaks', sub: 'Today', color: 'text-amber-500', bg: 'bg-amber-50' },
            { icon: <CheckCircle className="w-5 h-5" />, count: 5, label: 'Check-ins Done', sub: 'This week', color: 'text-blue-500', bg: 'bg-blue-50' },
          ].map((item, i) => (
            <motion.div key={i} variants={cardVariants} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all group">
              <div className={`w-10 h-10 ${item.bg} rounded-xl flex items-center justify-center ${item.color} mb-3 group-hover:scale-110 transition-transform`}>
                {item.icon}
              </div>
              <p className="text-3xl font-bold text-gray-800">{item.count}</p>
              <p className="text-sm font-medium text-gray-600 mt-0.5">{item.label}</p>
              <p className="text-xs text-gray-400">{item.sub}</p>
            </motion.div>
          ))}
        </div>

        {/* ── Mood Trend + Week Calendar Row ──────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Mood Trend Sparkline */}
          <motion.div variants={cardVariants} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-sage" /> Mood Trend
                </h2>
                <p className="text-sm text-gray-500">Your energy is rising this week 🌱</p>
              </div>
              <span className="px-3 py-1 bg-green-50 text-green-600 text-xs font-bold rounded-full border border-green-100">↑ Improving</span>
            </div>
            <div className="h-16 mb-4">
              <Sparkline data={moodData} color="#6B9E7A" height={64} />
            </div>
            <div className="flex justify-between text-xs text-gray-400">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => <span key={d}>{d}</span>)}
            </div>
          </motion.div>

          {/* Weekly Mood Calendar */}
          <motion.div variants={cardVariants} className="bg-gradient-to-br from-lavender/20 to-softBlue/20 rounded-3xl p-6 shadow-sm border border-lavender/30">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Sun className="w-5 h-5 text-amber-500" /> This Week's Vibe
            </h2>
            <div className="grid grid-cols-7 gap-1.5">
              {WEEK_MOODS.map((m, i) => (
                <motion.div
                  key={i}
                  className={`flex flex-col items-center p-2 rounded-2xl ${m.color} cursor-pointer hover:scale-110 transition-transform`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.06 }}
                  title={m.label}
                >
                  <span className="text-lg">{m.emoji}</span>
                  <span className="text-[10px] font-bold text-gray-500 mt-1">{m.day}</span>
                </motion.div>
              ))}
            </div>
            <p className="text-center text-sm text-gray-500 mt-4 italic">
              "This week felt mostly calm and growing."
            </p>
          </motion.div>
        </div>

        {/* ── Energy Balance (Burnout) + Journal Activity ──────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* Burnout / Energy Balance */}
          <motion.div variants={cardVariants} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 md:col-span-1">
            <h2 className="text-lg font-bold text-gray-800 mb-2 flex items-center gap-2">
              <Activity className="w-5 h-5 text-gray-400" /> Energy Balance
            </h2>
            <p className="text-xs text-gray-400 mb-6">You're navigating a busy season. Remember to pause. 🌿</p>
            <div className="flex justify-around">
              <RadialIndicator value={72} label="Resilience" color="#6B9E7A" />
              <RadialIndicator value={48} label="Rest Taken" color="#B8A9D9" />
              <RadialIndicator value={61} label="Balance" color="#93C5FD" />
            </div>
          </motion.div>

          {/* Journal Activity Sparkline */}
          <motion.div variants={cardVariants} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 md:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-sage" /> Reflection Consistency
                </h2>
                <p className="text-sm text-gray-500">You've written every day this week — incredible! 💚</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-sage">7/7</p>
                <p className="text-xs text-gray-400">Days active</p>
              </div>
            </div>
            <div className="h-16 mb-2">
              <Sparkline data={journalData} color="#6B9E7A" height={64} />
            </div>
            <div className="flex justify-between text-xs text-gray-400">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => <span key={d}>{d}</span>)}
            </div>
          </motion.div>
        </div>

        {/* ── Milestones Row ────────────────────────────────────────────────── */}
        <motion.div variants={cardVariants}>
          <div className="flex items-center justify-between mb-4 px-1">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" /> Milestones Unlocked
            </h2>
            <span className="text-xs text-gray-400">3 of 8 unlocked</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { icon: Cloud, label: 'First Vent', sub: 'Letting it out', color: 'text-sage', bg: 'bg-sage/10', unlocked: true },
              { icon: Moon, label: 'Quiet Mind', sub: '5 relaxations', color: 'text-indigo-400', bg: 'bg-indigo-50', unlocked: true },
              { icon: Heart, label: 'SOS Ready', sub: 'Circle set up', color: 'text-rose-400', bg: 'bg-rose-50', unlocked: true },
              { icon: Coffee, label: 'Deep Breaths', sub: '10 sessions · 7 to go', color: 'text-gray-300', bg: 'bg-gray-50', unlocked: false },
              { icon: Star, label: '7-Day Streak', sub: 'Keep going!', color: 'text-amber-400', bg: 'bg-amber-50', unlocked: true },
              { icon: BookOpen, label: '10 Journals', sub: '2 more to go', color: 'text-gray-300', bg: 'bg-gray-50', unlocked: false },
              { icon: Sparkles, label: 'Inner Glow', sub: '30-day streak', color: 'text-gray-300', bg: 'bg-gray-50', unlocked: false },
              { icon: Sun, label: 'Sunshine Soul', sub: 'Log 7 happy days', color: 'text-gray-300', bg: 'bg-gray-50', unlocked: false },
            ].map((m, i) => (
              <motion.div
                key={i}
                className={`bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center text-center ${m.unlocked ? 'hover:shadow-md hover:scale-[1.02]' : 'opacity-50 grayscale'} transition-all`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: m.unlocked ? 1 : 0.5, scale: 1 }}
                transition={{ delay: 0.6 + i * 0.05 }}
              >
                <div className={`w-12 h-12 ${m.bg} rounded-full flex items-center justify-center mb-2.5 ${m.color}`}>
                  <m.icon className="w-6 h-6" />
                </div>
                <p className={`text-sm font-bold ${m.unlocked ? 'text-gray-800' : 'text-gray-400'}`}>{m.label}</p>
                <p className="text-[10px] text-gray-400 mt-0.5 leading-tight">{m.sub}</p>
                {m.unlocked && <div className="w-1.5 h-1.5 bg-sage rounded-full mt-2" />}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── Daily Check-in Status ────────────────────────────────────────── */}
        <motion.div variants={cardVariants} className="bg-gradient-to-r from-sage/10 via-white to-lavender/20 rounded-3xl p-6 shadow-sm border border-sage/20">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-1">
                <CheckCircle className="w-5 h-5 text-sage" /> Today's Check-in
              </h2>
              <p className="text-gray-500 text-sm">You checked in at 8:42 AM. Your mood: <span className="font-semibold text-gray-700">Calm & Focused 😌</span></p>
            </div>
            <div className="flex flex-wrap gap-2">
              {['😔 Low', '😐 Neutral', '😌 Calm ✓', '😊 Good', '☀️ Great'].map((m, i) => (
                <span key={i} className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${i === 2 ? 'bg-sage text-white border-sage shadow-sm' : 'bg-white text-gray-500 border-gray-200'}`}>
                  {m}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── Encouragement Footer Card ────────────────────────────────────── */}
        <motion.div variants={cardVariants} className="bg-gray-900 text-white rounded-3xl p-8 text-center shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-1/4 w-48 h-48 bg-sage/20 rounded-full filter blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-lavender/30 rounded-full filter blur-3xl" />
          <div className="relative z-10">
            <Sparkles className="w-10 h-10 mx-auto mb-3 text-amber-300" />
            <h3 className="text-2xl font-bold mb-2">You're doing wonderful.</h3>
            <p className="text-gray-400 text-lg max-w-md mx-auto">
              Taking care of your mind is the most meaningful thing you can do. Every check-in, every breath, every reflection counts.
            </p>
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
}
