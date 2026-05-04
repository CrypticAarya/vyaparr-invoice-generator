import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { updateProfile } from '../api';
import { motion } from 'framer-motion';

export default function Settings() {
  const { user, login, logout } = useAuth();
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    businessName: user?.businessName || '',
    businessType: user?.businessType || '',
    businessAddress: user?.businessAddress || '',
    upiId: user?.upiId || '',
    bankDetails: user?.bankDetails || ''
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updatedUser = await updateProfile(formData);
      login(updatedUser, localStorage.getItem('vyaparflow_token'));
      addToast('Business settings updated successfully!', 'success');
    } catch (err) {
      addToast('Failed to update settings: ' + err.message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="page-container">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-500 font-medium mt-1">Configure your business profile and application preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="premium-card p-6"
          >
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Business Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">Business Name</label>
                <input name="businessName" type="text" value={formData.businessName} onChange={handleChange} className="input-field mt-1" />
              </div>
              <div>
                <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">Business Type</label>
                <input name="businessType" type="text" value={formData.businessType} onChange={handleChange} className="input-field mt-1" />
              </div>
              <div className="md:col-span-2">
                <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">Address</label>
                <textarea name="businessAddress" value={formData.businessAddress} onChange={handleChange} className="input-field mt-1 h-24" />
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
              <button onClick={handleSave} disabled={isSaving} className="btn-primary">
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="premium-card p-6"
          >
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              Payment Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">UPI ID</label>
                <input name="upiId" type="text" value={formData.upiId} onChange={handleChange} className="input-field mt-1" placeholder="example@upi" />
              </div>
              <div className="md:col-span-2">
                <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">Bank Details</label>
                <textarea name="bankDetails" value={formData.bankDetails} onChange={handleChange} className="input-field mt-1 h-20" placeholder="Bank Name, A/C No, IFSC..." />
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
              <button onClick={handleSave} disabled={isSaving} className="btn-primary">
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </motion.div>
        </div>

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="premium-card p-6"
          >
            <h3 className="text-lg font-bold text-slate-900 mb-4">Account</h3>
            <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl">
              <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-bold text-slate-900">{user?.name}</p>
                <p className="text-xs text-slate-500">{user?.email}</p>
              </div>
            </div>
            <button onClick={logout} className="w-full mt-6 text-rose-500 font-bold text-sm hover:bg-rose-50 py-2 rounded-lg transition-colors">
              Sign Out
            </button>
          </motion.div>

          <div className="premium-card p-6 bg-indigo-600 text-white">
            <h3 className="text-lg font-bold">Help & Support</h3>
            <p className="text-indigo-100 text-sm mt-2 leading-relaxed">
              Need assistance with GST filings or invoice automation? Our experts are here to help.
            </p>
            <button className="w-full mt-4 py-2 bg-white text-indigo-600 font-bold rounded-lg hover:bg-indigo-50 transition-colors text-sm">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
