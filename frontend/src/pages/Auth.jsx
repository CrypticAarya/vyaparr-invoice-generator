import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { loginUser } from '../api';

const Auth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ email: '', password: '' });

  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { token, user } = await loginUser(formData.email, formData.password);
      login(user, token);
      addToast('Welcome back to Vyapaar Flow!', 'success');
      
      // If user hasn't finished onboarding, route to onboarding, else dashboard
      if (user.isOnboarded) {
        navigate('/new-invoice');
      } else {
        navigate('/onboarding');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Check your credentials.');
      addToast(err.message || 'Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Left side: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 relative z-10 bg-white shadow-2xl">
        <div className="w-full max-w-[400px]">
          
          <div className="mb-10 flex items-center gap-3">
            <Link to="/" className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center hover:scale-105 transition-transform">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </Link>
            <span className="text-xl font-black text-slate-900 tracking-tight">Vyapaar Flow</span>
          </div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Welcome back</h2>
            <p className="text-slate-500 font-medium">Log in to manage your invoices and clients.</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="mt-8">
            <button className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-bold transition-all shadow-sm">
              <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/><path fill="none" d="M1 1h22v22H1z"/></svg>
              Sign in with Google
            </button>

            <div className="my-6 flex items-center">
              <div className="flex-1 border-t border-slate-200"></div>
              <span className="px-3 text-xs font-bold text-slate-400 uppercase tracking-widest">Or with email</span>
              <div className="flex-1 border-t border-slate-200"></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Email Address</label>
                <input
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@company.com"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 placeholder-slate-400 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest">Password</label>
                  <span className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 cursor-pointer">Forgot password?</span>
                </div>
                <input
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 placeholder-slate-400 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                />
              </div>

              {error && (
                <div className="text-red-500 text-xs font-bold bg-red-50 p-3 rounded-lg border border-red-100 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-slate-900 hover:bg-indigo-600 text-white text-sm font-black rounded-xl transition-all shadow-md disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? 'Authenticating...' : 'Sign in securely'}
              </button>
            </form>

            <p className="mt-8 text-center text-sm font-medium text-slate-500">
              Don't have an account?{' '}
              <Link to="/signup" className="text-indigo-600 font-bold hover:text-indigo-700">Start for free</Link>
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right side: Abstract Product Visual */}
      <div className="hidden lg:flex w-1/2 bg-slate-100 relative items-center justify-center overflow-hidden">
        {/* Decorative Grid */}
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        
        {/* Floating UI Element */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
          className="relative z-10 w-[400px] bg-white rounded-2xl shadow-2xl border border-slate-200/60 p-6 overflow-hidden"
        >
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
             <div className="flex items-center gap-2">
               <div className="w-8 h-8 bg-slate-100 rounded-lg"></div>
               <div>
                 <div className="h-2 w-20 bg-slate-200 rounded mb-2"></div>
                 <div className="h-1.5 w-12 bg-slate-100 rounded"></div>
               </div>
             </div>
             <div className="h-6 w-16 bg-emerald-50 rounded-full border border-emerald-100"></div>
          </div>
          
          <div className="space-y-4 mb-6">
            <div className="h-3 w-full bg-slate-50 rounded"></div>
            <div className="h-3 w-5/6 bg-slate-50 rounded"></div>
            <div className="h-3 w-4/6 bg-slate-50 rounded"></div>
          </div>

          <div className="bg-slate-50 rounded-xl p-4">
             <div className="flex justify-between items-center mb-2">
               <div className="h-2 w-16 bg-slate-200 rounded"></div>
               <div className="h-2 w-12 bg-slate-200 rounded"></div>
             </div>
             <div className="flex justify-between items-center">
               <div className="h-3 w-24 bg-slate-300 rounded"></div>
               <div className="h-3 w-20 bg-indigo-200 rounded"></div>
             </div>
          </div>
        </motion.div>
      </div>

    </div>
  );
};

export default Auth;

