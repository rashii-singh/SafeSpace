import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, X, Sparkles, Loader2 } from 'lucide-react';
import useSpeech from '../../hooks/useSpeech';
import { sendChatMessage } from '../../services/aiService';

export default function VoiceInteractionModal({ isOpen, onClose }) {
  const [stage, setStage] = useState('listening'); // 'listening' | 'processing' | 'speaking'
  const [displayTranscript, setDisplayTranscript] = useState('');

  const { isListening, isSpeaking, transcript: voiceTranscript, startListening, stopListening, speak, stopSpeaking, resetTranscript, error } = useSpeech();

  // Handle modal open/close
  useEffect(() => {
    if (isOpen) {
      setStage('listening');
      setDisplayTranscript('Listening...');
      resetTranscript();
      // Small delay to ensure modal is rendered before starting mic
      setTimeout(() => startListening(), 300);
    } else {
      stopListening();
      stopSpeaking();
    }
  }, [isOpen, startListening, stopListening, stopSpeaking, resetTranscript]);

  // Sync live transcript
  useEffect(() => {
    if (isListening && voiceTranscript) {
      setDisplayTranscript(voiceTranscript);
    }
  }, [isListening, voiceTranscript]);

  // Handle completion of speech
  useEffect(() => {
    // When listening stops automatically (or manually) and we have text
    if (!isListening && voiceTranscript && stage === 'listening') {
      const processVoice = async () => {
        setStage('processing');
        try {
          const replyText = await sendChatMessage([], voiceTranscript, 'vent');
          setStage('speaking');
          setDisplayTranscript(replyText);
          speak(replyText);
        } catch (err) {
          console.error(err);
          setStage('speaking');
          setDisplayTranscript("I'm sorry, I'm having trouble connecting right now.");
        }
      };
      processVoice();
    }
  }, [isListening, voiceTranscript, stage, speak]);

  // Handle end of speaking
  useEffect(() => {
    if (stage === 'speaking' && !isSpeaking) {
      // You could close here, or let the user close it. We'll let the user close.
    }
  }, [isSpeaking, stage]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex flex-col items-center justify-end md:justify-center p-4 md:p-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white/90 w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl relative border border-white"
          initial={{ y: '100%', scale: 0.9 }}
          animate={{ y: 0, scale: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col items-center mt-4">
            {/* Companion Indicator */}
            <div className="flex items-center gap-2 mb-8 bg-sage/10 px-4 py-1.5 rounded-full border border-sage/20">
              <Sparkles className="w-4 h-4 text-sage" />
              <span className="text-sage font-medium text-sm">Companion is {stage}</span>
            </div>

            {/* Voice Visualization */}
            <div className="relative w-32 h-32 flex items-center justify-center mb-8">
              {stage === 'listening' && (
                <>
                  <motion.div
                    className="absolute inset-0 bg-sage/20 rounded-full"
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                  />
                  <motion.div
                    className="absolute inset-2 bg-sage/30 rounded-full"
                    animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0.2, 0.6] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut', delay: 0.2 }}
                  />
                </>
              )}
              {stage === 'processing' && (
                <motion.div
                  className="absolute inset-0 border-4 border-sage/40 border-t-sage rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                />
              )}
              {stage === 'speaking' && (
                <motion.div
                  className="absolute inset-2 bg-lavender/40 rounded-full"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 1, ease: 'easeInOut' }}
                />
              )}
              
              <div className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-colors duration-500 ${stage === 'speaking' ? 'bg-lavender text-white' : 'bg-sage text-white'}`}>
                <Mic className="w-8 h-8" />
              </div>
            </div>

            {/* Transcript */}
            <motion.div 
              key={displayTranscript}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="min-h-[80px] flex items-center justify-center w-full"
            >
              <p className={`text-center text-lg leading-relaxed ${stage === 'listening' ? 'text-gray-400 italic' : 'text-gray-700 font-medium'}`}>
                "{displayTranscript}"
              </p>
            </motion.div>
            
            {/* End interaction button */}
            <button
              onClick={onClose}
              className="mt-8 px-8 py-3 bg-gray-900 text-white rounded-full font-semibold hover:bg-gray-800 transition-colors shadow-md"
            >
              End Conversation
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
