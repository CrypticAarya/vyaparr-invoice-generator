import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { updatePayment, logCommunication } from '../api';
import { useToast } from '../context/ToastContext';

export default function CollectionModal({ invoice, onClose, onUpdate }) {
  const [activeTab, setActiveTab] = useState('payment');
  const [paymentAmount, setPaymentAmount] = useState(invoice.total - (invoice.paidAmount || 0));
  const [paymentNotes, setPaymentNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const { addToast } = useToast();

  const handleUpdatePayment = async () => {
    setIsSaving(true);
    try {
      const newTotalPaid = (invoice.paidAmount || 0) + Number(paymentAmount);
      const res = await updatePayment(invoice._id, { 
        amount: newTotalPaid, 
        notes: paymentNotes 
      });
      if (res.success) {
        addToast('Payment recorded successfully', 'success');
        onUpdate();
        onClose();
      }
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCommunication = async (type) => {
    try {
      const notes = type === 'email' ? 'Invoice sent via Email' : 'Invoice shared via WhatsApp';
      await logCommunication(invoice._id, { action: type.toUpperCase(), notes });
      addToast(`${type.charAt(0).toUpperCase() + type.slice(1)} shared and logged.`, 'success');
      onUpdate();
    } catch (err) {
      addToast('Failed to log sharing', 'error');
    }
  };

  const formatCurrency = (amount) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" />
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h3 className="text-2xl font-black text-slate-900">{invoice.invoiceNumber}</h3>
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                invoice.status === 'paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
              }`}>
                {invoice.status}
              </span>
            </div>
            <p className="text-sm font-bold text-slate-500">Collection & Communication Hub</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-white rounded-full transition-all shadow-sm">
            <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-100 px-8 bg-slate-50/30">
          {['payment', 'share', 'history'].map(tab => (
            <button 
              key={tab} onClick={() => setActiveTab(tab)}
              className={`px-6 py-4 text-[11px] font-black uppercase tracking-[0.2em] transition-all border-b-2 ${
                activeTab === tab ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          <AnimatePresence mode="wait">
            {activeTab === 'payment' && (
              <motion.div key="payment" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Amount</p>
                    <p className="text-xl font-black text-slate-900">{formatCurrency(invoice.total)}</p>
                  </div>
                  <div className="p-6 bg-indigo-50 rounded-3xl border border-indigo-100">
                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Outstanding</p>
                    <p className="text-xl font-black text-indigo-600">{formatCurrency(invoice.total - (invoice.paidAmount || 0))}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="text-xs font-black text-slate-500 uppercase tracking-[0.15em]">Payment Amount (INR)</label>
                    <input 
                      type="number" value={paymentAmount} onChange={(e) => setPaymentAmount(e.target.value)}
                      className="w-full mt-3 p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl text-lg font-black focus:border-indigo-500 focus:bg-white outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-black text-slate-500 uppercase tracking-[0.15em]">Internal Collection Notes</label>
                    <textarea 
                      value={paymentNotes} onChange={(e) => setPaymentNotes(e.target.value)}
                      placeholder="e.g. Received via GPay, awaiting bank confirmation"
                      className="w-full mt-3 p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl text-md font-bold focus:border-indigo-500 focus:bg-white outline-none transition-all h-32"
                    />
                  </div>
                  <button 
                    disabled={isSaving || paymentAmount <= 0} onClick={handleUpdatePayment}
                    className="w-full py-5 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-500/20 hover:bg-indigo-700 transition-all flex items-center justify-center gap-3"
                  >
                    {isSaving ? 'Processing...' : 'Record Payment Settlement'}
                  </button>
                </div>
              </motion.div>
            )}

            {activeTab === 'share' && (
              <motion.div key="share" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <button 
                    onClick={() => handleCommunication('email')}
                    className="group p-8 border-2 border-slate-100 rounded-[2rem] hover:border-indigo-500 hover:bg-indigo-50 transition-all text-left"
                  >
                    <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    </div>
                    <h4 className="text-lg font-black text-slate-900 mb-1">Send via Email</h4>
                    <p className="text-sm font-bold text-slate-500">Dispatch PDF directly to {invoice.clientEmail}</p>
                  </button>

                  <button 
                    onClick={() => handleCommunication('whatsapp')}
                    className="group p-8 border-2 border-slate-100 rounded-[2rem] hover:border-emerald-500 hover:bg-emerald-50 transition-all text-left"
                  >
                    <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                    </div>
                    <h4 className="text-lg font-black text-slate-900 mb-1">WhatsApp Share</h4>
                    <p className="text-sm font-bold text-slate-500">Send instant link & PDF to customer</p>
                  </button>
                </div>

                <div className="p-8 bg-amber-50 rounded-3xl border border-amber-100">
                  <h4 className="text-sm font-black text-amber-800 mb-2">Pro Tip: Automated Reminders</h4>
                  <p className="text-xs font-bold text-amber-700 leading-relaxed">
                    VyaparFlow AI can automatically trigger these notifications 2 days before the due date. Enable in Global Settings.
                  </p>
                </div>
              </motion.div>
            )}

            {activeTab === 'history' && (
              <motion.div key="history" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-6">
                {(!invoice.communicationLog || invoice.communicationLog.length === 0) ? (
                  <div className="p-12 text-center">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg className="w-10 h-10 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <p className="text-slate-400 font-bold">No communication history logged yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {invoice.communicationLog.map((log, i) => (
                      <div key={i} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                          log.action === 'EMAIL' ? 'bg-indigo-100 text-indigo-600' : 'bg-emerald-100 text-emerald-600'
                        }`}>
                          <span className="text-[10px] font-black">{log.action[0]}</span>
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-900">{log.notes}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{new Date(log.date).toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer info */}
        <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Secure Ledger Access</span>
          </div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">v4.2.0 Sync</span>
        </div>
      </motion.div>
    </div>
  );
}
