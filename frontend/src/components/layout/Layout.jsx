import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import Logo from '../common/Logo';
import {
  LayoutDashboard, BookOpen, Heart, User, Activity, Mic, MessageCircle, Coffee, Users, Wind
} from 'lucide-react';
import { useState } from 'react';
import VoiceInteractionModal from '../voice/VoiceInteractionModal';

// Full sidebar navigation (desktop)
const NAV_ITEMS = [
  { to: '/dashboard',    icon: <LayoutDashboard className="w-5 h-5" />, label: 'Home'          },
  { to: '/vent',         icon: <MessageCircle className="w-5 h-5" />,   label: 'Unfiltered Zone'},
  { to: '/journal',      icon: <BookOpen className="w-5 h-5" />,        label: 'Journal'       },
  { to: '/stress-break', icon: <Coffee className="w-5 h-5" />,          label: 'Stress Break'  },
  { to: '/support',      icon: <Users className="w-5 h-5" />,           label: 'Professionals' },
  { to: '/sos',          icon: <Heart className="w-5 h-5" />,           label: 'SOS'           },
  { to: '/settings',     icon: <User className="w-5 h-5" />,            label: 'Profile'       },
];

// Condensed mobile bottom nav — max 5 items
const MOBILE_NAV = [
  { to: '/dashboard',    icon: <LayoutDashboard className="w-5 h-5" />, label: 'Home'    },
  { to: '/vent',         icon: <MessageCircle className="w-5 h-5" />,   label: 'Chat'    },
  { to: '/journal',      icon: <BookOpen className="w-5 h-5" />,        label: 'Journal' },
  { to: '/support',      icon: <Users className="w-5 h-5" />,           label: 'Support' },
  { to: '/settings',     icon: <User className="w-5 h-5" />,            label: 'Profile' },
];

export default function Layout() {
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-cream flex">
      {/* ── Desktop Sidebar ───────────────────────────────── */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-100 py-6 px-4 fixed left-0 top-0 h-full z-30">
        <div className="mb-10 px-2">
          <Logo className="h-14" />
        </div>

        <nav className="flex flex-col gap-1 flex-1">
          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/dashboard'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all text-sm
                 ${isActive
                   ? 'bg-sage/15 text-sage'
                   : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'}`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Insights — bottom of sidebar */}
        <div className="mt-auto pt-4 border-t border-gray-100">
          <NavLink
            to="/analytics"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all text-sm
               ${isActive ? 'bg-sage/15 text-sage' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'}`
            }
          >
            <Activity className="w-5 h-5" /> Insights
          </NavLink>
        </div>
      </aside>

      {/* ── Main Content ──────────────────────────────────── */}
      <main className="flex-1 md:ml-64 pb-24 md:pb-0">
        <Outlet />
      </main>

      {/* ── Mobile Bottom Nav (5 items max) ───────────────── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-100 z-30 flex items-center justify-around px-1 py-2">
        {MOBILE_NAV.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/dashboard'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-all flex-1 max-w-[64px]
               ${isActive ? 'text-sage' : 'text-gray-400 active:text-gray-600'}`
            }
          >
            <div className={`p-1.5 rounded-xl transition-all`}>
              {item.icon}
            </div>
            <span className="text-[9px] font-bold leading-tight truncate w-full text-center">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* ── Global Voice FAB ──────────────────────────────── */}
      <button
        onClick={() => setIsVoiceModalOpen(true)}
        className="fixed bottom-20 right-4 md:bottom-8 md:right-8 z-40 w-12 h-12 md:w-14 md:h-14 bg-sage text-white rounded-full flex items-center justify-center shadow-lg hover:bg-sage/90 hover:scale-105 transition-all"
        title="Activate Voice Companion"
      >
        <Mic className="w-5 h-5 md:w-6 md:h-6" />
      </button>

      <VoiceInteractionModal 
        isOpen={isVoiceModalOpen} 
        onClose={() => setIsVoiceModalOpen(false)} 
      />
    </div>
  );
}

