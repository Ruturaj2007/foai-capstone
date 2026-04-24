import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { GraduationCap } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (login(email, password)) {
      navigate('/admin');
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-zinc-100 font-sans" style={{ backgroundColor: '#111111' }}>
      <div className="w-full max-w-md border border-white/5 rounded-xl p-8 shadow-2xl" style={{ backgroundColor: '#1a1a1a' }}>
        <div className="flex flex-col items-center mb-8">
          <div className="bg-scaler-red p-3 rounded-lg mb-4">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-heading font-bold text-white">Admin Dashboard</h2>
          <p className="text-sm text-zinc-400 mt-1">Sign in to manage support tickets</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-500 px-4 py-3 rounded-md mb-6 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">Email</label>
            <input 
              type="email" 
              className="w-full border border-white/10 rounded-md py-2.5 px-4 focus:outline-none focus:border-scaler-red transition-all text-white" style={{ backgroundColor: '#111111' }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">Password</label>
            <input 
              type="password" 
              className="w-full border border-white/10 rounded-md py-2.5 px-4 focus:outline-none focus:border-scaler-red transition-all text-white" style={{ backgroundColor: '#111111' }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-scaler-red hover:bg-red-600 text-white font-medium py-3 rounded-md transition-all mt-4"
          >
            Sign In
          </button>
        </form>

        <div className="mt-8 text-center border-t border-white/5 pt-6">
          <Link to="/" className="text-sm text-zinc-500 hover:text-white transition-colors">
            ← Back to main website
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
