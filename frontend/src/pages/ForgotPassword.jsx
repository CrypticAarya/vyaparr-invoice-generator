import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { forgotPassword } from '../api';
import Button from '../ui/Button';
import Input from '../ui/Input';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      await forgotPassword(email);
      setStatus({ type: 'success', message: 'If an account exists, a reset link has been sent.' });
    } catch (err) {
      setStatus({ type: 'error', message: 'Failed to request reset. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-10"
      >
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Recover Access</h1>
          <p className="text-slate-500 font-bold mt-2">Enter your email to receive a secure reset link.</p>
        </div>

        {status.message && (
          <div className={`mb-6 p-4 rounded-2xl text-sm font-bold ${status.type === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input 
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@company.com"
            required
          />

          <Button type="submit" loading={loading} className="w-full">
            Send Reset Link
          </Button>
        </form>

        <div className="mt-8 text-center">
          <NavLink to="/login" className="text-sm font-black text-indigo-600 hover:underline">
            Back to Secure Login
          </NavLink>
        </div>
      </motion.div>
    </div>
  );
}
