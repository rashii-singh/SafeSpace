import { ArrowRight, Sparkles, Shield, Coffee, Activity, MessageCircle, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-cream font-sans">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        {/* Decorative background blobs */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-lavender/50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-softBlue/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-32 left-1/2 w-[500px] h-[500px] bg-sage/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-sage/30 text-sage font-medium text-sm mb-8">
              <Sparkles className="w-4 h-4" />
              <span>Your AI Emotional Wellness Companion</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-800 mb-8 leading-tight tracking-tight">
              A Safe Place for <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sage to-softBlue">
                Every Mind.
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-10 leading-relaxed max-w-2xl mx-auto">
              Express your emotions, vent safely, and reflect with an AI companion that truly listens. Build resilience and find your calm, step by step.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/onboarding" className="w-full sm:w-auto px-8 py-4 bg-sage text-white rounded-full font-medium text-lg hover:bg-sage/90 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2">
                Start Your Journey <ArrowRight className="w-5 h-5" />
              </Link>
              <a href="#how-it-works" className="w-full sm:w-auto px-8 py-4 bg-white text-gray-700 rounded-full font-medium text-lg border border-gray-200 hover:border-sage/50 hover:bg-cream/50 transition-all flex items-center justify-center">
                How it works
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white/50 backdrop-blur-sm border-y border-sage/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Everything you need to feel supported</h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">A complete toolkit designed with psychological first-aid principles to help you navigate your emotional landscape.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Shield className="w-6 h-6 text-indigo-500" />}
              bgColor="bg-indigo-50"
              title="Unfiltered Zone"
              description="Vent freely without judgment. Type, speak, or upload images in a completely ephemeral, auto-clearing space."
            />
            <FeatureCard 
              icon={<MessageCircle className="w-6 h-6 text-sage" />}
              bgColor="bg-sage/10"
              title="AI Journal & Companion"
              description="Reflect on your day with an AI companion that offers empathetic feedback, tracks burnout risk, and remembers your journey."
            />
            <FeatureCard 
              icon={<Coffee className="w-6 h-6 text-amber-500" />}
              bgColor="bg-amber-50"
              title="Stress Break"
              description="Quick breathing exercises and grounding techniques when you need an immediate sense of calm and clarity."
            />
            <FeatureCard 
              icon={<Activity className="w-6 h-6 text-softBlue" />}
              bgColor="bg-softBlue/20"
              title="Insights Dashboard"
              description="Monitor your mood trends, session analytics, and burnout risk in a private, non-intrusive profile dashboard."
            />
            <FeatureCard 
              icon={<Heart className="w-6 h-6 text-rose-400" />}
              bgColor="bg-rose-50"
              title="Emotional SOS Circle"
              description="One-tap access to your prioritized support network and professional helplines during difficult moments."
            />
             <FeatureCard 
              icon={<Sparkles className="w-6 h-6 text-lavender" />}
              bgColor="bg-lavender"
              title="Voice Assistant"
              description="Hands-free support. Say 'Open Journal' or 'Start Breathing Exercise' for frictionless access when overwhelmed."
            />
          </div>
        </div>
      </section>

      {/* How it Works / Preview */}
      <section id="how-it-works" className="py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold text-gray-800 mb-6 leading-tight">
                Designed to feel like a <span className="text-sage">warm hug.</span>
              </h2>
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                We purposefully avoided corporate dashboards and clinical interfaces. SafeSpace uses calming colors, soft rounded edges, and micro-interactions that breathe with you.
              </p>
              
              <div className="space-y-6">
                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-lavender flex items-center justify-center text-gray-700 font-bold text-xl">1</div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Check-in</h3>
                    <p className="text-gray-500">Open the app and do a quick mood check. Let your AI companion know how you're feeling.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-cream border-2 border-sage flex items-center justify-center text-gray-700 font-bold text-xl">2</div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Express</h3>
                    <p className="text-gray-500">Choose between the saved AI Journal or the ephemeral Unfiltered Zone based on your need.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-softBlue/30 flex items-center justify-center text-gray-700 font-bold text-xl">3</div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Reflect & Regulate</h3>
                    <p className="text-gray-500">Receive compassionate insights, try a guided stress break, and watch your resilience grow.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Mockup UI */}
            <div className="relative mx-auto w-full max-w-md">
              <div className="absolute inset-0 bg-gradient-to-tr from-sage to-softBlue rounded-[2.5rem] transform rotate-3 scale-105 opacity-20 blur-xl" />
              <div className="bg-white border-[8px] border-gray-100 rounded-[2.5rem] shadow-2xl overflow-hidden relative z-10 flex flex-col h-[600px]">
                {/* App Header */}
                <div className="bg-cream p-6 pb-8 rounded-b-3xl relative shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                    <div className="w-10 h-10 rounded-full bg-lavender" />
                    <div className="flex gap-2">
                      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                        <Heart className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">Good morning, Alex.</h3>
                  <p className="text-gray-500 mt-1">How is your mind feeling today?</p>
                </div>
                
                {/* App Body Preview */}
                <div className="flex-1 bg-gray-50/50 p-6 flex flex-col gap-4 overflow-hidden">
                  <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 transform transition hover:scale-[1.02]">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="p-3 bg-sage/10 rounded-xl"><MessageCircle className="w-5 h-5 text-sage" /></div>
                      <div className="font-semibold text-gray-800">AI Journal</div>
                    </div>
                    <div className="text-sm text-gray-400">Record your thoughts and get empathetic reflection.</div>
                  </div>
                  
                  <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 transform transition hover:scale-[1.02]">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="p-3 bg-indigo-50 rounded-xl"><Shield className="w-5 h-5 text-indigo-400" /></div>
                      <div className="font-semibold text-gray-800">Unfiltered Zone</div>
                    </div>
                    <div className="text-sm text-gray-400">Vent safely. Everything clears when you leave.</div>
                  </div>
                  
                  <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 transform transition hover:scale-[1.02]">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="p-3 bg-amber-50 rounded-xl"><Coffee className="w-5 h-5 text-amber-500" /></div>
                      <div className="font-semibold text-gray-800">Stress Break</div>
                    </div>
                    <div className="text-sm text-gray-400">Take 2 minutes to center yourself.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 bg-lavender/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Stories of calm</h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">Hear from people who found their safe space.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TestimonialCard 
              quote="The Unfiltered Zone is a lifesaver. Being able to just rage-type without worrying about anyone seeing it, and then watching it vanish, is incredibly cathartic."
              author="Sarah T."
              role="Student"
            />
            <TestimonialCard 
              quote="I never liked journaling until SafeSpace. My AI companion actually remembers what I said last week and checks in on me. It feels very human and very warm."
              author="Marcus J."
              role="Designer"
            />
            <TestimonialCard 
              quote="The colors, the rounded edges, the soft animations... opening this app physically lowers my heart rate. It's the only wellness app that doesn't feel like a chore."
              author="Elena R."
              role="Teacher"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-sage/10" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">Ready to find your peace?</h2>
          <p className="text-xl text-gray-600 mb-10">Join thousands of others who are building emotional resilience in a space that truly cares.</p>
          <Link to="/onboarding" className="inline-flex items-center gap-2 px-10 py-5 bg-gray-800 text-white rounded-full font-bold text-lg hover:bg-gray-900 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1">
            Create Your SafeSpace <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}

// Subcomponents
function FeatureCard({ icon, bgColor, title, description }) {
  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-50 hover:shadow-md transition-shadow group">
      <div className={`w-14 h-14 ${bgColor} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-3">{title}</h3>
      <p className="text-gray-500 leading-relaxed">{description}</p>
    </div>
  );
}

function TestimonialCard({ quote, author, role }) {
  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
      <div className="flex gap-1 mb-4">
        {[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 text-amber-400" fill="currentColor" />)}
      </div>
      <p className="text-gray-600 text-lg italic mb-6">"{quote}"</p>
      <div>
        <p className="font-bold text-gray-800">{author}</p>
        <p className="text-gray-500 text-sm">{role}</p>
      </div>
    </div>
  );
}

function Star(props) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
