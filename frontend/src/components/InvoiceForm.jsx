import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import InputGroup from './InputGroup';
import { getClients, getProducts } from '../api';

const InvoiceForm = ({
  data, updateField, updateItem, addItem, removeItem,
  aiPrompt, setAiPrompt, isGenerating, handleAiGenerate,
  activeTheme, applyTemplate
}) => {
  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    loadSelectionData();
  }, []);

  const loadSelectionData = async () => {
    try {
      const [cData, pData] = await Promise.all([getClients(), getProducts()]);
      setClients(cData);
      setProducts(pData);
    } catch (err) {
      console.error('Failed to load selection data:', err);
    }
  };

  const handleClientSelect = (clientId) => {
    const client = clients.find(c => c._id === clientId);
    if (client) {
      updateField('clientName', client.name);
      updateField('clientEmail', client.email || '');
      updateField('clientAddress', client.address || '');
      updateField('clientId', client._id);
    }
  };

  const handleProductSelect = (itemId, productId) => {
    const product = products.find(p => p._id === productId);
    if (product) {
      updateItem(itemId, 'description', product.name);
      updateItem(itemId, 'rate', product.unitPrice);
      updateItem(itemId, 'hsn', product.hsn || '');
      updateItem(itemId, 'gstSlab', product.gstSlab || 18);
      updateItem(itemId, 'productId', product._id);
    }
  };

  const CardTitle = ({ children, icon }) => (
    <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
      {icon && <span className="text-indigo-500">{icon}</span>}
      <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">{children}</h3>
    </div>
  );

  return (
    <div className="w-full flex flex-col gap-6">
      
      {/* CARD A - AI SMART COMMAND BAR */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
        <CardTitle icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}>
          AI Smart Generator
        </CardTitle>
        <div className="flex gap-3">
          <input
            type="text"
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            placeholder="Describe invoice items with AI (e.g. Website design ₹12000 + GST)..."
            className="flex-1 bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800 placeholder-slate-400 rounded-xl px-4 py-3 outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
            onKeyDown={(e) => e.key === 'Enter' && handleAiGenerate(e)}
          />
          <button
            onClick={handleAiGenerate}
            disabled={isGenerating || !aiPrompt.trim()}
            className="px-6 py-3 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest disabled:opacity-50 hover:bg-indigo-600 transition-colors whitespace-nowrap"
          >
            {isGenerating ? 'Generating...' : 'Execute'}
          </button>
        </div>
      </div>

      {/* CARD B - DOCUMENT CONTROLS */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <CardTitle icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}>
          Document Details
        </CardTitle>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <InputGroup label="Invoice Number" value={data.invoiceNumber} onChange={(e) => updateField('invoiceNumber', e.target.value)} />
          <InputGroup label="Issue Date" type="date" value={data.dateIssued} onChange={(e) => updateField('dateIssued', e.target.value)} />
          <InputGroup label="Due Date" type="date" value={data.dueDate} onChange={(e) => updateField('dueDate', e.target.value)} />
        </div>
      </div>

      {/* CARD C - BUSINESS & CLIENT BLOCK */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <CardTitle icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>}>
          Parties & Addresses
        </CardTitle>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          {/* Issuer details */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-lg inline-block">Billed From</h4>
            <InputGroup label="Business Name" placeholder="Acme Inc" value={data.businessName} onChange={(e) => updateField('businessName', e.target.value)} />
            <InputGroup label="Your GSTIN / PAN" placeholder="27AAACR1234A1Z1" value={data.businessWebsite} onChange={(e) => updateField('businessWebsite', e.target.value)} />
            <InputGroup label="Registered Address" multiline={true} rows={3} placeholder="123 Business Rd" value={data.businessAddress} onChange={(e) => updateField('businessAddress', e.target.value)} />
          </div>

          {/* Client Details */}
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-indigo-50 px-3 py-1.5 rounded-lg">
              <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Billed To</h4>
              {clients.length > 0 && (
                <select 
                  onChange={(e) => handleClientSelect(e.target.value)}
                  className="bg-transparent border-none text-[10px] font-black text-indigo-600 outline-none hover:text-indigo-800 cursor-pointer text-right w-32"
                >
                  <option value="">+ Select Client</option>
                  {clients.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              )}
            </div>
            <InputGroup label="Client Name" placeholder="Globex Corp" value={data.clientName} onChange={(e) => updateField('clientName', e.target.value)} />
            <InputGroup label="Client GSTIN" placeholder="07CCCDT9012C3Z3" value={data.clientGstin} onChange={(e) => updateField('clientGstin', e.target.value)} />
            <InputGroup label="Billing Address" multiline={true} rows={3} placeholder="456 Corporate Blvd" value={data.clientAddress} onChange={(e) => updateField('clientAddress', e.target.value)} />
          </div>
        </div>

        {/* IGST Toggle */}
        <div className="mt-6 bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center gap-3 cursor-pointer" onClick={() => updateField('igstMode', !data.igstMode)}>
          <div className={`w-5 h-5 rounded flex items-center justify-center border transition-all ${data.igstMode ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-slate-300'}`}>
            {data.igstMode && <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
          </div>
          <div>
            <p className="text-xs font-black text-slate-800 uppercase tracking-widest">Apply IGST (Inter-state Supply)</p>
            <p className="text-[10px] font-bold text-slate-500 mt-0.5">Overrides standard CGST/SGST split for cross-state billing.</p>
          </div>
        </div>
      </div>

      {/* CARD D - PRODUCT/SERVICE LINE ITEM TABLE */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <CardTitle icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}>
          Product & Service Billing
        </CardTitle>
        
        <div className="space-y-4 mt-6">
          <AnimatePresence mode='popLayout'>
            {data.items.length === 0 ? (
              <div className="py-12 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300">
                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">No Line Items Added</p>
                <button onClick={addItem} className="mt-3 text-xs font-black text-indigo-600 hover:text-indigo-800 uppercase tracking-widest">+ Add First Item</button>
              </div>
            ) : (
              data.items.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  layout
                  className="bg-slate-50 p-4 rounded-xl border border-slate-200 relative group transition-all hover:border-slate-300 hover:shadow-sm"
                >
                  <div className="absolute -left-3 -top-3 w-6 h-6 bg-slate-900 text-white rounded-full flex items-center justify-center text-[10px] font-black shadow-sm">
                    {idx + 1}
                  </div>
                  
                  <div className="grid grid-cols-12 gap-x-4 gap-y-4">
                    {/* Row 1: Desc & HSN */}
                    <div className="col-span-12 sm:col-span-8 space-y-1">
                      <div className="flex justify-between">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Item / Description</label>
                        {products.length > 0 && (
                          <select 
                            onChange={(e) => handleProductSelect(item.id, e.target.value)}
                            className="bg-transparent border-none text-[9px] font-black text-indigo-600 outline-none hover:text-indigo-800 cursor-pointer"
                          >
                            <option value="">+ From Inventory</option>
                            {products.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                          </select>
                        )}
                      </div>
                      <input 
                        type="text" 
                        value={item.description} 
                        onChange={(e) => updateItem(item.id, 'description', e.target.value)} 
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold text-slate-800 outline-none focus:border-indigo-500" 
                        placeholder="Description of service/product" 
                      />
                    </div>
                    <div className="col-span-12 sm:col-span-4 space-y-1">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">HSN/SAC</label>
                      <input 
                        type="text" 
                        value={item.hsn} 
                        onChange={(e) => updateItem(item.id, 'hsn', e.target.value)} 
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold text-slate-800 outline-none focus:border-indigo-500" 
                        placeholder="9983" 
                      />
                    </div>

                    {/* Row 2: Metrics */}
                    <div className="col-span-4 sm:col-span-2 space-y-1">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Qty</label>
                      <input 
                        type="number" 
                        value={item.qty} 
                        onChange={(e) => updateItem(item.id, 'qty', e.target.value)} 
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold text-slate-800 outline-none focus:border-indigo-500" 
                      />
                    </div>
                    <div className="col-span-8 sm:col-span-3 space-y-1">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Rate (₹)</label>
                      <input 
                        type="number" 
                        value={item.rate} 
                        onChange={(e) => updateItem(item.id, 'rate', e.target.value)} 
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold text-slate-800 outline-none focus:border-indigo-500" 
                      />
                    </div>
                    <div className="col-span-4 sm:col-span-2 space-y-1">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">GST %</label>
                      <select 
                        value={item.gstSlab || 18} 
                        onChange={(e) => updateItem(item.id, 'gstSlab', Number(e.target.value))}
                        className="w-full h-[38px] bg-white border border-slate-200 text-sm font-bold text-slate-700 rounded-lg px-2 outline-none focus:border-indigo-500"
                      >
                        <option value="0">0%</option>
                        <option value="5">5%</option>
                        <option value="12">12%</option>
                        <option value="18">18%</option>
                        <option value="28">28%</option>
                      </select>
                    </div>
                    <div className="col-span-4 sm:col-span-2 space-y-1">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Disc %</label>
                      <input 
                        type="number" 
                        value={item.discount} 
                        onChange={(e) => updateItem(item.id, 'discount', e.target.value)} 
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold text-slate-800 outline-none focus:border-indigo-500" 
                      />
                    </div>
                    
                    {/* Net Amount Display */}
                    <div className="col-span-12 sm:col-span-3 flex items-end justify-between sm:justify-end gap-3 h-[38px] sm:h-auto self-end">
                      <div className="text-right">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Net Amount</label>
                        <span className="text-sm font-black text-slate-900">
                          ₹{(((Number(item.qty)||0) * (Number(item.rate)||0)) * (1 - (Number(item.discount)||0)/100)).toLocaleString(undefined, {minimumFractionDigits: 2})}
                        </span>
                      </div>
                      <button 
                        onClick={() => removeItem(item.id)} 
                        className="w-9 h-9 flex items-center justify-center bg-white border border-slate-200 rounded-lg hover:bg-rose-50 hover:border-rose-200 hover:text-rose-500 text-slate-400 transition-all shadow-sm" 
                        title="Remove Row"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
        
        <button
          type="button" onClick={addItem} 
          className="mt-4 px-5 py-2.5 bg-slate-900 text-white font-black text-[11px] uppercase tracking-widest rounded-xl hover:bg-indigo-600 transition-all flex items-center justify-center gap-2 shadow-md w-full sm:w-auto"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
          Add Line Item
        </button>
      </div>

      {/* CARD E - NOTES & TERMS */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-12">
        <CardTitle icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>}>
          Notes & Payment Instructions
        </CardTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
          <InputGroup multiline={true} rows={3} label="Bank Details / Payment Info" placeholder="Account No: 1234567890\nIFSC: HDFC0001234" value={data.paymentTerms} onChange={(e) => updateField('paymentTerms', e.target.value)} />
          <InputGroup multiline={true} rows={3} label="Additional Terms & Notes" placeholder="Thank you for your business." value={data.notes} onChange={(e) => updateField('notes', e.target.value)} />
        </div>
      </div>

    </div>
  );

};

export default InvoiceForm;

