import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { updateBusinessProfile } from '../api';
import { motion } from 'framer-motion';
import Button from '../ui/Button';
import Input from '../ui/Input';
import TextArea from '../ui/TextArea';

export default function Settings() {
  const { user, login } = useAuth();
  const { addToast } = useToast();
  
  const [formData, setFormData] = useState({
    businessName: '',
    businessType: '',
    businessAddress: '',
    phone: '',
    currency: 'USD',
    taxRate: 0
  });

  useEffect(() => {
    if (user) {
      setFormData({
        businessName: user.businessName || '',
        businessType: user.businessType || '',
        businessAddress: user.businessAddress || '',
        phone: user.phone || '',
        currency: user.currency || 'USD',
        taxRate: user.taxRate || 0
      });
    }
  }, [user]);

  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updatedUser = await updateBusinessProfile(formData);
      login(updatedUser, localStorage.getItem('vyaparflow_token'));
      addToast('Profile synchronized successfully', 'success');
    } catch (err) {
      addToast(err.message || 'Failed to update profile', 'error');
    } finally {
      setIsSaving(false);
    }
  };


  if (!user) return <div className="animate-pulse h-96 bg-white/50 rounded-[32px]" />;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto space-y-10 pb-20"
    >
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Business Workspace</h1>
        <p className="text-sm font-medium text-slate-500">Configure your business profile and document preferences.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-8">
          {/* Identity & Legal */}
          <section className="premium-card p-10">
            <h3 className="text-[11px] font-bold text-indigo-500 uppercase tracking-[0.2em] mb-8">Identity & Entity</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              <div className="sm:col-span-1">
                <Input name="businessName" label="Legal Entity Name" value={formData.businessName} onChange={handleChange} placeholder="Acme Corporation" />
              </div>
              <div className="sm:col-span-1">
                <Input name="businessType" label="Business Type" value={formData.businessType} onChange={handleChange} placeholder="Private Limited" />
              </div>
              <div className="sm:col-span-2">
                <TextArea name="businessAddress" label="Registered Address" value={formData.businessAddress} onChange={handleChange} rows={3} placeholder="123 Innovation Way, Tech Park" />
              </div>
            </div>
          </section>

          <div className="flex items-center justify-between p-2">
            <p className="text-[12px] text-slate-400 font-medium italic">Changes will reflect instantly on all future documents.</p>
            <Button 
              onClick={handleSave} 
              isLoading={isSaving} 
              className="px-10 h-14"
            >
              Save Workspace Changes
            </Button>
          </div>
        </div>

        {/* Action Sidebar */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="premium-card p-8 bg-zinc-900 border-zinc-800 text-white shadow-xl shadow-indigo-500/10">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-xl font-bold border border-white/5">
                {user?.name?.charAt(0)}
              </div>
              <div>
                <p className="font-bold text-white text-lg">{user?.name}</p>
                <p className="text-[11px] font-medium text-zinc-500 uppercase tracking-widest">Active Partner</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between py-3 border-b border-white/5">
                <span className="text-[10px] font-bold text-zinc-500 uppercase">Currency</span>
                <span className="text-xs font-bold">{formData.currency}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-white/5">
                <span className="text-[10px] font-bold text-zinc-500 uppercase">Tax Rate</span>
                <span className="text-xs font-bold">{formData.taxRate}%</span>
              </div>
            </div>
          </div>


        </aside>
      </div>
    </motion.div>
  );
}
