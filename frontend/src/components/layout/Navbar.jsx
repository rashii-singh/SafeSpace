import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import logo from '../../assets/logo.png';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-cream/80 backdrop-blur-md border-b border-sage/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo + Brand name */}
          <Link to="/" className="flex items-center gap-2 group hover:opacity-90 transition-opacity">
            <img
              src={logo}
              alt="SafeSpace Logo"
              className="h-10 md:h-12 w-auto object-contain flex-shrink-0"
            />
            <span className="font-bold text-xl text-gray-800 tracking-tight hidden sm:block">SafeSpace</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-600 hover:text-sage font-medium transition-colors">Features</a>
            <a href="#how-it-works" className="text-gray-600 hover:text-sage font-medium transition-colors">How it Works</a>
            <a href="#testimonials" className="text-gray-600 hover:text-sage font-medium transition-colors">Stories</a>
            <div className="flex items-center gap-4 ml-4">
              <Link to="/onboarding" className="text-gray-800 font-medium hover:text-sage transition-colors">Log in</Link>
              <Link to="/onboarding" className="bg-sage text-white px-6 py-2.5 rounded-full font-medium hover:bg-sage/90 shadow-sm hover:shadow transition-all transform hover:-translate-y-0.5">
                Start Your Journey
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 hover:text-gray-800 p-2">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-cream border-t border-sage/20 absolute w-full px-4 py-4 shadow-lg">
          <div className="flex flex-col gap-4">
            <a href="#features" onClick={() => setIsOpen(false)} className="text-gray-600 hover:text-sage font-medium p-2 rounded-lg hover:bg-lavender/50">Features</a>
            <a href="#how-it-works" onClick={() => setIsOpen(false)} className="text-gray-600 hover:text-sage font-medium p-2 rounded-lg hover:bg-lavender/50">How it Works</a>
            <a href="#testimonials" onClick={() => setIsOpen(false)} className="text-gray-600 hover:text-sage font-medium p-2 rounded-lg hover:bg-lavender/50">Stories</a>
            <div className="h-px bg-sage/20 my-2" />
            <Link to="/onboarding" onClick={() => setIsOpen(false)} className="text-gray-800 font-medium p-2 text-center">Log in</Link>
            <Link to="/onboarding" onClick={() => setIsOpen(false)} className="bg-sage text-white px-6 py-3 rounded-full font-medium text-center shadow-sm">
              Start Your Journey
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
