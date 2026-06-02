import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, MessageCircle, Coffee, Heart, BookOpen, Sparkles, ArrowRight, Activity, Users } from 'lucide-react';
import useAppStore from '../store/useAppStore';

const affirmations = [
  "You are enough, just as you are.",
  "Every breath grounds you in the present.",
  "Kindness to yourself is a superpower.",
  "Small steps create big change.",
  "Your feelings are valid and worthy of care.",
];

const QUICK_ACTIONS = [
  { to: '/vent',         icon: MessageCircle, label: 'Unfiltered Zone', sub: 'Talk to your companion', color: 'text-indigo-500', bg: 'bg-indigo-50', hover: 'hover:bg-indigo-50' },
  { to: '/journal',      icon: BookOpen,      label: 'AI Journal',      sub: 'Reflect on your day',    color: 'text-sage',       bg: 'bg-sage/10',    hover: 'hover:bg-sage/5' },
  { to: '/stress-break', icon: Coffee,        label: 'Stress Break',    sub: 'Breathe & reset',       color: 'text-amber-500',  bg: 'bg-amber-50',   hover: 'hover:bg-amber-50' },
  { to: '/support',      icon: Users,         label: 'Professionals',   sub: 'Talk to a human',       color: 'text-blue-500',   bg: 'bg-blue-50',    hover: 'hover:bg-blue-50' },
];

const recentActivity = [
  { id: 1, title: 'Morning reflections', snippet: 'I felt a gentle calm after my breathing exercise.', date: 'Today, 9:12 AM', icon: BookOpen, color: 'text-sage', bg: 'bg-sage/10' },
  { id: 2, title: 'Evening vent session', snippet: 'Work was stressful but I let it out here. Feeling lighter.', date: 'Yesterday', icon: MessageCircle, color: 'text-indigo-400', bg: 'bg-indigo-50' },
];

export default function Dashboard() {
  const { user, companionName } = useAppStore();
  const name = user?.name || 'Friend';
  const companion = companionName || 'Unfiltered Zone';
  const [affirmation, setAffirmation] = useState('');

  useEffect(() => {
    setAffirmation(affirmations[Math.floor(Math.random() * affirmations.length)]);
  }, []);

  const timeOfDay = () => {
    const h = new Date().getHours();
    if (h < 12) return 'morning';
    if (h < 18) return 'afternoon';
    return 'evening';
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } }
  };

  return (
    <div className="min-h-screen bg-cream pb-28">
      <motion.div className="max-w-2xl mx-auto px-4 py-8 space-y-6" variants={containerVariants} initial="hidden" animate="show">

        {/* ── Greeting ─────────────────────────────────────────────────── */}
        <motion.section variants={itemVariants} className="pt-2">
          <p className="text-sm text-gray-400 font-medium mb-1">Good {timeOfDay()}</p>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-1">{name} 👋</h1>
          <p className="text-gray-500">{companion} is here to walk with you today.</p>
        </motion.section>

        {/* ── Affirmation Card ─────────────────────────────────────────── */}
        <motion.section variants={itemVariants} className="bg-gradient-to-br from-sage/15 to-softBlue/15 rounded-3xl p-6 border border-sage/20 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Daily Affirmation</span>
          </div>
          <p className="text-gray-700 text-lg font-medium leading-relaxed italic">"{affirmation}"</p>
        </motion.section>

        {/* ── Quick Actions ─────────────────────────────────────────────── */}
        <motion.section variants={itemVariants}>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 px-1">Quick Access</h2>
          <div className="grid grid-cols-2 gap-3">
            {QUICK_ACTIONS.map(({ to, icon: Icon, label, sub, color, bg, hover }) => (
              <Link
                key={to}
                to={to}
                className={`flex flex-col p-5 bg-white rounded-2xl shadow-sm border border-gray-100 ${hover} transition-all hover:shadow-md hover:-translate-y-0.5 group`}
              >
                <div className={`w-11 h-11 ${bg} rounded-xl flex items-center justify-center mb-3 ${color} group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
                <p className="font-semibold text-gray-800 text-sm">{label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
              </Link>
            ))}
          </div>
        </motion.section>

        {/* ── Today's Snapshot ─────────────────────────────────────────── */}
        <motion.section variants={itemVariants} className="grid grid-cols-3 gap-3">
          {[
            { label: 'Day Streak', value: '7 🔥', sub: 'Keep it up!' },
            { label: 'Check-in', value: '✓ Done', sub: 'At 8:42 AM' },
            { label: 'Mood', value: '😌 Calm', sub: 'Feeling balanced' },
          ].map(({ label, value, sub }) => (
            <div key={label} className="bg-white rounded-2xl p-4 text-center shadow-sm border border-gray-100">
              <p className="text-lg font-bold text-gray-800">{value}</p>
              <p className="text-[11px] font-semibold text-gray-500 mt-0.5">{label}</p>
              <p className="text-[10px] text-gray-400">{sub}</p>
            </div>
          ))}
        </motion.section>

        {/* ── Recent Activity ────────────────────────────────────────────── */}
        <motion.section variants={itemVariants}>
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Recent Activity</h2>
            <Link to="/analytics" className="text-xs text-sage font-medium flex items-center gap-1 hover:underline">
              View Journey <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {recentActivity.map(entry => (
              <div key={entry.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-3 hover:shadow-md transition-shadow">
                <div className={`w-9 h-9 ${entry.bg} rounded-xl flex items-center justify-center flex-shrink-0 ${entry.color}`}>
                  <entry.icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <p className="font-semibold text-gray-800 text-sm truncate">{entry.title}</p>
                    <span className="text-xs text-gray-400 flex-shrink-0 ml-2">{entry.date}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed line-clamp-1">{entry.snippet}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* ── Insights CTA ─────────────────────────────────────────────── */}
        <motion.section variants={itemVariants}>
          <Link
            to="/analytics"
            className="flex items-center justify-between bg-gray-900 text-white rounded-2xl p-5 hover:bg-gray-800 transition-colors shadow-lg group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-bold">Your Wellness Journey</p>
                <p className="text-xs text-gray-400">Mood trends, streaks & milestones</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.section>

      </motion.div>
    </div>
  );
}
