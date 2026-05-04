import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getInvoices, deleteInvoice } from '../api';
import { useToast } from '../context/ToastContext';
import { DEMO_INVOICES } from '../utils/demoData';
import { useNavigate } from 'react-router-dom';

export default function Drafts() {
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    loadDrafts();
  }, []);

  const loadDrafts = async () => {
    try {
      const data = await getInvoices();
      const filtered = (data || []).filter(inv => inv.status === 'draft');
      if (filtered.length > 0) {
        setDrafts(filtered);
      } else {
        setDrafts(DEMO_INVOICES.filter(i => i.status === 'draft'));
      }
    } catch (err) {
      setDrafts(DEMO_INVOICES.filter(i => i.status === 'draft'));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this draft?')) {
      try {
        await deleteInvoice(id);
        addToast('Draft deleted', 'success');
        loadDrafts();
      } catch (err) {
        addToast('Failed to delete draft', 'error');
      }
    }
  };

  const handleResume = (invoice) => {
    navigate('/new-invoice', { state: { resumeInvoice: invoice } });
  };

  return (
    <div className="page-container">
      <div className="mb-12">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Draft Documents</h1>
        <p className="text-slate-500 font-bold text-lg mt-2">Unfinished invoices and revenue requests in progress.</p>
      </div>

      {loading ? (
        <div className="p-20 flex justify-center"><div className="w-10 h-10 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin"></div></div>
      ) : drafts.length === 0 ? (
        <div className="premium-card p-20 text-center bg-white/50 border-dashed border-2">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          </div>
          <h3 className="text-xl font-black text-slate-900 mb-2">Clean Workspace</h3>
          <p className="text-slate-500 font-bold">You have no active drafts. Every project is accounted for.</p>
          <button onClick={() => navigate('/new-invoice')} className="btn-primary mt-8 mx-auto px-10">Start New Invoice</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode='popLayout'>
            {drafts.map((draft) => (
              <motion.div
                key={draft._id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="premium-card p-8 group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl -mr-12 -mt-12"></div>
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="px-3 py-1 bg-amber-50 text-amber-600 text-[10px] font-black rounded-full uppercase tracking-widest border border-amber-100 mb-4 block w-fit">Draft</span>
                    <h3 className="text-xl font-black text-slate-900">#{draft.invoiceNumber || 'Untitled'}</h3>
                  </div>
                  <button onClick={() => handleDelete(draft._id)} className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center text-[13px]">
                    <span className="text-slate-400 font-bold uppercase tracking-wider">Client</span>
                    <span className="text-slate-900 font-black">{draft.clientName || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center text-[13px]">
                    <span className="text-slate-400 font-bold uppercase tracking-wider">Created</span>
                    <span className="text-slate-600 font-bold">{new Date(draft.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-[13px]">
                    <span className="text-slate-400 font-bold uppercase tracking-wider">Estimated</span>
                    <span className="text-slate-900 font-black text-lg">₹{(draft.total || 0).toLocaleString()}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
                  <button 
                    onClick={() => handleResume(draft)}
                    className="w-full py-3 bg-slate-900 text-white text-[12px] font-black rounded-xl hover:bg-indigo-600 transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    RESUME
                  </button>
                  <button className="w-full py-3 bg-white border border-slate-200 text-slate-600 text-[12px] font-black rounded-xl hover:bg-slate-50 transition-all active:scale-95">
                    DUPLICATE
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
