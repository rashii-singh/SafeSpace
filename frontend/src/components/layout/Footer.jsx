import { Heart, Twitter, Instagram, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from '../common/Logo';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-sage/20 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-12">
          
          <div className="col-span-1 md:col-span-2">
            <div className="mb-6">
              <Logo className="h-16 md:h-20" />
            </div>
            <p className="text-gray-500 mb-6 max-w-sm">
              A Safe Place for Every Mind. We're on a mission to make emotional wellness accessible, comforting, and personalized for everyone.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-cream flex items-center justify-center text-gray-500 hover:bg-lavender hover:text-gray-800 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-cream flex items-center justify-center text-gray-500 hover:bg-lavender hover:text-gray-800 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-cream flex items-center justify-center text-gray-500 hover:bg-lavender hover:text-gray-800 transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 mb-4">Platform</h3>
            <ul className="space-y-3">
              <li><Link to="/journal" className="text-gray-500 hover:text-sage transition-colors">AI Journal</Link></li>
              <li><Link to="/vent" className="text-gray-500 hover:text-sage transition-colors">Unfiltered Zone</Link></li>
              <li><Link to="/stress-break" className="text-gray-500 hover:text-sage transition-colors">Stress Break</Link></li>
              <li><Link to="/sos" className="text-gray-500 hover:text-sage transition-colors">SOS Circle</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 mb-4">Company</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-500 hover:text-sage transition-colors">About Us</a></li>
              <li><a href="#" className="text-gray-500 hover:text-sage transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-500 hover:text-sage transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-gray-500 hover:text-sage transition-colors">Contact</a></li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} SafeSpace. All rights reserved.
          </p>
          <p className="text-gray-400 text-sm flex items-center gap-1">
            Made with <Heart className="w-4 h-4 text-rose-400" fill="currentColor" /> for mental wellness
          </p>
        </div>
      </div>
    </footer>
  );
}
