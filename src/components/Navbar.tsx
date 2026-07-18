import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ThemeToggle } from './ThemeToggle';
import { Button } from './Button';
import { Leaf } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Chatbot', path: '/chatbot' },
  { name: 'Knowledge Hub', path: '/knowledge-hub' },
  { name: 'Marketplace', path: '/products' },
  { name: 'Doctors', path: '/doctors' },
  { name: 'About Us', path: '/about' },
];

export function Navbar() {
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 bg-[var(--bg-color)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-24 items-center">
          
          <div className="flex items-center space-x-2">
            <Link to="/" className="flex items-center gap-2 group">
              <span className="font-extrabold text-2xl tracking-tight text-[#1a1a1a]">
                AyurWell
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    "relative px-2 py-2 text-[15px] font-bold transition-colors hover:text-[#1a4d2e]",
                    isActive ? "text-[#1a4d2e]" : "text-[#1a1a1a]"
                  )}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center">
            <div className="hidden md:block ml-4">
              <Button 
                variant="primary" 
                className="rounded-full bg-[#181818] hover:bg-black text-white px-7 py-2.5 text-sm font-bold shadow-md transition-transform hover:scale-105"
              >
                Login with Google
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
