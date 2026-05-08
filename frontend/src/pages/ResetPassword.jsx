import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate, NavLink } from 'react-router-dom';
import { resetPassword } from '../api';
import Button from '../ui/Button';
import Input from '../ui/Input';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setStatus({ type: 'error', message: 'Passwords do not match.' });
    }

    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      await resetPassword(token, password);
      setStatus({ type: 'success', message: 'Password updated successfully! Redirecting...' });
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setStatus({ type: 'error', message: 'Token is invalid or has expired.' });
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
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Set New Password</h1>
          <p className="text-slate-500 font-bold mt-2">Ensure your new password is secure and unique.</p>
        </div>

        {status.message && (
          <div className={`mb-6 p-4 rounded-2xl text-sm font-bold ${status.type === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input 
            label="New Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />

          <Input 
            label="Confirm New Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            required
          />

          <Button type="submit" loading={loading} className="w-full">
            Reset Password
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
