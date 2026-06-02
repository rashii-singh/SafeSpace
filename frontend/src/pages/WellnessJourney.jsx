import { motion } from 'framer-motion';
import { Target, CheckCircle2, Circle } from 'lucide-react';

export default function WellnessJourney() {
  const steps = [
    { id: 1, title: 'Complete Onboarding', desc: 'Set up your profile and preferences', completed: true },
    { id: 2, title: 'First Journal Entry', desc: 'Reflect on your day for the first time', completed: true },
    { id: 3, title: 'Explore Unfiltered Zone', desc: 'Let your thoughts out safely', completed: false },
    { id: 4, title: 'Try a Stress Break', desc: 'Use the breathing or grounding exercise', completed: false },
  ];

  return (
    <div className="min-h-screen bg-cream p-6 md:p-12 pb-24">
      <motion.div 
        className="max-w-2xl mx-auto space-y-6"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <header className="mb-10 text-center md:text-left">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Wellness Journey</h1>
          <p className="text-gray-500">Track your progress and build healthy habits.</p>
        </header>

        <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-6">
            <Target className="w-5 h-5 text-sage" /> Your Path
          </h2>
          
          <div className="space-y-6">
            {steps.map((step, idx) => (
              <div key={step.id} className="flex gap-4 relative">
                {idx !== steps.length - 1 && (
                  <div className={`absolute left-3 top-8 bottom-[-24px] w-0.5 ${step.completed ? 'bg-sage' : 'bg-gray-100'}`} />
                )}
                <div className="relative z-10 bg-white">
                  {step.completed ? (
                    <CheckCircle2 className="w-6 h-6 text-sage" />
                  ) : (
                    <Circle className="w-6 h-6 text-gray-300" />
                  )}
                </div>
                <div className={step.completed ? 'opacity-100' : 'opacity-50'}>
                  <h3 className="font-semibold text-gray-800">{step.title}</h3>
                  <p className="text-sm text-gray-500">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

