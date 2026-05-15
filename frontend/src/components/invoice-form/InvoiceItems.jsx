import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const InvoiceItems = ({ 
  data, updateItem, addItem, removeItem, 
  products, handleProductSelect,
  aiPrompt, setAiPrompt, isGenerating, handleAiGenerate
}) => {
  return (
    <div className="data-card">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Line Items</h3>
        
        {/* Subtle AI Assistant */}
        <div className="flex items-center gap-2 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
          <svg className={`w-3 h-3 text-emerald-500 ${isGenerating ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <input
            type="text"
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            placeholder="Smart Add (e.g. '3 Laptops at 45k')"
            className="bg-transparent text-[10px] font-bold text-slate-700 outline-none w-48 placeholder:text-slate-400"
            onKeyDown={(e) => e.key === 'Enter' && handleAiGenerate(e)}
          />
        </div>
      </div>

      <div className="space-y-3">
        <AnimatePresence mode='popLayout'>
          {data.items.length === 0 ? (
            <div className="py-8 text-center bg-slate-50 rounded-lg border border-dashed border-slate-200">
              <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">No items added yet</p>
            </div>
          ) : (
            data.items.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="p-4 bg-white rounded-lg border border-slate-100 relative group"
              >
                <div className="grid grid-cols-12 gap-3">
                  <div className="col-span-12 sm:col-span-6 space-y-1">
                    <div className="flex justify-between">
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Description</label>
                      <select 
                        onChange={(e) => handleProductSelect(item.id, e.target.value)}
                        className="text-[9px] font-bold text-slate-900 bg-transparent outline-none cursor-pointer"
                      >
                        <option value="">+ Inventory</option>
                        {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                      </select>
                    </div>
                    <input 
                      type="text" 
                      value={item.description} 
                      onChange={(e) => updateItem(item.id, 'description', e.target.value)} 
                      className="w-full bg-white border border-slate-200 rounded px-2 py-1.5 text-xs font-bold text-slate-800 outline-none focus:border-slate-400" 
                    />
                  </div>
                  <div className="col-span-4 sm:col-span-2 space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">HSN</label>
                    <input type="text" value={item.hsn} onChange={(e) => updateItem(item.id, 'hsn', e.target.value)} className="w-full bg-white border border-slate-200 rounded px-2 py-1.5 text-xs font-bold text-slate-800 outline-none" />
                  </div>
                  <div className="col-span-4 sm:col-span-2 space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Qty</label>
                    <input type="number" value={item.qty} onChange={(e) => updateItem(item.id, 'qty', e.target.value)} className="w-full bg-white border border-slate-200 rounded px-2 py-1.5 text-xs font-bold text-slate-800 outline-none" />
                  </div>
                  <div className="col-span-4 sm:col-span-2 space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Rate</label>
                    <input type="number" value={item.rate} onChange={(e) => updateItem(item.id, 'rate', e.target.value)} className="w-full bg-white border border-slate-200 rounded px-2 py-1.5 text-xs font-bold text-slate-800 outline-none" />
                  </div>
                  <div className="col-span-12 flex justify-between items-center mt-2 pt-2 border-t border-slate-100">
                    <div className="flex gap-4">
                      <div className="flex items-center gap-2">
                        <label className="text-[9px] font-bold text-slate-400 uppercase">GST %</label>
                        <select value={item.gstSlab} onChange={(e) => updateItem(item.id, 'gstSlab', Number(e.target.value))} className="bg-transparent text-xs font-bold outline-none">
                          {[0, 5, 12, 18, 28].map(s => <option key={s} value={s}>{s}%</option>)}
                        </select>
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="text-[9px] font-bold text-slate-400 uppercase">Disc %</label>
                        <input type="number" value={item.discount} onChange={(e) => updateItem(item.id, 'discount', e.target.value)} className="w-10 bg-transparent text-xs font-bold outline-none" />
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-slate-900">₹{((item.qty * item.rate) * (1 - item.discount/100)).toLocaleString()}</span>
                      <button onClick={() => removeItem(item.id)} className="text-slate-300 hover:text-rose-500 transition-colors">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
      <button onClick={addItem} className="mt-4 btn btn-secondary text-[10px] w-full border-dashed">
        + Add Item Manually
      </button>
    </div>
  );
};

export default InvoiceItems;
