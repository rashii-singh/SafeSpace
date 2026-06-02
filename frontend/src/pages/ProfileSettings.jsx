import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { User, Activity, Mic, Bell, Shield, LogOut, ChevronRight, X } from 'lucide-react';
import useAppStore from '../store/useAppStore';

export default function ProfileSettings() {
  const { user, logout } = useAppStore();
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-cream p-6 md:p-12 pb-24 relative">
      <motion.div 
        className="max-w-2xl mx-auto space-y-6 relative z-10"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <header className="mb-10 text-center md:text-left">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Profile & Settings</h1>
          <p className="text-gray-500">Manage your account and preferences.</p>
        </header>

        <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-sm border border-gray-100 flex items-center gap-6">
          <div className="w-20 h-20 bg-lavender/30 rounded-full flex items-center justify-center text-3xl">
            👤
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{user?.name || 'Guest'}</h2>
            <p className="text-gray-500">{user?.email || 'Not logged in'}</p>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-gray-100">
          <SettingLink to="/analytics" icon={<Activity className="w-5 h-5 text-softBlue" />} title="Wellness Insights" desc="View your journey and mood trends" />
          <SettingLink to="/voice-settings" icon={<Mic className="w-5 h-5 text-sage" />} title="Voice Companion" desc="Configure name, wake word, and voice" />
          <SettingItem icon={<Bell className="w-5 h-5 text-amber-500" />} title="Notifications" desc="Manage daily reminders" />
          <SettingItem icon={<Shield className="w-5 h-5 text-indigo-500" />} title="Privacy & Security" desc="Data management and pin code" />
        </div>

        <button 
          onClick={() => setShowLogoutConfirm(true)}
          className="w-full bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 flex items-center gap-4 text-rose-500 hover:bg-rose-50 transition-colors"
        >
          <LogOut className="w-6 h-6" />
          <span className="font-semibold text-lg">Sign Out</span>
        </button>

      </motion.div>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutConfirm && (
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
              <button 
                onClick={() => setShowLogoutConfirm(false)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mb-6 mx-auto">
                <LogOut className="w-8 h-8 text-rose-500 ml-1" />
              </div>
              <h3 className="text-2xl font-bold text-center text-gray-800 mb-2">Sign Out</h3>
              <p className="text-center text-gray-500 mb-8">
                Are you sure you want to sign out? You will need to log in again to access your SafeSpace.
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 py-3 rounded-full font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleLogout}
                  className="flex-1 py-3 rounded-full font-medium text-white bg-rose-500 hover:bg-rose-600 shadow-md hover:shadow-lg transition-all"
                >
                  Sign Out
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SettingLink({ to, icon, title, desc }) {
  return (
    <Link to={to} className="flex items-center justify-between p-6 border-b border-gray-50 hover:bg-gray-50 transition-colors group">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <div>
          <h3 className="font-semibold text-gray-800">{title}</h3>
          <p className="text-sm text-gray-500">{desc}</p>
        </div>
      </div>
      <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-gray-500 transition-colors" />
    </Link>
  );
}

function SettingItem({ icon, title, desc }) {
  return (
    <button className="w-full flex items-center justify-between p-6 border-b border-gray-50 hover:bg-gray-50 transition-colors group text-left">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <div>
          <h3 className="font-semibold text-gray-800">{title}</h3>
          <p className="text-sm text-gray-500">{desc}</p>
        </div>
      </div>
      <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-gray-500 transition-colors" />
    </button>
  );
}

