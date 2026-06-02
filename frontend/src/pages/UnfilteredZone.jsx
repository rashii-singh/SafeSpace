import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Paperclip, Send, ImageIcon, X, Sparkles, Heart, Shield, Lock, RefreshCw, Volume2 } from 'lucide-react';
import useAppStore from '../store/useAppStore';
import { sendChatMessage } from '../services/aiService';
import useSpeech from '../hooks/useSpeech';

// ─── Simulated companion responses ───────────────────────────────────────────
const listenFirstResponses = [
  "I'm here with you. Take all the time you need. 💙",
  "That sounds really heavy. Thank you for sharing it with me.",
  "I hear you. Your feelings are completely valid.",
  "I'm listening. Please continue — I'm right here.",
  "It takes courage to say that out loud. I'm glad you did.",
];

const supportResponses = [
  "What you're feeling makes so much sense given everything you've been through.",
  "You don't have to have it all figured out. Just being here is enough.",
  "That sounds exhausting. You deserve rest and gentleness, not judgment.",
  "It's okay to feel this way. Emotions aren't problems to fix — they're things to feel.",
];

const adviceResponses = [
  "Since you asked — one thing that often helps is giving yourself permission to step away, even for two minutes. Would you like to try a quick breathing exercise together?",
  "Sometimes writing down just three things that feel stable right now can anchor us. What might those be for you?",
  "It sounds like your body might need some movement. Even a slow walk can shift things. Would you like a quick reset activity?",
];

function getResponse(text, mode) {
  if (mode === 'vent') return listenFirstResponses[Math.floor(Math.random() * listenFirstResponses.length)];
  if (text.toLowerCase().includes('advice') || text.toLowerCase().includes('what should') || text.toLowerCase().includes('help me'))
    return adviceResponses[Math.floor(Math.random() * adviceResponses.length)];
  return supportResponses[Math.floor(Math.random() * supportResponses.length)];
}

// ─── Message Bubble ────────────────────────────────────────────────────────
function MessageBubble({ msg }) {
  const isUser = msg.role === 'user';
  return (
    <motion.div
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
      initial={{ opacity: 0, y: 12, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sage to-softBlue flex items-center justify-center flex-shrink-0 shadow-sm text-white text-sm">
          🤍
        </div>
      )}
      <div className={`max-w-[75%] space-y-1 ${isUser ? 'items-end' : 'items-start'} flex flex-col`}>
        <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
          isUser
            ? 'bg-gray-900 text-white rounded-tr-sm'
            : 'bg-white text-gray-700 border border-gray-100 rounded-tl-sm'
        }`}>
          {msg.type === 'image' ? (
            <div className="space-y-1">
              <div className="w-40 h-28 bg-gray-100 rounded-xl flex items-center justify-center">
                <ImageIcon className="w-8 h-8 text-gray-300" />
              </div>
              <p className="text-xs opacity-70">Image shared</p>
            </div>
          ) : (
            msg.text
          )}
        </div>
        <span className="text-[10px] text-gray-400 px-1">{msg.time}</span>
      </div>
    </motion.div>
  );
}

// ─── Typing Indicator ──────────────────────────────────────────────────────
function TypingIndicator() {
  return (
    <motion.div className="flex gap-3 items-end" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sage to-softBlue flex items-center justify-center flex-shrink-0 text-white text-sm">🤍</div>
      <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm flex gap-1 items-center">
        {[0, 1, 2].map(i => (
          <motion.div key={i} className="w-2 h-2 bg-sage rounded-full"
            animate={{ y: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }}
          />
        ))}
      </div>
    </motion.div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function UnfilteredZone() {
  const { companionName } = useAppStore();
  const name = companionName || 'Unfiltered Zone';

  const [messages, setMessages] = useState([
    {
      id: 1, role: 'companion', type: 'text',
      text: `Hey, I'm ${name}. This is your space — completely private and judgment-free. You can type, speak, or share anything you're feeling. I'm here to listen first. 💙`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ]);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [mode, setMode] = useState('vent'); // 'vent' | 'support' | 'advice'
  const bottomRef = useRef(null);
  const fileRef = useRef(null);

  const { isListening, isSpeaking, transcript: voiceTranscript, startListening, stopListening, speak, stopSpeaking, error } = useSpeech();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, isSpeaking]);

  // Sync voice transcript to input while listening
  useEffect(() => {
    if (isListening) {
      setInput(voiceTranscript);
    }
  }, [voiceTranscript, isListening]);

  const sendMessage = async (text, type = 'text') => {
    if (!text.trim() && type === 'text') return;

    const userMsg = {
      id: Date.now(), role: 'user', type,
      text: type === 'image' ? '' : text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      // Build history for context (excluding images for now)
      const history = messages.filter(m => m.type === 'text').map(m => ({ role: m.role, text: m.text }));
      
      const replyText = await sendChatMessage(history, text, mode);
      
      if (type === 'voice') {
        speak(replyText);
      }
      
      const reply = {
        id: Date.now() + 1, role: 'companion', type: 'text',
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, reply]);
    } catch (err) {
      console.error(err);
      const fallback = {
        id: Date.now() + 1, role: 'companion', type: 'text',
        text: "I'm having trouble connecting right now, but I'm still here listening. 💙",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, fallback]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) sendMessage('', 'image');
  };

  const toggleRecording = () => {
    if (isListening) {
      stopListening();
      if (input.trim()) {
        sendMessage(input, 'voice');
      }
    } else {
      stopSpeaking(); // stop any ongoing AI speech
      if (input.trim()) {
        sendMessage(input, 'voice'); // if there's text left over, send it
      } else {
        startListening();
      }
    }
  };

  const handleStopSpeaking = () => {
    stopSpeaking();
  };

  return (
    <div className="h-screen flex flex-col bg-cream overflow-hidden">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="bg-white/90 backdrop-blur-md border-b border-gray-100 px-4 py-3 flex items-center gap-3 shadow-sm flex-shrink-0">
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sage to-softBlue flex items-center justify-center text-white text-lg shadow">🤍</div>
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-white" />
        </div>
        <div className="flex-1">
          <h1 className="font-bold text-gray-800 text-base leading-tight">{name}</h1>
          <p className="text-xs text-green-500 font-medium">Active Listening Mode</p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-400 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
          <Lock className="w-3 h-3" /> Private & Secure
        </div>
      </div>

      {/* ── Mode Pills ─────────────────────────────────────────────────── */}
      <div className="flex gap-2 px-4 py-2.5 bg-white/60 border-b border-gray-100 flex-shrink-0 overflow-x-auto">
        {[
          { id: 'vent', label: '💬 Just Venting', desc: 'I only need to be heard' },
          { id: 'support', label: '🤗 Need Support', desc: 'Validate my feelings' },
          { id: 'advice', label: '💡 Ask for Advice', desc: 'Give me suggestions' },
        ].map(m => (
          <button
            key={m.id}
            onClick={() => setMode(m.id)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              mode === m.id ? 'bg-sage text-white border-sage shadow-sm' : 'bg-white text-gray-500 border-gray-200 hover:border-sage/40'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* ── Chat Feed ─────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map(msg => <MessageBubble key={msg.id} msg={msg} />)}
        <AnimatePresence>{isTyping && <TypingIndicator />}</AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* ── Recording/Speaking Indicator ───────────────────────────────────────── */}
      <AnimatePresence>
        {(isListening || error) && (
          <motion.div
            className="mx-4 mb-2 px-4 py-2.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
          >
            {isListening && <motion.div className="w-3 h-3 bg-rose-500 rounded-full" animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 1 }} />}
            <span className="text-sm text-rose-600 font-medium flex-1">
              {error ? `Microphone Error: ${error}` : 'Listening... Tap mic to stop and send.'}
            </span>
            <button onClick={() => { stopListening(); if (error) window.location.reload(); }} className="text-rose-400 hover:text-rose-600"><X className="w-4 h-4" /></button>
          </motion.div>
        )}
        
        {isSpeaking && (
          <motion.div
            className="mx-4 mb-2 px-4 py-2.5 bg-lavender/50 border border-lavender rounded-2xl flex items-center gap-3"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
          >
            <Volume2 className="w-4 h-4 text-indigo-500 animate-pulse" />
            <span className="text-sm text-indigo-700 font-medium flex-1">Companion is speaking...</span>
            <button onClick={handleStopSpeaking} className="text-indigo-400 hover:text-indigo-600"><X className="w-4 h-4" /></button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Input Area ────────────────────────────────────────────────── */}
      <div className="bg-white/90 backdrop-blur-md border-t border-gray-100 px-3 py-3 flex-shrink-0">
        <div className="flex items-end gap-2 bg-gray-50 border border-gray-200 rounded-2xl px-3 py-2 focus-within:border-sage/50 focus-within:ring-2 focus-within:ring-sage/10 transition-all">
          {/* Upload button */}
          <button onClick={() => fileRef.current?.click()} className="p-1.5 text-gray-400 hover:text-sage transition-colors flex-shrink-0 self-center">
            <Paperclip className="w-5 h-5" />
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />

          {/* Text Input */}
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input); } }}
            placeholder={`Share anything with ${name}...`}
            rows={1}
            className="flex-1 bg-transparent resize-none outline-none text-sm text-gray-800 placeholder-gray-400 py-1 max-h-32 leading-relaxed"
            style={{ minHeight: '24px' }}
          />

          {/* Voice Button */}
          <button
            onClick={toggleRecording}
            className={`p-1.5 rounded-full transition-all flex-shrink-0 self-center ${isListening ? 'text-rose-500 bg-rose-50' : 'text-gray-400 hover:text-sage'}`}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Send Button */}
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() && !isListening}
            className="p-2 bg-sage text-white rounded-xl disabled:opacity-30 hover:bg-sage/90 transition-all flex-shrink-0 self-center shadow-sm hover:shadow-md"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        {/* Privacy indicators */}
        <div className="flex items-center justify-center gap-4 mt-2">
          {[
            { icon: Lock, label: 'Private' },
            { icon: Shield, label: 'Secure' },
            { icon: Heart, label: 'Judgment Free' },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-1 text-[10px] text-gray-400">
              <Icon className="w-2.5 h-2.5" /> {label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
