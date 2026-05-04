import React, { useState } from 'react';
import { motion } from 'framer-motion';
import InputGroup from './InputGroup';
import { updateProfile } from '../api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const OnboardingModal = ({ onComplete }) => {
  const { user, login } = useAuth(); // Using login to update the global user state
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    businessName: '',
    businessType: 'freelancer',
    businessAddress: '',
    upiId: '',
    bankDetails: ''
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.businessName.trim()) {
      addToast("Business Name is required", "error");
      return;
    }

    setLoading(true);
    try {
      const updatedUser = await updateProfile(formData);
      // login(userData, token) - we reuse the current token
      const currentToken = localStorage.getItem('vyaparflow_token');
      login({ ...user, ...updatedUser }, currentToken);
      onComplete(updatedUser);
      addToast("Profile completed successfully!");
    } catch (error) {
      addToast("Failed to save profile: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 min-h-screen bg-slate-900/40 backdrop-blur-md z-[100] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="bg-white rounded-[2rem] shadow-[0_20px_80px_rgb(0,0,0,0.15)] max-w-lg w-full overflow-hidden border border-slate-100"
      >
        <div className="h-2 w-full bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600"></div>
        <div className="p-8 sm:p-10">
          <div className="w-12 h-12 bg-violet-100 text-violet-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
          </div>
          <h2 className="text-[28px] font-extrabold text-slate-900 mb-2 tracking-tight">Setup your business profile</h2>
          <p className="text-slate-500 font-medium mb-8 text-[15px]">We'll auto-fill these details and personalize your dashboard based on your business.</p>

          <form onSubmit={handleSubmit} className="space-y-6">

            <div>
              <label className="block text-[12px] font-bold text-gray-400 uppercase tracking-widest mb-3">Business Category</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'freelancer', label: 'Freelancer', icon: '👤' },
                  { id: 'agency', label: 'Agency', icon: '🏢' },
                  { id: 'fitness', label: 'Gym/Fitness', icon: '💪' }
                ].map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => handleChange('businessType', type.id)}
                    className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${formData.businessType === type.id
                        ? 'border-indigo-600 bg-indigo-50/50 shadow-sm'
                        : 'border-slate-100 hover:border-slate-200 bg-white'
                      }`}
                  >
                    <span className="text-xl">{type.icon}</span>
                    <span className={`text-[12px] font-bold ${formData.businessType === type.id ? 'text-indigo-600' : 'text-slate-500'}`}>{type.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <InputGroup
              label="Business Name *"
              placeholder="e.g. Acme Innovations"
              value={formData.businessName}
              onChange={(e) => handleChange('businessName', e.target.value)}
            />

            <InputGroup
              label="Business Address"
              placeholder="123 Business Rd, Tech City"
              multiline={true} rows={2}
              value={formData.businessAddress}
              onChange={(e) => handleChange('businessAddress', e.target.value)}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <InputGroup
                label="UPI ID"
                placeholder="company@bank"
                value={formData.upiId}
                onChange={(e) => handleChange('upiId', e.target.value)}
              />
              <InputGroup
                label="Bank Details"
                placeholder="Routing / Account No."
                value={formData.bankDetails}
                onChange={(e) => handleChange('bankDetails', e.target.value)}
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-4 px-6 bg-slate-900 text-white rounded-2xl font-extrabold text-[15px] hover:bg-black transition-all shadow-[0_4px_20px_rgb(0,0,0,0.1)] flex justify-center items-center gap-2"
            >
              {loading ? 'Saving...' : 'Finish Setup'}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default OnboardingModal;
