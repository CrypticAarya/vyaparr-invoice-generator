import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { updateBusinessProfile, seedUser } from '../api';

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
  const [isSeeding, setIsSeeding] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updatedUser = await updateBusinessProfile(formData);
      login(updatedUser, localStorage.getItem('vyaparflow_token'));
      addToast('Profile updated successfully', 'success');
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSeed = async () => {
    if (!window.confirm('This will populate your account with demo data. Continue?')) return;
    setIsSeeding(true);
    try {
      const res = await seedUser();
      addToast('Demo data seeded! Refreshing...', 'success');
      setTimeout(() => window.location.reload(), 1500);
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Settings</h1>
        <p className="text-xs font-medium text-slate-500">Manage your business profile and preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-8 space-y-6">
          {/* Business Profile */}
          <div className="data-card">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">Business Profile</h3>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="col-span-2 sm:col-span-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Legal Name</label>
                <input name="businessName" value={formData.businessName} onChange={handleChange} className="input-field" placeholder="Acme Inc." />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Entity Type</label>
                <input name="businessType" value={formData.businessType} onChange={handleChange} className="input-field" placeholder="Freelancer / Private Ltd" />
              </div>
              <div className="col-span-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Registered Address</label>
                <textarea name="businessAddress" value={formData.businessAddress} onChange={handleChange} rows={3} className="input-field py-2" placeholder="Street, City, State, ZIP" />
              </div>
            </div>
            <div className="flex justify-end pt-4 border-t border-slate-50">
              <button onClick={handleSave} disabled={isSaving} className="btn btn-primary px-6">
                {isSaving ? 'Saving...' : 'Update Profile'}
              </button>
            </div>
          </div>

          {/* Payment Settings */}
          <div className="data-card">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">Settlement Methods</h3>
            <div className="space-y-4 mb-6">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">UPI VPA</label>
                <input name="upiId" value={formData.upiId} onChange={handleChange} className="input-field" placeholder="business@upi" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Bank Instructions (RTGS/NEFT)</label>
                <textarea name="bankDetails" value={formData.bankDetails} onChange={handleChange} rows={4} className="input-field py-2" placeholder="Bank Name\nA/C No\nIFSC Code" />
              </div>
            </div>
            <div className="flex justify-end pt-4 border-t border-slate-50">
              <button onClick={handleSave} disabled={isSaving} className="btn btn-primary px-6">
                Save Changes
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Actions */}
        <div className="md:col-span-4 space-y-6">
          <div className="data-card bg-slate-50 border-slate-200">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Account</h3>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white font-bold text-sm">
                {user?.name?.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">{user?.name}</p>
                <p className="text-[10px] font-medium text-slate-500 truncate max-w-[120px]">{user?.email}</p>
              </div>
            </div>
            <button onClick={logout} className="w-full btn btn-secondary text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition-colors">
              Sign Out
            </button>
          </div>

          <div className="data-card bg-slate-900 border-slate-800">
            <h3 className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-3">Developer / Demo</h3>
            <p className="text-[11px] text-slate-400 mb-4 leading-relaxed">
              Populate your workspace with realistic business data for demonstration purposes.
            </p>
            <button 
              onClick={handleSeed} 
              disabled={isSeeding}
              className="w-full btn btn-accent"
            >
              {isSeeding ? 'Seeding...' : 'Seed Demo Data'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
