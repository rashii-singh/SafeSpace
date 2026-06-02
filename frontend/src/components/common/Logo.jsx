import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';

export default function Logo({ className = "h-12 md:h-14" }) {
  return (
    <Link to="/" className="flex items-center gap-2 group transition-transform hover:scale-105">
      <img
        src={logo}
        alt="SafeSpace Logo"
        className={`${className} w-auto object-contain`}
      />
    </Link>
  );
}
