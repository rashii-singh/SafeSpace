import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RefreshCw, Wind, Music, Timer, Heart, Sparkles, Coffee, Check } from 'lucide-react';

// ─── Breathing Phase Config ──────────────────────────────────────────────────
const BREATHING_PHASES = [
  { label: 'Inhale', duration: 4, scale: 1.35, color: '#9EB384' },
  { label: 'Hold', duration: 7, scale: 1.35, color: '#B8A9D9' },
  { label: 'Exhale', duration: 8, scale: 1.0, color: '#AEC6CF' },
];

// ─── Animated Breathing Orb ──────────────────────────────────────────────────
function BreathingOrb({ isRunning }) {
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [countdown, setCountdown] = useState(BREATHING_PHASES[0].duration);
  const phase = BREATHING_PHASES[phaseIdx];

  useEffect(() => {
    if (!isRunning) { setPhaseIdx(0); setCountdown(BREATHING_PHASES[0].duration); return; }
    if (countdown <= 0) {
      const next = (phaseIdx + 1) % BREATHING_PHASES.length;
      setPhaseIdx(next);
      setCountdown(BREATHING_PHASES[next].duration);
      return;
    }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [isRunning, countdown, phaseIdx]);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative w-52 h-52 flex items-center justify-center">
        {/* Outer pulse ring */}
        {isRunning && (
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ background: `${phase.color}30` }}
            animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.1, 0.4] }}
            transition={{ duration: phase.duration, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}
        {/* Main orb */}
        <motion.div
          className="w-40 h-40 rounded-full shadow-2xl flex flex-col items-center justify-center cursor-default select-none"
          style={{ background: `radial-gradient(circle at 35% 35%, ${phase.color}dd, ${phase.color}88)` }}
          animate={isRunning ? { scale: phase.scale } : { scale: 1 }}
          transition={{ duration: phase.duration, ease: phase.label === 'Hold' ? 'linear' : 'easeInOut' }}
        >
          <span className="text-white text-4xl font-bold">{countdown}</span>
          <span className="text-white/80 text-sm font-semibold mt-1">{isRunning ? phase.label : 'Ready'}</span>
        </motion.div>
      </div>
      {/* Phase dots */}
      <div className="flex gap-2">
        {BREATHING_PHASES.map((p, i) => (
          <div key={p.label} className="flex items-center gap-1.5">
            <motion.div
              className="w-2.5 h-2.5 rounded-full transition-colors"
              style={{ backgroundColor: isRunning && i === phaseIdx ? p.color : '#e5e7eb' }}
              animate={isRunning && i === phaseIdx ? { scale: [1, 1.3, 1] } : { scale: 1 }}
              transition={{ repeat: Infinity, duration: 1 }}
            />
            <span className="text-xs text-gray-400">{p.label} {p.duration}s</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Countdown Timer ─────────────────────────────────────────────────────────
function CountdownTimer({ initialSeconds, isRunning, onComplete }) {
  const [seconds, setSeconds] = useState(initialSeconds);
  useEffect(() => {
    if (!isRunning) return;
    if (seconds <= 0) { onComplete(); return; }
    const t = setInterval(() => setSeconds(s => s - 1), 1000);
    return () => clearInterval(t);
  }, [isRunning, seconds, onComplete]);
  useEffect(() => { if (!isRunning) setSeconds(initialSeconds); }, [isRunning, initialSeconds]);
  const pct = ((initialSeconds - seconds) / initialSeconds) * 100;
  const r = 44; const circ = 2 * Math.PI * r;
  const mm = Math.floor(seconds / 60), ss = seconds % 60;
  return (
    <div className="relative w-28 h-28 flex-shrink-0">
      <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
        <circle cx="50" cy="50" r={r} fill="none" stroke="#f3f4f6" strokeWidth="7" />
        <motion.circle cx="50" cy="50" r={r} fill="none" stroke="#9EB384" strokeWidth="7"
          strokeLinecap="round" strokeDasharray={circ}
          animate={{ strokeDashoffset: circ - (pct / 100) * circ }}
          transition={{ duration: 0.8 }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xl font-bold text-gray-700">{mm}:{ss.toString().padStart(2, '0')}</span>
      </div>
    </div>
  );
}

// ─── Grounding Step Cards ────────────────────────────────────────────────────
const GROUNDING_STEPS = [
  { n: 5, emoji: '👁️', sense: 'things you can SEE', color: 'bg-blue-50 text-blue-700' },
  { n: 4, emoji: '✋', sense: 'things you can TOUCH', color: 'bg-amber-50 text-amber-700' },
  { n: 3, emoji: '👂', sense: 'things you can HEAR', color: 'bg-indigo-50 text-indigo-700' },
  { n: 2, emoji: '👃', sense: 'things you can SMELL', color: 'bg-green-50 text-green-700' },
  { n: 1, emoji: '👅', sense: 'thing you can TASTE', color: 'bg-rose-50 text-rose-700' },
];

// ─── Sound Tiles ─────────────────────────────────────────────────────────────
const SOUNDS = [
  { label: 'Rain', emoji: '🌧️', color: 'bg-blue-50' },
  { label: 'Ocean', emoji: '🌊', color: 'bg-softBlue/20' },
  { label: 'Forest', emoji: '🌿', color: 'bg-green-50' },
  { label: 'Fireplace', emoji: '🔥', color: 'bg-amber-50' },
  { label: 'Wind', emoji: '💨', color: 'bg-gray-50' },
  { label: 'White Noise', emoji: '🎶', color: 'bg-lavender/30' },
];

// ─── Main Component ──────────────────────────────────────────────────────────
export default function StressBreak() {
  const [breathingOn, setBreathingOn] = useState(false);
  const [focusOn, setFocusOn] = useState(false);
  const [activeSound, setActiveSound] = useState(null);
  const [groundingStep, setGroundingStep] = useState(0);
  const [groundingActive, setGroundingActive] = useState(false);
  const [completedGrounding, setCompletedGrounding] = useState(false);

  const handleGroundingNext = () => {
    if (groundingStep < GROUNDING_STEPS.length - 1) setGroundingStep(s => s + 1);
    else setCompletedGrounding(true);
  };

  const resetGrounding = () => { setGroundingStep(0); setGroundingActive(false); setCompletedGrounding(false); };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream to-softBlue/10 pb-28">
      {/* Header */}
      <header className="px-6 py-10 text-center">
        <div className="w-14 h-14 bg-sage/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Coffee className="w-7 h-7 text-sage" />
        </div>
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Stress Break</h1>
        <p className="text-gray-500 text-lg">A moment just for you. Breathe, ground, reset.</p>
      </header>

      <div className="max-w-4xl mx-auto px-4 space-y-6">

        {/* ── 4-7-8 Breathing Exercise ── */}
        <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-sage/10 rounded-xl flex items-center justify-center">
              <Wind className="w-5 h-5 text-sage" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">4-7-8 Breathing</h2>
              <p className="text-sm text-gray-500">A natural tranquilizer for the nervous system</p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-6">
            <BreathingOrb isRunning={breathingOn} />
            <div className="flex gap-3">
              <button
                onClick={() => setBreathingOn(v => !v)}
                className={`px-8 py-3 rounded-full font-semibold text-sm flex items-center gap-2 shadow-sm transition-all ${
                  breathingOn ? 'bg-rose-100 text-rose-600 hover:bg-rose-200' : 'bg-sage text-white hover:bg-sage/90'
                }`}
              >
                {breathingOn ? <><Pause className="w-4 h-4" /> Pause</> : <><Play className="w-4 h-4" /> Begin</>}
              </button>
              {breathingOn && (
                <button onClick={() => setBreathingOn(false)} className="px-5 py-3 bg-gray-100 text-gray-600 rounded-full font-semibold text-sm hover:bg-gray-200 transition-all">
                  Stop
                </button>
              )}
            </div>
            <p className="text-xs text-gray-400 text-center max-w-xs">Inhale through your nose for 4s → Hold for 7s → Exhale through your mouth for 8s</p>
          </div>
        </section>

        {/* ── Focus Timer + Grounding Side-by-Side ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Pomodoro Focus Timer */}
          <section className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
                <Timer className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-800">Focus Timer</h2>
                <p className="text-xs text-gray-400">25 min work · 5 min rest</p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-5">
              <CountdownTimer initialSeconds={1500} isRunning={focusOn} onComplete={() => setFocusOn(false)} />
              <button
                onClick={() => setFocusOn(v => !v)}
                className={`w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
                  focusOn ? 'bg-rose-50 text-rose-600 hover:bg-rose-100' : 'bg-gray-900 text-white hover:bg-gray-800'
                }`}
              >
                {focusOn ? <><Pause className="w-4 h-4" /> Pause</> : <><Play className="w-4 h-4" /> Start Focus</>}
              </button>
            </div>
          </section>

          {/* 5-4-3-2-1 Grounding */}
          <section className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center">
                <Heart className="w-5 h-5 text-rose-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-800">5-4-3-2-1 Grounding</h2>
                <p className="text-xs text-gray-400">Return to the present moment</p>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {!groundingActive && !completedGrounding ? (
                <motion.div key="start" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <p className="text-sm text-gray-500 mb-4">Use your senses to anchor yourself to the here and now.</p>
                  <button onClick={() => setGroundingActive(true)} className="w-full py-3 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-xl font-semibold text-sm transition-all">
                    Start Grounding
                  </button>
                </motion.div>
              ) : completedGrounding ? (
                <motion.div key="done" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center py-4">
                  <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Check className="w-6 h-6 text-green-500" />
                  </div>
                  <p className="font-bold text-gray-800 mb-1">You're grounded. 🌿</p>
                  <p className="text-sm text-gray-500 mb-4">Take a deep breath. You are here and you are safe.</p>
                  <button onClick={resetGrounding} className="text-sm text-gray-400 hover:text-gray-600 transition-colors flex items-center gap-1 mx-auto">
                    <RefreshCw className="w-3 h-3" /> Restart
                  </button>
                </motion.div>
              ) : (
                <motion.div key={groundingStep} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <div className={`p-4 rounded-2xl mb-4 ${GROUNDING_STEPS[groundingStep].color}`}>
                    <span className="text-3xl block text-center mb-1">{GROUNDING_STEPS[groundingStep].emoji}</span>
                    <p className="text-center font-semibold text-sm">
                      Name <span className="text-lg font-bold">{GROUNDING_STEPS[groundingStep].n}</span> {GROUNDING_STEPS[groundingStep].sense}
                    </p>
                  </div>
                  <div className="flex gap-2 mb-3">
                    {GROUNDING_STEPS.map((_, i) => (
                      <div key={i} className={`flex-1 h-1 rounded-full transition-colors ${i <= groundingStep ? 'bg-sage' : 'bg-gray-100'}`} />
                    ))}
                  </div>
                  <button onClick={handleGroundingNext} className="w-full py-3 bg-gray-900 text-white rounded-xl font-semibold text-sm transition-all hover:bg-gray-800">
                    {groundingStep < GROUNDING_STEPS.length - 1 ? 'Next →' : 'Done ✓'}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        </div>

        {/* ── Calming Sounds ── */}
        <section className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
              <Music className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">Ambient Sounds</h2>
              <p className="text-xs text-gray-400">Tap to select a sound environment</p>
            </div>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {SOUNDS.map(s => (
              <button
                key={s.label}
                onClick={() => setActiveSound(activeSound === s.label ? null : s.label)}
                className={`flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all ${
                  activeSound === s.label ? 'border-sage bg-sage/5 shadow-sm' : 'border-gray-100 hover:border-sage/30'
                }`}
              >
                <span className="text-2xl">{s.emoji}</span>
                <span className="text-[11px] font-semibold text-gray-600">{s.label}</span>
                {activeSound === s.label && (
                  <motion.div className="flex gap-0.5" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    {[0, 1, 2].map(i => (
                      <motion.div key={i} className="w-0.5 h-3 bg-sage rounded-full"
                        animate={{ scaleY: [1, 2.5, 1] }}
                        transition={{ repeat: Infinity, duration: 0.7, delay: i * 0.15 }}
                      />
                    ))}
                  </motion.div>
                )}
              </button>
            ))}
          </div>
          {activeSound && (
            <p className="text-xs text-center text-gray-400 mt-3 animate-pulse">🎵 {activeSound} is playing...</p>
          )}
        </section>

        {/* ── Quick Resets ── */}
        <section className="bg-gradient-to-r from-sage/10 to-softBlue/10 rounded-3xl p-6 border border-sage/20">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
              <Sparkles className="w-5 h-5 text-amber-400" />
            </div>
            <h2 className="text-lg font-bold text-gray-800">2-Minute Resets</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Stretch', emoji: '🙆', desc: 'Roll shoulders slowly' },
              { label: 'Drink Water', emoji: '💧', desc: 'Hydrate & breathe' },
              { label: 'Step Outside', emoji: '🌤️', desc: 'Fresh air helps' },
              { label: 'Mini-Meditation', emoji: '🧘', desc: 'Close eyes 2 mins' },
            ].map(a => (
              <div key={a.label} className="bg-white rounded-2xl p-4 text-center shadow-sm border border-white hover:shadow-md transition-all cursor-pointer group">
                <span className="text-2xl block mb-1 group-hover:scale-125 transition-transform">{a.emoji}</span>
                <p className="font-semibold text-gray-800 text-sm">{a.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{a.desc}</p>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
