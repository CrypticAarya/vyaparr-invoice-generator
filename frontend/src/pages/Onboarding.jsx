import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { updateProfile } from '../api';

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
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <span className="text-sm font-black text-slate-900 uppercase tracking-tighter">Vyapaar Flow</span>
        </div>
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Setup Phase {step} / 3</div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-xl bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="p-8 sm:p-12">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">Workspace Configuration</h2>
                  <p className="text-sm font-medium text-slate-500 mb-8">Select your primary business model to optimize your workflow.</p>
                  
                  <div className="space-y-3 mb-10">
                    {[
                      { id: 'freelancer', title: 'Freelancer / Individual', desc: 'Personal branding, direct billing.' },
                      { id: 'agency', title: 'Agency / Business Entity', desc: 'Multiple projects, GST-registered.' },
                      { id: 'retail', title: 'Retail / Trading', desc: 'Product inventory and supply chain.' }
                    ].map(type => (
                      <div 
                        key={type.id}
                        onClick={() => setFormData({...formData, businessType: type.id})}
                        className={`cursor-pointer rounded-xl p-4 border transition-all flex items-center justify-between ${formData.businessType === type.id ? 'border-slate-900 bg-slate-50' : 'border-slate-100 hover:border-slate-300'}`}
                      >
                        <div>
                          <p className="text-sm font-bold text-slate-900">{type.title}</p>
                          <p className="text-xs text-slate-500">{type.desc}</p>
                        </div>
                        <div className={`w-4 h-4 rounded-full border-2 ${formData.businessType === type.id ? 'border-slate-900 bg-slate-900' : 'border-slate-200'}`}>
                          {formData.businessType === type.id && <div className="w-full h-full border-2 border-white rounded-full"></div>}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex justify-end pt-6 border-t border-slate-50">
                    <button onClick={handleNext} className="btn btn-primary px-8">Next Step</button>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">Legal Identity</h2>
                  <p className="text-sm font-medium text-slate-500 mb-8">Enter your registered business details for tax-compliant invoicing.</p>
                  
                  <div className="space-y-4 mb-10">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Legal Name</label>
                      <input name="businessName" value={formData.businessName} onChange={handleChange} placeholder="Acme Inc." className="input-field" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">GSTIN / PAN</label>
                      <input name="gstin" value={formData.gstin} onChange={handleChange} placeholder="27AAACR1234A1Z1" className="input-field uppercase" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Registered Address</label>
                      <textarea name="businessAddress" value={formData.businessAddress} onChange={handleChange} rows={3} placeholder="Full address for tax purposes..." className="input-field py-3" />
                    </div>
                  </div>

                  <div className="flex justify-between pt-6 border-t border-slate-50">
                    <button onClick={handlePrev} className="btn btn-secondary">Back</button>
                    <button onClick={handleNext} disabled={!formData.businessName.trim()} className="btn btn-primary px-8">Continue</button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="step3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">Settlement Details</h2>
                  <p className="text-sm font-medium text-slate-500 mb-8">Configure your preferred payment receiving methods.</p>
                  
                  <div className="space-y-4 mb-10">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">UPI VPA</label>
                      <input name="upiId" value={formData.upiId} onChange={handleChange} placeholder="business@upi" className="input-field" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Bank Transfer Instructions (RTGS/NEFT)</label>
                      <textarea name="bankDetails" value={formData.bankDetails} onChange={handleChange} rows={4} placeholder="Bank: HDFC Bank\nA/C No: 1234567890\nIFSC: HDFC0001234" className="input-field py-3" />
                    </div>
                  </div>

                  <div className="flex justify-between pt-6 border-t border-slate-50">
                    <button onClick={handlePrev} className="btn btn-secondary" disabled={loading}>Back</button>
                    <button onClick={handleSubmit} disabled={loading} className="btn btn-primary px-8">
                      {loading ? 'Finalizing...' : 'Complete Setup'}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        <p className="mt-8 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Secure Cloud Infrastructure • ISO Compliant</p>
      </main>
    </div>
  );
};

export default Onboarding;
