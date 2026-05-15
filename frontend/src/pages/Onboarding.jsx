import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { updateProfile } from '../api';
import Button from '../ui/Button';
import Input from '../ui/Input';

const Onboarding = () => {
  const { user, login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    businessName: '',
    businessType: 'freelancer',
    businessAddress: '',
    gstin: '',
    upiId: '',
    bankDetails: ''
  });

  useEffect(() => {
    if (user?.isOnboarded) {
      navigate('/home');
    }
  }, [user, navigate]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleNext = () => setStep(s => s + 1);
  const handlePrev = () => setStep(s => s - 1);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const updatedUser = await updateProfile({ ...formData, isOnboarded: true });
      const token = localStorage.getItem('vyaparflow_token');
      login(updatedUser, token);
      addToast('Profile setup complete', 'success');
      navigate('/home');
    } catch (error) {
      addToast(error.message || 'Setup failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090B] flex flex-col font-inter">
      <header className="h-20 bg-[#121217]/50 backdrop-blur-xl border-b border-[#1E1E24] px-8 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <span className="text-lg font-bold text-white tracking-tight">VyapaarFlow</span>
        </div>
        <div className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest bg-zinc-800/50 px-3 py-1 rounded-full border border-white/5">Setup Phase {step} / 3</div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/5 via-transparent to-transparent">
        <div className="w-full max-w-xl bg-[#121217] border border-[#1E1E24] rounded-3xl shadow-2xl shadow-black/50 overflow-hidden animate-in zoom-in-95 duration-500">
          <div className="p-8 sm:p-12">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <h2 className="text-2xl font-bold text-white mb-2">Workspace Configuration</h2>
                  <p className="text-[13px] font-medium text-zinc-500 mb-8">Select your primary business model to optimize your workflow.</p>
                  
                  <div className="space-y-3 mb-10">
                    {[
                      { id: 'freelancer', title: 'Freelancer / Individual', desc: 'Personal branding, direct billing.' },
                      { id: 'agency', title: 'Agency / Business Entity', desc: 'Multiple projects, GST-registered.' },
                      { id: 'retail', title: 'Retail / Trading', desc: 'Product inventory and supply chain.' }
                    ].map(type => (
                      <div 
                        key={type.id}
                        onClick={() => setFormData({...formData, businessType: type.id})}
                        className={`cursor-pointer rounded-2xl p-5 border transition-all flex items-center justify-between group ${formData.businessType === type.id ? 'border-indigo-500 bg-indigo-500/5' : 'border-zinc-800/50 hover:border-zinc-700 hover:bg-zinc-800/30'}`}
                      >
                        <div>
                          <p className={`text-[15px] font-bold transition-colors ${formData.businessType === type.id ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-200'}`}>{type.title}</p>
                          <p className="text-[12px] font-medium text-zinc-500">{type.desc}</p>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 transition-all flex items-center justify-center ${formData.businessType === type.id ? 'border-indigo-500' : 'border-zinc-700'}`}>
                          {formData.businessType === type.id && <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full"></div>}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex justify-end pt-8 border-t border-zinc-800/50">
                    <Button onClick={handleNext} className="px-10 py-3">Next Step</Button>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <h2 className="text-2xl font-bold text-white mb-2">Legal Identity</h2>
                  <p className="text-[13px] font-medium text-zinc-500 mb-8">Enter your registered business details for tax-compliant invoicing.</p>
                  
                  <div className="space-y-5 mb-10">
                    <Input 
                      label="Legal Business Name" 
                      name="businessName" 
                      value={formData.businessName} 
                      onChange={handleChange} 
                      placeholder="Acme Inc." 
                    />
                    <Input 
                      label="GSTIN / PAN (Optional)" 
                      name="gstin" 
                      value={formData.gstin} 
                      onChange={handleChange} 
                      placeholder="27AAACR1234A1Z1" 
                      className="uppercase"
                    />
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 block">Registered Address</label>
                      <textarea 
                        name="businessAddress" 
                        value={formData.businessAddress} 
                        onChange={handleChange} 
                        rows={3} 
                        placeholder="Full address for tax purposes..." 
                        className="w-full bg-[#121217] border border-[#1E1E24] rounded-xl px-4 py-3 text-[13px] font-medium text-white placeholder-zinc-600 outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                      />
                    </div>
                  </div>

                  <div className="flex justify-between pt-8 border-t border-zinc-800/50">
                    <Button variant="secondary" onClick={handlePrev}>Back</Button>
                    <Button onClick={handleNext} disabled={!formData.businessName.trim()} className="px-10">Continue</Button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <h2 className="text-2xl font-bold text-white mb-2">Settlement Details</h2>
                  <p className="text-[13px] font-medium text-zinc-500 mb-8">Configure your preferred payment receiving methods.</p>
                  
                  <div className="space-y-5 mb-10">
                    <Input 
                      label="UPI ID / VPA" 
                      name="upiId" 
                      value={formData.upiId} 
                      onChange={handleChange} 
                      placeholder="business@upi" 
                    />
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 block">Bank Transfer Instructions</label>
                      <textarea 
                        name="bankDetails" 
                        value={formData.bankDetails} 
                        onChange={handleChange} 
                        rows={4} 
                        placeholder="Bank: HDFC Bank\nA/C No: 1234567890\nIFSC: HDFC0001234" 
                        className="w-full bg-[#121217] border border-[#1E1E24] rounded-xl px-4 py-3 text-[13px] font-medium text-white placeholder-zinc-600 outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                      />
                    </div>
                  </div>

                  <div className="flex justify-between pt-8 border-t border-zinc-800/50">
                    <Button variant="secondary" onClick={handlePrev} disabled={loading}>Back</Button>
                    <Button onClick={handleSubmit} isLoading={loading} className="px-10">
                      Complete Setup
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        <p className="mt-10 text-[10px] font-bold text-zinc-600 uppercase tracking-[0.3em]">Secure Cloud Infrastructure • ISO 27001</p>
      </main>
    </div>
  );
};

export default Onboarding;

