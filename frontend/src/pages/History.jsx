import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getInvoices, deleteInvoice } from '../api';
import { useToast } from '../context/ToastContext';
import { DEMO_INVOICES } from '../utils/demoData';
import { useNavigate } from 'react-router-dom';

export default function History() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const { addToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const data = await getInvoices();
      const filtered = (data || []).filter(inv => inv.status !== 'draft');
      if (filtered.length > 0) {
        setInvoices(filtered);
      } else {
        setInvoices(DEMO_INVOICES.filter(i => i.status === 'final'));
      }
    } catch (err) {
      setInvoices(DEMO_INVOICES.filter(i => i.status === 'final'));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Archive this invoice permanently?')) {
      try {
        await deleteInvoice(id);
        addToast('Invoice archived', 'success');
        loadHistory();
      } catch (err) {
        addToast('Failed to archive', 'error');
      }
    }
  };

  const handleDuplicate = (invoice) => {
    const { _id, createdAt, updatedAt, ...rest } = invoice;
    navigate('/new-invoice', { state: { resumeInvoice: { ...rest, status: 'draft', invoiceNumber: rest.invoiceNumber + '-COPY' } } });
  };

  return (
    <div className="page-container">
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Invoice Archive</h1>
          <p className="text-slate-500 font-bold text-lg mt-2">History of finalized revenue documents and settled accounts.</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-2xl">
          {['all', 'paid', 'pending'].map(t => (
            <button 
              key={t} 
              onClick={() => setFilter(t)}
              className={`px-6 py-2.5 text-[11px] font-black rounded-xl transition-all uppercase tracking-widest ${filter === t ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="p-20 flex justify-center"><div className="w-10 h-10 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin"></div></div>
      ) : invoices.length === 0 ? (
        <div className="premium-card p-20 text-center bg-white/50 border-dashed border-2">
          <h3 className="text-xl font-black text-slate-900 mb-2">No History Recorded</h3>
          <p className="text-slate-500 font-bold">You haven't finalized any invoices yet. Complete a draft to see it here.</p>
        </div>
      ) : (
        <div className="premium-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-10 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">Document</th>
                  <th className="px-10 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">Client</th>
                  <th className="px-10 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                  <th className="px-10 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                  <th className="px-10 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-10 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {invoices.map((inv) => (
                  <tr key={inv._id} className="hover:bg-slate-50/80 transition-all group">
                    <td className="px-10 py-6">
                      <p className="text-sm font-black text-slate-900 group-hover:text-indigo-600 transition-colors">#{inv.invoiceNumber}</p>
                      <p className="text-[10px] font-bold text-slate-400 mt-0.5">FINALIZED</p>
                    </td>
                    <td className="px-10 py-6 text-sm font-bold text-slate-600">{inv.clientName}</td>
                    <td className="px-10 py-6 text-sm font-medium text-slate-500">{new Date(inv.dateIssued || inv.createdAt).toLocaleDateString()}</td>
                    <td className="px-10 py-6 text-sm font-black text-slate-900">₹{(inv.total || 0).toLocaleString()}</td>
                    <td className="px-10 py-6">
                      <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                        inv.status === 'paid' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                        inv.status === 'partial' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                        inv.status === 'overdue' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                        'bg-amber-50 text-amber-600 border-amber-100'
                      }`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleDuplicate(inv)}
                          className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                          title="Duplicate/Re-issue"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 5.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" /></svg>
                        </button>
                        <button 
                          className="p-2.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all"
                          title="Export PDF"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        </button>
                        <button 
                          onClick={() => handleDelete(inv._id)}
                          className="p-2.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                          title="Delete Record"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
