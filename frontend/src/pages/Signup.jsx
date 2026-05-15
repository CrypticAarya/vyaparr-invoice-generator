import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { signup } from '../api';

const Signup = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await signup(formData.name, formData.email, formData.password);
      const { token, refreshToken, user } = response.data;
      
      login(user, token, refreshToken);
      addToast('Account created successfully', 'success');
      navigate('/onboarding');
    } catch (err) {
      setError(err.message || 'Signup failed');
      addToast(err.message || 'Signup failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[440px] mx-auto animate-in fade-in zoom-in-95 duration-500 relative z-10">
      <div className="premium-card p-10 sm:p-14 relative overflow-hidden bg-white/80 backdrop-blur-xl">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-v-accent to-v-mint"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-v-mint/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
        
        <div className="mb-10 flex flex-col items-center">
          <Link to="/" className="w-14 h-14 bg-v-accent rounded-2xl flex items-center justify-center mb-6 shadow-[0_10px_25px_-5px_rgba(109,94,245,0.4)] hover:scale-105 transition-transform">
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </Link>
          <h2 className="sketch-title text-4xl font-bold tracking-tight text-center">Join VyapaarFlow</h2>
          <p className="text-zinc-500 text-[14px] font-medium mt-2">Professional GST billing for your business</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Full Name</label>
            <input
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="Steve Jobs"
              className="w-full bg-white border border-black/5 rounded-2xl px-5 py-3.5 text-[14px] outline-none transition-all focus:border-v-accent/30 focus:ring-4 focus:ring-v-accent/10 placeholder:text-zinc-400 shadow-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Work Email</label>
            <input
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="you@company.com"
              className="w-full bg-white border border-black/5 rounded-2xl px-5 py-3.5 text-[14px] outline-none transition-all focus:border-v-accent/30 focus:ring-4 focus:ring-v-accent/10 placeholder:text-zinc-400 shadow-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Password</label>
            <input
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full bg-white border border-black/5 rounded-2xl px-5 py-3.5 text-[14px] outline-none transition-all focus:border-v-accent/30 focus:ring-4 focus:ring-v-accent/10 placeholder:text-zinc-400 shadow-sm"
            />
          </div>

          {error && (
            <div className="text-rose-600 text-[13px] font-bold bg-rose-50 p-4 rounded-2xl border border-rose-100 flex items-center gap-3">
              <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-premium btn-premium-primary py-4 mt-2 text-[15px]"
          >
            {loading ? 'Creating account...' : 'Create free account'}
          </button>
        </form>

        <p className="mt-10 text-center text-[14px] font-medium text-zinc-500">
          Already have an account?{' '}
          <Link to="/login" className="text-v-accent font-bold hover:underline transition-colors">Log in</Link>
        </p>
      </div>
      
      <div className="mt-10 text-center">
        <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-[0.2em]">© 2026 VyapaarFlow • Production Ready</p>
      </div>
    </div>
  );
};

export default Signup;
