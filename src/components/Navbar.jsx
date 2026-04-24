import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, LogOut } from 'lucide-react';
import { useUser } from '../auth/UserContext';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const { isLoggedIn, user, userLogout } = useUser();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4 flex items-center justify-between ${scrolled ? 'bg-dark/95 backdrop-blur-md border-b border-white/5' : 'bg-transparent'}`}>
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
        <div className="bg-scaler-red p-2 rounded-lg">
          <GraduationCap className="w-6 h-6 text-white" />
        </div>
        <span className="font-heading font-bold text-xl tracking-tight hidden sm:block">
          Scaler School of Technology
        </span>
      </div>
      
      <div className="hidden lg:flex items-center gap-8 text-sm font-medium text-zinc-300">
        <button onClick={() => window.scrollTo(0, 0)} className="hover:text-white transition-colors">Home</button>
        <button onClick={() => scrollToSection('programs')} className="hover:text-white transition-colors">Programs</button>
        <button onClick={() => scrollToSection('admissions')} className="hover:text-white transition-colors">Admissions</button>
        <button onClick={() => scrollToSection('campus')} className="hover:text-white transition-colors">Campus Life</button>
        <button onClick={() => scrollToSection('footer')} className="hover:text-white transition-colors">Contact</button>
      </div>

      <div className="flex items-center gap-3">
        {isLoggedIn ? (
          <>
            <span className="text-sm text-zinc-400 hidden sm:block">{user?.email}</span>
            <button
              onClick={userLogout}
              className="flex items-center gap-1.5 text-zinc-400 hover:text-white text-sm transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-sm text-zinc-300 hover:text-white transition-colors font-medium">
              Login
            </Link>
            <Link to="/signup" className="bg-scaler-red hover:bg-red-600 text-white px-5 py-2 rounded-md font-semibold transition-all text-sm">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
