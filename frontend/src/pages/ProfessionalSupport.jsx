import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Phone, Video, Calendar, Star, MapPin, Globe, Shield, AlertCircle, Clock, ChevronRight, X, Heart } from 'lucide-react';

// ─── Mock Data ──────────────────────────────────────────────────────────────
const PROFESSIONALS = [
  {
    id: 1,
    name: 'Dr. Sarah Jenkins',
    type: 'Licensed Therapist',
    category: 'Therapist',
    specialties: ['Anxiety', 'Depression', 'Burnout'],
    languages: ['English', 'Spanish'],
    rating: 4.9,
    reviews: 124,
    isOnline: true,
    nextAvailable: 'Available Now',
    image: '👩🏽‍⚕️',
    color: 'bg-indigo-100 text-indigo-700',
  },
  {
    id: 2,
    name: 'Michael Chen, LPC',
    type: 'Professional Counselor',
    category: 'Counselor',
    specialties: ['Career Stress', 'Relationships', 'Life Transitions'],
    languages: ['English', 'Mandarin'],
    rating: 4.8,
    reviews: 89,
    isOnline: false,
    nextAvailable: 'Today at 3:00 PM',
    image: '👨🏻‍⚕️',
    color: 'bg-sage/20 text-sage',
  },
  {
    id: 3,
    name: 'Dr. Emily Carter',
    type: 'Clinical Psychologist',
    category: 'Therapist',
    specialties: ['Trauma', 'PTSD', 'Grief'],
    languages: ['English'],
    rating: 5.0,
    reviews: 210,
    isOnline: true,
    nextAvailable: 'Available Now',
    image: '👩🏼‍⚕️',
    color: 'bg-softBlue/30 text-blue-700',
  },
  {
    id: 4,
    name: 'David Okafor, MSW',
    type: 'Clinical Social Worker',
    category: 'Counselor',
    specialties: ['Family Dynamics', 'Stress Management'],
    languages: ['English', 'French'],
    rating: 4.7,
    reviews: 56,
    isOnline: false,
    nextAvailable: 'Tomorrow at 10:00 AM',
    image: '👨🏿‍⚕️',
    color: 'bg-amber-100 text-amber-700',
  },
];

// ─── Main Component ─────────────────────────────────────────────────────────
export default function ProfessionalSupport() {
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [bookingModal, setBookingModal] = useState(null);

  const filteredPros = PROFESSIONALS.filter((pro) => {
    const matchesFilter = filter === 'All' || pro.category === filter;
    const matchesSearch = pro.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          pro.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const handleAction = (type, pro) => {
    setBookingModal({ type, pro });
  };

  return (
    <div className="min-h-screen bg-cream pb-24">
      {/* ── Header ── */}
      <header className="bg-white/80 backdrop-blur-md border-b border-sage/20 px-6 py-10 sticky top-0 z-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-16 h-16 bg-sage/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-sage" fill="currentColor" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">Professional Support Hub</h1>
          <p className="text-gray-500 max-w-lg mx-auto text-lg">
            Connect with licensed therapists and counselors for personalized, human support when you need it most.
          </p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-10">
        
        {/* ── Emergency Support Banner ── */}
        <section className="bg-rose-50 border border-rose-200 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 shadow-sm">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
            <AlertCircle className="w-8 h-8 text-rose-500" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-xl font-bold text-gray-900 mb-2">In a crisis? Get immediate help.</h2>
            <p className="text-gray-600 mb-4 md:mb-0">
              If you or someone you know is in immediate danger, please reach out to emergency services.
            </p>
          </div>
          <div className="flex flex-col w-full md:w-auto gap-3">
            <a href="tel:988" className="px-6 py-3 bg-rose-500 text-white font-bold rounded-xl text-center shadow-md hover:bg-rose-600 transition-all flex items-center justify-center gap-2">
              <Phone className="w-5 h-5" /> Call 988 (Lifeline)
            </a>
            <a href="sms:741741" className="px-6 py-3 bg-white text-rose-600 font-bold border border-rose-200 rounded-xl text-center hover:bg-rose-50 transition-all flex items-center justify-center gap-2">
              Text HOME to 741741
            </a>
          </div>
        </section>

        {/* ── Search and Filters ── */}
        <section className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex bg-white rounded-full p-1 shadow-sm border border-gray-100 w-full md:w-auto">
              {['All', 'Counselors', 'Therapists'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={`flex-1 md:flex-none px-6 py-2.5 rounded-full font-semibold text-sm transition-all ${
                    filter === tab ? 'bg-sage text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            
            <div className="relative w-full md:w-72">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="w-full bg-white border border-gray-200 text-gray-800 text-sm rounded-full focus:ring-sage focus:border-sage block pl-11 p-3 shadow-sm transition-all"
                placeholder="Search specialties..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* ── Professional Grid ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            <AnimatePresence>
              {filteredPros.map((pro) => (
                <motion.div
                  key={pro.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col"
                >
                  {/* Card Header */}
                  <div className="flex gap-4 items-start mb-4">
                    <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0 shadow-sm ${pro.color}`}>
                      {pro.image}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-bold text-gray-800">{pro.name}</h3>
                          <p className="text-sm font-medium text-gray-500 flex items-center gap-1">
                            <Shield className="w-3.5 h-3.5" /> {pro.type}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center text-amber-400">
                          <Star className="w-4 h-4 fill-amber-400" />
                          <span className="text-sm font-bold text-gray-700 ml-1">{pro.rating}</span>
                        </div>
                        <span className="text-xs text-gray-400">({pro.reviews} reviews)</span>
                      </div>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {pro.specialties.map(spec => (
                      <span key={spec} className="px-3 py-1 bg-gray-50 text-gray-600 rounded-full text-xs font-semibold border border-gray-100">
                        {spec}
                      </span>
                    ))}
                  </div>

                  {/* Details */}
                  <div className="space-y-2 mb-6 flex-1">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Globe className="w-4 h-4" /> {pro.languages.join(', ')}
                    </div>
                    <div className="flex items-center gap-2 text-sm font-medium">
                      {pro.isOnline ? (
                        <span className="flex items-center gap-1.5 text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Available Now
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-gray-500">
                          <Clock className="w-4 h-4" /> Next: {pro.nextAvailable}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-3 gap-2 pt-4 border-t border-gray-50 mt-auto">
                    <button onClick={() => handleAction('call', pro)} className="flex flex-col items-center justify-center p-2 rounded-xl hover:bg-gray-50 text-gray-600 transition-colors">
                      <Phone className="w-5 h-5 mb-1" />
                      <span className="text-[10px] font-bold uppercase">Call</span>
                    </button>
                    <button onClick={() => handleAction('video', pro)} className="flex flex-col items-center justify-center p-2 rounded-xl hover:bg-gray-50 text-gray-600 transition-colors">
                      <Video className="w-5 h-5 mb-1" />
                      <span className="text-[10px] font-bold uppercase">Video</span>
                    </button>
                    <button onClick={() => handleAction('book', pro)} className="flex flex-col items-center justify-center p-2 rounded-xl bg-gray-900 hover:bg-gray-800 text-white transition-colors shadow-sm">
                      <Calendar className="w-5 h-5 mb-1" />
                      <span className="text-[10px] font-bold uppercase">Book</span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          
          {filteredPros.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-6 h-6 text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-800">No professionals found</h3>
              <p className="text-gray-500">Try adjusting your search or filters.</p>
            </div>
          )}
        </section>
      </main>

      {/* ── Simulated Booking Modal ── */}
      <AnimatePresence>
        {bookingModal && (
          <motion.div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl relative"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <button onClick={() => setBookingModal(null)} className="absolute top-4 right-4 p-2 text-gray-400 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5" />
              </button>
              
              <div className="w-16 h-16 bg-sage/10 rounded-full flex items-center justify-center mb-6 mx-auto">
                {bookingModal.type === 'call' && <Phone className="w-8 h-8 text-sage" />}
                {bookingModal.type === 'video' && <Video className="w-8 h-8 text-sage" />}
                {bookingModal.type === 'book' && <Calendar className="w-8 h-8 text-sage" />}
              </div>
              
              <h3 className="text-2xl font-bold text-center text-gray-800 mb-2">
                {bookingModal.type === 'call' ? 'Calling' : bookingModal.type === 'video' ? 'Starting Video' : 'Booking Appointment'}
              </h3>
              <p className="text-center text-gray-500 mb-6 font-medium">
                with {bookingModal.pro.name}
              </p>
              
              <div className="bg-gray-50 p-4 rounded-2xl mb-8 text-sm text-gray-600 text-center">
                This is a simulated action for the hackathon demo. No real {bookingModal.type} will be initiated.
              </div>
              
              <button 
                onClick={() => setBookingModal(null)}
                className="w-full py-3.5 rounded-xl font-bold text-white bg-gray-900 hover:bg-gray-800 shadow-md transition-all"
              >
                Close Simulation
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
