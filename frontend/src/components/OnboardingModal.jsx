import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { updateBusinessProfile } from '../api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Button from '../ui/Button';
import Input from '../ui/Input';

export default function OnboardingModal({ isOpen }) {
  const { user, login } = useAuth();
  const { addToast } = useToast();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    businessName: '',
    businessType: 'Freelancer',
    currency: 'USD',
    taxRate: 0
  });

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const updatedUser = await updateBusinessProfile({ ...formData, isOnboarded: true });
      login(updatedUser, localStorage.getItem('vyaparflow_token'));
      addToast('Welcome to VyapaarFlow! Your workspace is ready.', 'success');
    } catch (err) {
      addToast('Onboarding failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="w-full max-w-xl bg-white rounded-[40px] shadow-2xl overflow-hidden"
        >
          <div className="h-2 bg-slate-100">
            <motion.div 
              className="h-full bg-v-accent"
              animate={{ width: `${(step / 3) * 100}%` }}
            />
          </div>

          <div className="p-12">
            {step === 1 && (
              <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                <h2 className="sketch-title text-3xl mb-2">Identify Your Business</h2>
                <p className="text-sm font-medium text-slate-500 mb-8">Let's start with the basics of your professional identity.</p>
                <div className="space-y-6">
                  <Input 
                    label="Business Name"
                    placeholder="e.g. Creative Studio" 
                    value={formData.businessName}
                    onChange={e => setFormData({...formData, businessName: e.target.value})}
                  />
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 mb-2 block">Industry / Type</label>
                    <select 
                      className="input-field appearance-none cursor-pointer h-[50px]"
                      value={formData.businessType}
                      onChange={e => setFormData({...formData, businessType: e.target.value})}
                    >
                      <option>Freelancer</option>
                      <option>Agency</option>
                      <option>E-commerce</option>
                      <option>Consultancy</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                <h2 className="sketch-title text-3xl mb-2">Regional Economics</h2>
                <p className="text-sm font-medium text-slate-500 mb-8">Configure your default currency and tax settings.</p>
                <div className="space-y-6">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 mb-2 block">Base Currency</label>
                    <select 
                      className="input-field appearance-none cursor-pointer h-[50px]"
                      value={formData.currency}
                      onChange={e => setFormData({...formData, currency: e.target.value})}
                    >
                      <option>USD ($)</option>
                      <option>INR (₹)</option>
                      <option>EUR (€)</option>
                      <option>GBP (£)</option>
                    </select>
                  </div>
                  <Input 
                    label="Default Tax Rate (%)"
                    type="number"
                    placeholder="18" 
                    value={formData.taxRate}
                    onChange={e => setFormData({...formData, taxRate: parseFloat(e.target.value)})}
                  />
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="text-center">
                <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                </div>
                <h2 className="sketch-title text-3xl mb-2">Ready to Launch</h2>
                <p className="text-sm font-medium text-slate-500 mb-10">You're all set to generate professional invoices and track your growth.</p>
                
                <div className="p-6 bg-slate-50 rounded-2xl text-left border border-slate-100 mb-10">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Workspace Summary</p>
                  <p className="text-sm font-bold text-slate-700">{formData.businessName} • {formData.currency}</p>
                </div>
              </motion.div>
            )}

            <div className="flex items-center justify-between mt-12 pt-8 border-t border-slate-50">
              {step > 1 ? (
                <button onClick={handleBack} className="text-slate-400 font-bold text-[14px] hover:text-slate-600 transition-colors">Back</button>
              ) : <div />}

              {step < 3 ? (
                <Button 
                  onClick={handleNext} 
                  disabled={!formData.businessName}
                  className="px-8"
                >
                  Continue
                </Button>
              ) : (
                <Button 
                  onClick={handleSubmit} 
                  isLoading={loading}
                  className="px-10"
                >
                  Enter Workspace
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
