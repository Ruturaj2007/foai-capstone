import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';
import { useUser } from '../auth/UserContext';

const UserSignup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { userSignup } = useUser();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }
    if (password.length < 6) {
      return setError('Password must be at least 6 characters');
    }

    setLoading(true);
    try {
      await userSignup(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-zinc-100 font-sans" style={{ backgroundColor: '#111111' }}>
      <div className="w-full max-w-md border border-white/5 rounded-xl p-8 shadow-2xl" style={{ backgroundColor: '#1a1a1a' }}>
        <div className="flex flex-col items-center mb-8">
          <div className="bg-scaler-red p-3 rounded-lg mb-4">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-heading font-bold text-white">Join Scaler</h2>
          <p className="text-sm text-zinc-400 mt-1">Create your account to get started</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-500 px-4 py-3 rounded-md mb-6 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">Email</label>
            <input
              type="email"
              className="w-full border border-white/10 rounded-md py-2.5 px-4 focus:outline-none focus:border-scaler-red transition-all text-white"
              style={{ backgroundColor: '#111111' }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">Password</label>
            <input
              type="password"
              className="w-full border border-white/10 rounded-md py-2.5 px-4 focus:outline-none focus:border-scaler-red transition-all text-white"
              style={{ backgroundColor: '#111111' }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 6 characters"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">Confirm Password</label>
            <input
              type="password"
              className="w-full border border-white/10 rounded-md py-2.5 px-4 focus:outline-none focus:border-scaler-red transition-all text-white"
              style={{ backgroundColor: '#111111' }}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter password"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-scaler-red hover:bg-red-600 disabled:opacity-50 text-white font-medium py-3 rounded-md transition-all mt-4"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-zinc-400">
          Already have an account?{' '}
          <Link to="/login" className="text-scaler-red hover:underline">Sign in</Link>
        </div>

        <div className="mt-4 text-center border-t border-white/5 pt-6">
          <Link to="/" className="text-sm text-zinc-500 hover:text-white transition-colors">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserSignup;
