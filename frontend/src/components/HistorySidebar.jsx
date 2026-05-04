import React from 'react';
import { motion } from 'framer-motion';

const HistorySidebar = ({ history, onClose, onSelect, onManage }) => {
  const formatCurrency = (amount) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-slate-900/10 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-[0_0_80px_rgb(0,0,0,0.1)] z-50 flex flex-col border-l border-slate-100"
      >
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
          <h2 className="text-[18px] font-extrabold text-slate-900 tracking-tight">Invoice History</h2>
          <button onClick={onClose} className="p-2 bg-slate-50 rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
          {history.length === 0 ? (
            <p className="text-slate-400 text-[14px] font-semibold text-center mt-10">No saved invoices yet.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {history.map((inv) => (
                <motion.div
                  whileHover={{ scale: 1.02, y: -2 }}
                  key={inv._id}
                  onClick={() => onSelect(inv)}
                  className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-[0_4px_12px_rgb(0,0,0,0.02)] cursor-pointer hover:border-violet-300 hover:shadow-[0_8px_24px_rgb(139,92,246,0.08)] transition-all group"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex flex-col">
                      <span className="font-extrabold text-slate-900 text-[15px]">{inv.invoiceNumber}</span>
                      <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md mt-1 w-fit ${
                        inv.status === 'paid' ? 'bg-emerald-100 text-emerald-700' : 
                        inv.status === 'final' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {inv.status}
                      </span>
                    </div>
                    <span className="font-extrabold text-violet-700 text-[14px] bg-violet-50 px-2.5 py-1 rounded-lg">{formatCurrency(inv.total)}</span>
                  </div>
                  <p className="text-[14px] font-bold text-slate-500 mb-1 truncate">{inv.clientName}</p>
                  <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-100">
                    <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">Saved {new Date(inv.createdAt).toLocaleDateString()}</p>
                    <div className="flex gap-2">
                      {inv.status !== 'draft' && (
                        <button 
                          onClick={(e) => { e.stopPropagation(); onManage(inv); }}
                          className="text-[10px] font-black text-emerald-600 hover:text-emerald-800 uppercase tracking-widest bg-emerald-50 px-2 py-1 rounded"
                        >
                          Manage
                        </button>
                      )}
                      <button 
                        onClick={(e) => { e.stopPropagation(); onSelect({ ...inv, _id: undefined, invoiceNumber: 'INV-' + Math.floor(1000 + Math.random() * 9000) }); }}
                        className="text-[10px] font-black text-indigo-600 hover:text-indigo-800 uppercase tracking-widest bg-indigo-50 px-2 py-1 rounded"
                      >
                        Duplicate
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
};

export default HistorySidebar;
