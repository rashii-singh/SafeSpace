import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/common/Logo';
import useAppStore from '../store/useAppStore';
import {
  ArrowRight, ArrowLeft, Check, Moon, Brain, Zap, Heart, Leaf,
  User, Phone, Plus, Trash2, ChevronRight
} from 'lucide-react';

const TOTAL_STEPS = 6;

const COMPANION_SUGGESTIONS = ['Luna', 'Nova', 'Buddy', 'Coco', 'Sol'];

const WELLNESS_GOALS = [
  { id: 'stress', label: 'Reduce Stress', icon: <Moon className="w-5 h-5" />, color: 'bg-lavender text-indigo-600 border-indigo-200' },
  { id: 'focus', label: 'Improve Focus', icon: <Brain className="w-5 h-5" />, color: 'bg-softBlue/30 text-blue-600 border-blue-200' },
  { id: 'sleep', label: 'Better Sleep', icon: <Moon className="w-5 h-5" />, color: 'bg-indigo-50 text-indigo-500 border-indigo-100' },
  { id: 'awareness', label: 'Emotional Awareness', icon: <Heart className="w-5 h-5" />, color: 'bg-rose-50 text-rose-500 border-rose-200' },
  { id: 'habits', label: 'Build Healthy Habits', icon: <Leaf className="w-5 h-5" />, color: 'bg-sage/20 text-sage border-sage/40' },
  { id: 'energy', label: 'Boost Energy', icon: <Zap className="w-5 h-5" />, color: 'bg-amber-50 text-amber-500 border-amber-200' },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const login = useAppStore((state) => state.login);
  const updateVoiceSettings = useAppStore((state) => state.updateVoiceSettings);
  
  const [step, setStep] = useState(1);
  const [animDir, setAnimDir] = useState('forward');
  const [visible, setVisible] = useState(true);

  const [formData, setFormData] = useState({
    name: '',
    companionName: '',
    goals: [],
    contacts: [],
  });
  const [newContact, setNewContact] = useState({ name: '', relationship: '', phone: '' });
  const [errors, setErrors] = useState({});

  // --- Navigation ---
  const transition = (nextStep, dir) => {
    setVisible(false);
    setAnimDir(dir);
    setTimeout(() => {
      setStep(nextStep);
      setVisible(true);
    }, 280);
  };

  const goNext = () => {
    if (validate()) transition(step + 1, 'forward');
  };

  const goBack = () => {
    if (step > 1) transition(step - 1, 'backward');
  };

  // --- Validation ---
  const validate = () => {
    const newErrors = {};
    if (step === 2 && !formData.name.trim()) newErrors.name = 'Please tell us your name.';
    if (step === 3 && !formData.companionName.trim()) newErrors.companionName = 'Please choose a name for your companion.';
    if (step === 4 && formData.goals.length === 0) newErrors.goals = 'Please select at least one goal.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // --- Handlers ---
  const toggleGoal = (id) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.includes(id) ? prev.goals.filter(g => g !== id) : [...prev.goals, id],
    }));
    if (errors.goals) setErrors(prev => ({ ...prev, goals: null }));
  };

  const addContact = () => {
    if (!newContact.name || !newContact.phone) return;
    setFormData(prev => ({
      ...prev,
      contacts: [...prev.contacts, { ...newContact, priority: prev.contacts.length + 1, id: Date.now() }],
    }));
    setNewContact({ name: '', relationship: '', phone: '' });
  };

  const removeContact = (id) => {
    setFormData(prev => ({ ...prev, contacts: prev.contacts.filter(c => c.id !== id) }));
  };

  const handleFinish = () => {
    login({ name: formData.name, email: `${formData.name.toLowerCase()}@example.com` });
    updateVoiceSettings({ companionName: formData.companionName || 'Unfiltered Zone' });
    navigate('/dashboard', { state: { onboardingData: formData } });
  };

  // --- Step Progress ---
  const progress = ((step - 1) / (TOTAL_STEPS - 1)) * 100;

  // --- Animation classes ---
  const animClass = visible
    ? 'opacity-100 translate-y-0'
    : animDir === 'forward'
      ? 'opacity-0 translate-y-6'
      : 'opacity-0 -translate-y-6';

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-lavender/20 to-softBlue/10 flex flex-col">
      {/* Top Bar */}
      <header className="flex items-center justify-between px-6 pt-6 pb-2">
        <Logo className="h-10 md:h-12" />
        <span className="text-sm text-gray-400 font-medium">Step {step} of {TOTAL_STEPS}</span>
      </header>

      {/* Progress Bar */}
      <div className="px-6 mb-8">
        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden max-w-xl mx-auto">
          <div
            className="h-full bg-gradient-to-r from-sage to-softBlue rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 flex items-start justify-center px-4 pb-12">
        <div
          className={`w-full max-w-xl transition-all duration-300 ease-out ${animClass}`}
          style={{ transitionProperty: 'opacity, transform' }}
        >
          {step === 1 && <StepWelcome onNext={goNext} />}
          {step === 2 && <StepName formData={formData} setFormData={setFormData} errors={errors} setErrors={setErrors} />}
          {step === 3 && <StepCompanion formData={formData} setFormData={setFormData} errors={errors} setErrors={setErrors} />}
          {step === 4 && <StepGoals formData={formData} toggleGoal={toggleGoal} errors={errors} />}
          {step === 5 && <StepSOS formData={formData} newContact={newContact} setNewContact={setNewContact} addContact={addContact} removeContact={removeContact} />}
          {step === 6 && <StepComplete formData={formData} onFinish={handleFinish} />}

          {/* Navigation Buttons */}
          {step !== 1 && step !== 6 && (
            <div className="flex items-center justify-between mt-8">
              <button
                onClick={goBack}
                className="flex items-center gap-2 px-5 py-2.5 text-gray-500 hover:text-gray-800 font-medium rounded-full hover:bg-white/60 transition-all"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button
                onClick={goNext}
                className="flex items-center gap-2 px-7 py-3 bg-sage text-white rounded-full font-semibold hover:bg-sage/90 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
              >
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// ─── Step Components ──────────────────────────────────────────────────────────

function StepWelcome({ onNext }) {
  return (
    <Card>
      <div className="text-center py-4">
        <div className="w-20 h-20 bg-lavender/60 rounded-full flex items-center justify-center mx-auto mb-6">
          <Heart className="w-10 h-10 text-indigo-400" fill="currentColor" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Welcome to SafeSpace</h1>
        <p className="text-gray-500 text-lg mb-10 leading-relaxed">
          Let's create a space that feels truly yours.<br />
          This will only take a few moments.
        </p>
        <button
          onClick={onNext}
          className="w-full py-4 bg-sage text-white rounded-2xl font-semibold text-lg hover:bg-sage/90 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
        >
          Let's Begin <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </Card>
  );
}

function StepName({ formData, setFormData, errors, setErrors }) {
  return (
    <Card>
      <Label step="01" />
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">What should we call you?</h2>
      <p className="text-gray-500 mb-8">This is just for us — no surnames needed. 🌿</p>
      <div>
        <input
          type="text"
          placeholder="Your first name..."
          value={formData.name}
          onChange={e => {
            setFormData(prev => ({ ...prev, name: e.target.value }));
            if (errors.name) setErrors(prev => ({ ...prev, name: null }));
          }}
          className={`w-full px-5 py-4 rounded-2xl border-2 bg-white text-gray-800 text-lg font-medium placeholder-gray-300 outline-none transition-all focus:border-sage ${errors.name ? 'border-rose-400' : 'border-gray-200'}`}
        />
        {errors.name && <p className="text-rose-500 text-sm mt-2 ml-1">{errors.name}</p>}
        {formData.name && (
          <p className="text-sage font-medium mt-4 ml-1 animate-fade-in">
            Nice to meet you, {formData.name}. 💚
          </p>
        )}
      </div>
    </Card>
  );
}

function StepCompanion({ formData, setFormData, errors, setErrors }) {
  const selected = formData.companionName;
  return (
    <Card>
      <Label step="02" />
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Name your companion</h2>
      <p className="text-gray-500 mb-6">Your AI companion will support you throughout your journey. What would you like to call them?</p>

      {/* Suggestions */}
      <div className="flex flex-wrap gap-3 mb-6">
        {COMPANION_SUGGESTIONS.map(name => (
          <button
            key={name}
            onClick={() => {
              setFormData(prev => ({ ...prev, companionName: name }));
              if (errors.companionName) setErrors(prev => ({ ...prev, companionName: null }));
            }}
            className={`px-5 py-2.5 rounded-full font-medium border-2 transition-all ${selected === name ? 'bg-sage text-white border-sage shadow-sm' : 'bg-white text-gray-600 border-gray-200 hover:border-sage/50'}`}
          >
            {name}
          </button>
        ))}
      </div>

      {/* Custom name */}
      <input
        type="text"
        placeholder="Or type a custom name..."
        value={selected}
        onChange={e => {
          setFormData(prev => ({ ...prev, companionName: e.target.value }));
          if (errors.companionName) setErrors(prev => ({ ...prev, companionName: null }));
        }}
        className={`w-full px-5 py-4 rounded-2xl border-2 bg-white text-gray-800 text-lg font-medium placeholder-gray-300 outline-none transition-all focus:border-sage ${errors.companionName ? 'border-rose-400' : 'border-gray-200'}`}
      />
      {errors.companionName && <p className="text-rose-500 text-sm mt-2 ml-1">{errors.companionName}</p>}

      {/* Preview */}
      {selected && (
        <div className="mt-6 p-5 bg-lavender/40 rounded-2xl border border-lavender flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-sage/20 flex items-center justify-center flex-shrink-0 text-xl">🤍</div>
          <div>
            <p className="text-gray-700 font-medium">Hi, I'm <span className="text-sage font-bold">{selected}</span>. I'll be here whenever you need me.</p>
            <p className="text-gray-400 text-sm mt-1">Your companion is ready.</p>
          </div>
        </div>
      )}
    </Card>
  );
}

function StepGoals({ formData, toggleGoal, errors }) {
  return (
    <Card>
      <Label step="03" />
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">What are your wellness goals?</h2>
      <p className="text-gray-500 mb-8">Select all that apply — your companion will personalize support for you.</p>

      <div className="grid grid-cols-2 gap-4">
        {WELLNESS_GOALS.map(goal => {
          const isSelected = formData.goals.includes(goal.id);
          return (
            <button
              key={goal.id}
              onClick={() => toggleGoal(goal.id)}
              className={`relative p-5 rounded-2xl border-2 text-left transition-all hover:shadow-md ${isSelected ? 'border-sage bg-sage/10 shadow-sm' : 'border-gray-200 bg-white hover:border-sage/40'}`}
            >
              {isSelected && (
                <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-sage flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" strokeWidth={3} />
                </div>
              )}
              <div className={`w-10 h-10 ${goal.color} rounded-xl flex items-center justify-center mb-3 border`}>
                {goal.icon}
              </div>
              <p className="font-semibold text-gray-800 text-sm leading-snug">{goal.label}</p>
            </button>
          );
        })}
      </div>
      {errors.goals && <p className="text-rose-500 text-sm mt-4 ml-1">{errors.goals}</p>}
    </Card>
  );
}

function StepSOS({ formData, newContact, setNewContact, addContact, removeContact }) {
  return (
    <Card>
      <Label step="04" />
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Your Emotional SOS Circle</h2>
      <p className="text-gray-500 mb-8">Add people you trust. They'll be available instantly if you ever need support. You can skip this and add later.</p>

      {/* Existing contacts */}
      {formData.contacts.length > 0 && (
        <div className="space-y-3 mb-6">
          {formData.contacts.map((c) => (
            <div key={c.id} className="flex items-center gap-3 bg-white border border-gray-200 rounded-2xl p-4">
              <div className="w-10 h-10 rounded-full bg-lavender/70 flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-indigo-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 truncate">{c.name}</p>
                <p className="text-gray-400 text-sm">{c.relationship} · {c.phone}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-sage bg-sage/10 px-2 py-1 rounded-full">#{c.priority}</span>
                <button onClick={() => removeContact(c.id)} className="text-gray-300 hover:text-rose-400 transition-colors p-1">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add contact form */}
      <div className="bg-cream border-2 border-dashed border-sage/30 rounded-2xl p-5 space-y-3">
        <p className="text-sm font-semibold text-gray-500 mb-4 flex items-center gap-2"><Plus className="w-4 h-4" /> Add a contact</p>
        <input
          type="text"
          placeholder="Name (e.g. Mom)"
          value={newContact.name}
          onChange={e => setNewContact(p => ({ ...p, name: e.target.value }))}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-800 placeholder-gray-300 outline-none focus:border-sage transition-colors"
        />
        <div className="grid grid-cols-2 gap-3">
          <input
            type="text"
            placeholder="Relationship"
            value={newContact.relationship}
            onChange={e => setNewContact(p => ({ ...p, relationship: e.target.value }))}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-800 placeholder-gray-300 outline-none focus:border-sage transition-colors"
          />
          <input
            type="tel"
            placeholder="Phone number"
            value={newContact.phone}
            onChange={e => setNewContact(p => ({ ...p, phone: e.target.value }))}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-800 placeholder-gray-300 outline-none focus:border-sage transition-colors"
          />
        </div>
        <button
          onClick={addContact}
          disabled={!newContact.name || !newContact.phone}
          className="w-full py-3 bg-sage text-white rounded-xl font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-sage/90 transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add to SOS Circle
        </button>
      </div>
    </Card>
  );
}

function StepComplete({ formData, onFinish }) {
  return (
    <Card>
      <div className="text-center py-4">
        <div className="w-24 h-24 bg-gradient-to-br from-sage/20 to-softBlue/30 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
          <Check className="w-12 h-12 text-sage" strokeWidth={2.5} />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          Welcome, {formData.name || 'Friend'}. 🌿
        </h2>
        <p className="text-gray-500 text-lg mb-3 leading-relaxed">
          <span className="font-semibold text-sage">{formData.companionName || 'Your companion'}</span> is ready to walk this journey with you.
        </p>
        <p className="text-gray-400 mb-10">Your SafeSpace is set up and ready. Let's begin.</p>

        {formData.goals.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {formData.goals.map(g => {
              const goal = WELLNESS_GOALS.find(wg => wg.id === g);
              return goal ? (
                <span key={g} className="px-4 py-1.5 bg-sage/10 text-sage rounded-full text-sm font-medium border border-sage/20">
                  {goal.label}
                </span>
              ) : null;
            })}
          </div>
        )}

        <button
          onClick={onFinish}
          className="w-full py-4 bg-gray-800 text-white rounded-2xl font-bold text-lg hover:bg-gray-900 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
        >
          Enter SafeSpace <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </Card>
  );
}

// ─── Shared Primitives ────────────────────────────────────────────────────────

function Card({ children }) {
  return (
    <div className="bg-white/70 backdrop-blur-sm border border-white/80 rounded-3xl shadow-xl p-8 md:p-10">
      {children}
    </div>
  );
}

function Label({ step }) {
  return (
    <p className="text-xs font-bold tracking-widest text-sage/70 uppercase mb-3">Step {step}</p>
  );
}
