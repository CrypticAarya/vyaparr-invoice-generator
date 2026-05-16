import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { login as apiLogin } from '../api';
import Button from '../ui/Button';
import Input from '../ui/Input';

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
      const response = await apiLogin(formData.email, formData.password);
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
    <div className="w-full max-w-[420px] mx-auto animate-in fade-in zoom-in-95 duration-500 relative z-10">
      <div className="premium-card p-10 sm:p-14 relative overflow-hidden bg-white/80 backdrop-blur-xl">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-v-accent to-indigo-400"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-v-accent/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
        
        <div className="mb-10 flex flex-col items-center">
          <Link to="/" className="w-14 h-14 bg-v-accent rounded-2xl flex items-center justify-center mb-6 shadow-[0_10px_25px_-5px_rgba(109,94,245,0.4)] hover:scale-105 transition-transform">
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </Link>
          <h2 className="sketch-title text-4xl font-bold tracking-tight text-center">Welcome back</h2>
          <p className="text-zinc-500 text-[14px] font-medium mt-2">Log in to your workspace</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Work Email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="you@company.com"
          />

          <div className="space-y-2">
            <div className="flex justify-between items-center ml-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Password</label>
              <Link to="/forgot-password" size="xs" className="text-[11px] font-bold text-slate-400 hover:text-v-accent transition-colors">Forgot?</Link>
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
            <div className="text-rose-600 text-[13px] font-bold bg-rose-50 p-4 rounded-2xl border border-rose-100 flex items-center gap-3">
              <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              {error}
            </div>
          )}

          <Button
            type="submit"
            isLoading={loading}
            className="w-full py-4 mt-2 text-[15px]"
          >
            Sign In
          </Button>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-100"></span></div>
            <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest"><span className="bg-white px-4 text-slate-400">Or continue with</span></div>
          </div>

          <Button
            type="button"
            variant="secondary"
            className="w-full py-4 text-[14px] flex items-center justify-center gap-3"
            onClick={() => addToast('Google Authentication is currently in private beta.', 'info')}
            icon={() => (
              <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/><path fill="none" d="M1 1h22v22H1z"/></svg>
            )}
          >
            Continue with Google
          </Button>
        </form>

        <p className="mt-10 text-center text-[14px] font-medium text-zinc-500">
          New here?{' '}
          <Link to="/signup" className="text-v-accent font-bold hover:underline transition-colors">Create account</Link>
        </p>
      </div>
      
      <div className="mt-10 text-center">
        <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-[0.2em]">© 2026 VyapaarFlow • Private Beta</p>
      </div>
    </div>
  );
};

export default Auth;
