import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { updateBusinessProfile } from '../api';

// UI Components
import Button from '../ui/Button';
import Input from '../ui/Input';
import TextArea from '../ui/TextArea';

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
    gstin: ''
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
      const updatedUser = await updateBusinessProfile({ ...formData, isOnboarded: true });
      // We don't need to re-login, just update the context if needed, 
      // but the API call already updates the user in DB.
      // Redirecting to home will trigger a profile refresh via AuthContext.
      addToast('Onboarding successful. Welcome to VyapaarFlow!', 'success');
      navigate('/home');
    } catch (error) {
      addToast(error.message || 'Setup failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const TOTAL_STEPS = 2;
  const progress = (step / TOTAL_STEPS) * 100;
  const firstName = user?.name?.split(' ')[0] || 'there';

  return (
    <div className="min-h-screen bg-v-bg flex flex-col font-sans selection:bg-v-accent/20">
      {/* Header with progress */}
      <header className="h-20 bg-white/40 backdrop-blur-xl border-b border-black/[0.03] px-8 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-v-accent rounded-xl flex items-center justify-center shadow-lg shadow-v-accent/20">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <span className="text-xl font-bold text-slate-900 tracking-tight">VyapaarFlow</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex gap-2">
            {[1, 2].map(s => (
              <div key={s} className={`transition-all rounded-full h-2 ${ s < step ? 'w-8 bg-v-accent' : s === step ? 'w-8 bg-v-accent/40' : 'w-2 bg-slate-200'}`} />
            ))}
          </div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-white/50 px-4 py-1.5 rounded-full border border-black/[0.03] shadow-sm">
            Step {step} of {TOTAL_STEPS}
          </div>
        </div>
      </header>

      {/* Progress bar */}
      <div className="h-0.5 bg-slate-100">
        <motion.div
          className="h-full bg-v-accent"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
      </div>

      <main className="flex-1 flex flex-col items-center justify-center p-6 relative">
        {/* Decorative background blur */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-v-accent/5 rounded-full blur-[120px] pointer-events-none" />

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-xl premium-card overflow-hidden relative z-10"
        >
          <div className="p-10 sm:p-14">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <div className="flex items-center gap-2 text-[11px] font-bold text-v-accent bg-v-accent/5 w-fit px-3 py-1 rounded-full mb-4">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                    Welcome, {firstName}!
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">What best describes your work?</h2>
                  <p className="text-[14px] font-medium text-slate-500 mb-10">This helps us tailor the workflow and tax settings to your business type.</p>
                  
                  <div className="space-y-4 mb-12">
                    {[
                      { id: 'freelancer', title: 'Freelancer / Solo', desc: 'Direct billing, simplified tax management.' },
                      { id: 'agency', title: 'Agency / Entity', desc: 'Team collaboration and GST-heavy workflows.' },
                      { id: 'retail', title: 'Retail / Merchant', desc: 'Inventory-first sales and stock tracking.' }
                    ].map(type => (
                      <div 
                        key={type.id}
                        onClick={() => setFormData({...formData, businessType: type.id})}
                        className={`cursor-pointer rounded-2xl p-6 border transition-all flex items-center justify-between group ${formData.businessType === type.id ? 'border-v-accent bg-v-accent/[0.02] shadow-sm' : 'border-black/[0.03] bg-white hover:bg-slate-50'}`}
                      >
                        <div>
                          <p className={`text-[15px] font-bold transition-colors ${formData.businessType === type.id ? 'text-v-accent' : 'text-slate-700'}`}>{type.title}</p>
                          <p className="text-[12px] font-medium text-slate-400 mt-0.5">{type.desc}</p>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 transition-all flex items-center justify-center ${formData.businessType === type.id ? 'border-v-accent' : 'border-slate-200'}`}>
                          {formData.businessType === type.id && <div className="w-2.5 h-2.5 bg-v-accent rounded-full"></div>}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex justify-end pt-8 border-t border-slate-50">
                    <Button onClick={handleNext} size="lg">Continue</Button>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">Your Legal Identity</h2>
                  <p className="text-[14px] font-medium text-slate-500 mb-1">These details appear on your invoices for GST compliance.</p>
                  <p className="text-[12px] font-medium text-slate-400 mb-10">💡 Your GSTIN is optional for now — you can add it later from Settings.</p>
                  
                  <div className="space-y-6 mb-12">
                    <Input 
                      label="Business Name" 
                      name="businessName" 
                      value={formData.businessName} 
                      onChange={handleChange} 
                      placeholder="e.g. Acme Studio" 
                    />
                    <Input 
                      label="GSTIN (Optional)" 
                      name="gstin" 
                      value={formData.gstin} 
                      onChange={handleChange} 
                      placeholder="27AAACR1234A1Z1" 
                    />
                    <TextArea 
                      label="Registered Address" 
                      name="businessAddress" 
                      value={formData.businessAddress} 
                      onChange={handleChange} 
                      rows={3} 
                      placeholder="Full billing address..." 
                    />
                  </div>

                  <div className="flex justify-between pt-8 border-t border-slate-50">
                    <Button variant="secondary" onClick={handlePrev}>Back</Button>
                    <Button 
                      onClick={handleSubmit} 
                      disabled={!formData.businessName.trim()} 
                      isLoading={loading}
                      size="lg"
                    >
                      Complete Setup
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
        
        <div className="mt-12 text-center">
          <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.3em]">🔒 End-to-End Encrypted · VyapaarFlow Secure Platform</p>
        </div>
      </main>
    </div>
  );
};

export default Onboarding;
