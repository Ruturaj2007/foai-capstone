import { GraduationCap, Globe, MessageCircle, Hash, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import SupportWidget from './SupportWidget';

import { useUser } from '../auth/UserContext';

const Footer = () => {
  const { isLoggedIn } = useUser();

  return (
    <footer id="footer" className="bg-dark pt-20 border-t border-white/5 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Top Normal College Footer */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-scaler-red p-1.5 rounded">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="font-heading font-bold text-lg text-white">Scaler School of Technology</span>
            </div>
            <p className="text-zinc-400 text-sm leading-relaxed max-w-xs mb-6">
              Building India's best tech talent. Prepare for a guaranteed career with industry-tailored computer science programs.
            </p>
            <div className="flex gap-4">
              <Globe className="w-5 h-5 text-zinc-500 hover:text-white cursor-pointer transition-colors" />
              <MessageCircle className="w-5 h-5 text-zinc-500 hover:text-white cursor-pointer transition-colors" />
              <Hash className="w-5 h-5 text-zinc-500 hover:text-white cursor-pointer transition-colors" />
              <Mail className="w-5 h-5 text-zinc-500 hover:text-white cursor-pointer transition-colors" />
            </div>
          </div>
          
          <div>
            <h4 className="font-heading font-bold text-white mb-4">Programs</h4>
            <ul className="space-y-3 text-sm text-zinc-400">
              <li><a href="#" className="hover:text-scaler-red transition-colors">BS Technology</a></li>
              <li><a href="#" className="hover:text-scaler-red transition-colors">DSML</a></li>
              <li><a href="#" className="hover:text-scaler-red transition-colors">DevOps</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-bold text-white mb-4">Admissions</h4>
            <ul className="space-y-3 text-sm text-zinc-400">
              <li><a href="https://www.scaler.com/school-of-technology/" target="_blank" rel="noopener noreferrer" className="hover:text-scaler-red transition-colors">Apply</a></li>
              <li><a href="#" className="hover:text-scaler-red transition-colors">NSAT</a></li>
              <li><a href="#" className="hover:text-scaler-red transition-colors">Scholarships</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-bold text-white mb-4">Campus</h4>
            <ul className="space-y-3 text-sm text-zinc-400">
              <li><a href="#" className="hover:text-scaler-red transition-colors">Events</a></li>
              <li><a href="#" className="hover:text-scaler-red transition-colors">Mentorship</a></li>
              <li><a href="#" className="hover:text-scaler-red transition-colors">Community</a></li>
            </ul>
          </div>
        </div>

        <div className="text-sm text-zinc-400 mb-16 border-t border-white/5 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p>Contact: support@scaler.com, Bangalore India</p>
          <p className="mt-2 sm:mt-0">© 2026 Scaler School of Technology. All rights reserved.</p>
        </div>

        {/* Divider & Support Widget */}
        <div className="border-t border-white/5" />
        
        {isLoggedIn ? (
          <SupportWidget />
        ) : (
          <div className="py-16 text-center">
            <h3 className="text-xl font-heading font-bold text-white mb-3">Have a Question? Ask Our Support</h3>
            <p className="text-zinc-400 text-sm mb-6 max-w-md mx-auto">
              Sign in or create an account to access our AI-powered support assistant.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link to="/login" className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-6 py-2.5 rounded-md font-medium transition-all text-sm">
                Login
              </Link>
              <Link to="/signup" className="bg-scaler-red hover:bg-red-600 text-white px-6 py-2.5 rounded-md font-semibold transition-all text-sm">
                Sign Up
              </Link>
            </div>
          </div>
        )}

        <div className="mt-8 flex justify-center text-[10px] text-zinc-700 hover:text-zinc-500 transition-colors">
          <Link to="/admin/login">Admin Access</Link>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
