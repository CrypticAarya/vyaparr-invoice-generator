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
      const response = await loginUser(formData.email, formData.password);
      const { token, refreshToken, user } = response.data;
      
      login(user, token, refreshToken);
      addToast('Welcome back', 'success');
      
      if (user.isOnboarded) {
        navigate('/home');
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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-[420px]">
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8 sm:p-10">
          
          <div className="mb-8 flex flex-col items-center">
            <Link to="/" className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </Link>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight text-center">Log in to Vyapaar Flow</h2>
            <p className="text-slate-500 text-sm font-medium mt-1">Manage your business invoicing</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Work Email</label>
              <input
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="you@company.com"
                className="input-field"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5 ml-1">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">Password</label>
                <Link to="/forgot-password" size="xs" className="text-xs font-bold text-slate-400 hover:text-slate-900 transition-colors">Forgot?</Link>
              </div>
              <input
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="input-field"
              />
            </div>

            {error && (
              <div className="text-rose-600 text-xs font-bold bg-rose-50 p-3 rounded-lg border border-rose-100 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn btn-primary py-3"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          <p className="mt-8 text-center text-sm font-medium text-slate-500">
            New here?{' '}
            <Link to="/signup" className="text-slate-900 font-bold hover:underline">Create an account</Link>
          </p>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">© 2026 Vyapaar Flow</p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
