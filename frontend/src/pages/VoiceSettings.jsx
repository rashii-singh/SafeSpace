import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Mic, User, Volume2, Save, Play } from 'lucide-react';
import VoiceInteractionModal from '../components/voice/VoiceInteractionModal';
import useAppStore from '../store/useAppStore';

export default function VoiceSettings() {
  const store = useAppStore();
  
  const [companionName, setCompanionName] = useState(store.companionName || 'Unfiltered Zone');
  const [wakeWordEnabled, setWakeWordEnabled] = useState(store.wakeWordEnabled ?? true);
  const [wakeWord, setWakeWord] = useState(store.wakeWord || 'Hey Unfiltered Zone');
  const [voicePersonality, setVoicePersonality] = useState(store.voicePersonality || 'warm');
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    store.updateVoiceSettings({
      companionName,
      wakeWordEnabled,
      wakeWord,
      voicePersonality
    });
    alert('Voice settings saved successfully!');
  };

  return (
    <motion.div
      className="min-h-screen bg-cream p-6 md:p-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-sage/10 rounded-2xl flex items-center justify-center">
            <Mic className="w-6 h-6 text-sage" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Voice Settings</h1>
            <p className="text-gray-500">Configure how you interact with your companion</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-8">
          {/* Companion Name Section */}
          <section className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-6">
              <User className="w-5 h-5 text-sage" /> Companion Identity
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Companion Name</label>
                <input
                  type="text"
                  value={companionName}
                  onChange={(e) => {
                    setCompanionName(e.target.value);
                    if (wakeWord === `Hey ${companionName}`) {
                      setWakeWord(`Hey ${e.target.value}`);
                    }
                  }}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/50 focus:border-sage transition-all"
                  placeholder="e.g., Aria, Sage, Companion"
                />
                <p className="mt-2 text-sm text-gray-500">Give your AI companion a personalized name.</p>
              </div>
            </div>
          </section>

          {/* Wake Word Configuration */}
          <section className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <Mic className="w-5 h-5 text-sage" /> Wake Word
              </h2>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={wakeWordEnabled}
                  onChange={(e) => setWakeWordEnabled(e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sage"></div>
              </label>
            </div>
            
            <div className={`space-y-4 transition-opacity duration-300 ${wakeWordEnabled ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Custom Wake Phrase</label>
                <input
                  type="text"
                  value={wakeWord}
                  onChange={(e) => setWakeWord(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/50 focus:border-sage transition-all"
                  placeholder="e.g., Hey Aria"
                />
                <p className="mt-2 text-sm text-gray-500">Say this phrase anytime to activate voice interaction.</p>
              </div>
            </div>
          </section>

          {/* Voice Personality */}
          <section className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-6">
              <Volume2 className="w-5 h-5 text-sage" /> Voice Personality
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { id: 'warm', label: 'Warm & Empathetic', desc: 'Soft, comforting tone' },
                { id: 'calm', label: 'Calm & Grounded', desc: 'Steady, relaxing voice' },
                { id: 'energetic', label: 'Uplifting', desc: 'Bright, encouraging tone' }
              ].map(voice => (
                <div 
                  key={voice.id}
                  onClick={() => setVoicePersonality(voice.id)}
                  className={`cursor-pointer p-4 rounded-2xl border-2 transition-all ${
                    voicePersonality === voice.id 
                      ? 'border-sage bg-sage/5 shadow-sm' 
                      : 'border-gray-100 hover:border-sage/30 hover:bg-gray-50'
                  }`}
                >
                  <p className="font-semibold text-gray-800 mb-1">{voice.label}</p>
                  <p className="text-xs text-gray-500">{voice.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              type="button"
              onClick={() => setIsTestModalOpen(true)}
              className="flex-1 py-4 flex items-center justify-center gap-2 bg-lavender/30 text-gray-800 font-semibold rounded-2xl hover:bg-lavender/50 transition-colors border border-lavender"
            >
              <Play className="w-5 h-5" /> Test Voice Interaction
            </button>
            <button
              type="submit"
              className="flex-1 py-4 flex items-center justify-center gap-2 bg-gray-900 text-white font-bold rounded-2xl hover:bg-gray-800 transition-all shadow-md hover:shadow-lg"
            >
              <Save className="w-5 h-5" /> Save Configuration
            </button>
          </div>
        </form>
      </div>

      <VoiceInteractionModal 
        isOpen={isTestModalOpen} 
        onClose={() => setIsTestModalOpen(false)} 
      />
    </motion.div>
  );
}

