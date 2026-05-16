import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { forgotPassword } from '../api';
import Button from '../ui/Button';
import Input from '../ui/Input';

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const { addToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await forgotPassword(email);
      setSuccess(true);
      addToast('Reset link sent to your email', 'success');
    } catch (err) {
      setError(err.message || 'Failed to send reset email');
      addToast('Request failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[420px] mx-auto animate-in fade-in zoom-in-95 duration-500 relative z-10">
      <div className="premium-card p-10 sm:p-14 relative overflow-hidden bg-white/80 backdrop-blur-xl">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-v-accent to-v-sky"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-v-sky/30 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
        
        <div className="mb-10 flex flex-col items-center">
          <Link to="/login" className="w-14 h-14 bg-v-accent rounded-2xl flex items-center justify-center mb-6 shadow-[0_10px_25px_-5px_rgba(109,94,245,0.4)] hover:scale-105 transition-transform">
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          </Link>
          <h2 className="sketch-title text-4xl font-bold tracking-tight text-center">Reset Password</h2>
          <p className="text-zinc-500 text-[14px] font-medium mt-2 text-center">
            {success ? "Check your email for the reset link." : "Enter your email to receive a reset link."}
          </p>
        </div>

        {!success ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Work Email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
            />

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
              Send Reset Link
            </Button>
          </form>
        ) : (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            </div>
            <Link to="/login" className="block w-full btn-premium btn-premium-secondary py-4 text-[15px]">
              Return to login
            </Link>
          </div>
        )}

      </div>
      
      <div className="mt-10 text-center">
        <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-[0.2em]">© 2026 VyapaarFlow</p>
      </div>
    </div>
  );
};

export default ForgotPassword;
