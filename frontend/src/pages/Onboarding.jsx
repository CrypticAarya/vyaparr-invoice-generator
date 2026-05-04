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
    // If somehow they get here but are already onboarded
    if (user?.isOnboarded) {
      navigate('/new-invoice');
    }
  }, [user, navigate]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleNext = () => setStep(s => s + 1);
  const handlePrev = () => setStep(s => s - 1);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const updatedUser = await updateProfile({
        ...formData,
        isOnboarded: true
      });
      // Refresh context token/user
      const token = localStorage.getItem('vyaparflow_token');
      login(updatedUser, token);
      
      addToast('Onboarding complete! Welcome aboard.', 'success');
      navigate('/new-invoice');
    } catch (error) {
      addToast(error.message || 'Failed to save profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { num: 1, title: 'Welcome' },
    { num: 2, title: 'Business' },
    { num: 3, title: 'Payments' }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Header */}
      <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <span className="text-lg font-black tracking-tight text-slate-900">Vyapaar Flow</span>
        </div>
        <div className="text-sm font-bold text-slate-400">Step {step} of 3</div>
      </header>

      {/* Main Wizard */}
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        
        {/* Progress Bar */}
        <div className="w-full max-w-2xl mb-12 flex justify-between items-center relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 rounded-full z-0"></div>
          <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-indigo-600 rounded-full z-0 transition-all duration-500 ease-out" style={{ width: `${((step - 1) / 2) * 100}%` }}></div>
          
          {steps.map(s => (
            <div key={s.num} className="relative z-10 flex flex-col items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm transition-colors duration-300 ${step >= s.num ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'bg-slate-200 text-slate-400'}`}>
                {step > s.num ? <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg> : s.num}
              </div>
              <span className={`text-[10px] uppercase tracking-widest font-bold absolute -bottom-6 whitespace-nowrap ${step >= s.num ? 'text-indigo-600' : 'text-slate-400'}`}>{s.title}</span>
            </div>
          ))}
        </div>

        {/* Wizard Card */}
        <div className="w-full max-w-2xl bg-white rounded-3xl shadow-[0_20px_60px_rgb(0,0,0,0.04)] border border-slate-200 overflow-hidden">
          <div className="p-10 sm:p-14 min-h-[400px] flex flex-col">
            <AnimatePresence mode="wait">
              
              {/* STEP 1: Welcome & Persona */}
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1 flex flex-col">
                  <h2 className="text-3xl font-black text-slate-900 mb-2">Welcome to the future of billing.</h2>
                  <p className="text-slate-500 font-medium mb-10">Let's set up your workspace. How do you identify your business?</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    {[
                      { id: 'freelancer', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', title: 'Freelancer' },
                      { id: 'agency', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4', title: 'Agency / Studio' },
                      { id: 'retail', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z', title: 'Retail / Product' }
                    ].map(type => (
                      <div 
                        key={type.id}
                        onClick={() => setFormData({...formData, businessType: type.id})}
                        className={`cursor-pointer rounded-2xl p-6 border-2 transition-all flex flex-col items-center gap-4 ${formData.businessType === type.id ? 'border-indigo-600 bg-indigo-50 shadow-sm' : 'border-slate-100 bg-white hover:border-slate-300 hover:bg-slate-50'}`}
                      >
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${formData.businessType === type.id ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={type.icon} /></svg>
                        </div>
                        <span className={`font-bold ${formData.businessType === type.id ? 'text-indigo-900' : 'text-slate-600'}`}>{type.title}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-auto pt-8 border-t border-slate-100 flex justify-end">
                    <button onClick={handleNext} className="px-8 py-3 bg-slate-900 hover:bg-indigo-600 text-white text-sm font-black rounded-xl transition-all shadow-md flex items-center gap-2 uppercase tracking-widest">
                      Continue
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: Business Details */}
              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1 flex flex-col">
                  <h2 className="text-3xl font-black text-slate-900 mb-2">Business Identity</h2>
                  <p className="text-slate-500 font-medium mb-8">This information will appear on your professional invoices.</p>
                  
                  <div className="space-y-5 mb-8">
                    <div>
                      <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Legal Business Name</label>
                      <input name="businessName" value={formData.businessName} onChange={handleChange} placeholder="Acme Corporation" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 placeholder-slate-400 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1.5">GSTIN / PAN (Optional)</label>
                        <input name="gstin" value={formData.gstin} onChange={handleChange} placeholder="27AAACR1234A1Z1" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 placeholder-slate-400 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all uppercase" />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Registered Address</label>
                        <textarea name="businessAddress" value={formData.businessAddress} onChange={handleChange} placeholder="123 Corporate Blvd, Mumbai" rows={3} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 placeholder-slate-400 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all resize-none" />
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto pt-8 border-t border-slate-100 flex justify-between">
                    <button onClick={handlePrev} className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-black rounded-xl transition-all uppercase tracking-widest">Back</button>
                    <button onClick={handleNext} disabled={!formData.businessName.trim()} className="px-8 py-3 bg-slate-900 hover:bg-indigo-600 text-white text-sm font-black rounded-xl transition-all shadow-md flex items-center gap-2 uppercase tracking-widest disabled:opacity-50">
                      Continue
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: Payment Details */}
              {step === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1 flex flex-col">
                  <h2 className="text-3xl font-black text-slate-900 mb-2">How do you get paid?</h2>
                  <p className="text-slate-500 font-medium mb-8">Add your bank or UPI details so clients can pay you instantly.</p>
                  
                  <div className="space-y-5 mb-8">
                    <div>
                      <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1.5 flex justify-between">
                        <span>UPI ID / VPA</span>
                        <span className="text-indigo-400">Recommended</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                        </div>
                        <input name="upiId" value={formData.upiId} onChange={handleChange} placeholder="yourbusiness@icici" className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 placeholder-slate-400 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all" />
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 my-2">
                      <div className="h-[1px] flex-1 bg-slate-200"></div>
                      <span className="text-xs font-black text-slate-300 uppercase tracking-widest">AND / OR</span>
                      <div className="h-[1px] flex-1 bg-slate-200"></div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Bank Account Details (NEFT/RTGS)</label>
                      <textarea name="bankDetails" value={formData.bankDetails} onChange={handleChange} placeholder="Account Name: Acme Corp\nA/C No: 1234567890\nIFSC: HDFC0001234\nBank: HDFC Bank" rows={4} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 placeholder-slate-400 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all resize-none leading-relaxed" />
                    </div>
                  </div>

                  <div className="mt-auto pt-8 border-t border-slate-100 flex justify-between">
                    <button onClick={handlePrev} disabled={loading} className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-black rounded-xl transition-all uppercase tracking-widest">Back</button>
                    <button onClick={handleSubmit} disabled={loading} className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-black rounded-xl transition-all shadow-[0_8px_20px_rgb(79,70,229,0.3)] flex items-center gap-2 uppercase tracking-widest">
                      {loading ? 'Finalizing...' : 'Complete Setup'}
                      {!loading && <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
                    </button>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>
        
        <p className="mt-8 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">
          Secure, Encrypted, and 100% Private.
        </p>
      </main>

    </div>
  );
};

export default Onboarding;
