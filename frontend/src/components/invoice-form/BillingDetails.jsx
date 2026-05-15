import React from 'react';
import InputGroup from '../InputGroup';

const BillingDetails = ({ data, updateField, clients, handleClientSelect }) => {
  const SectionTitle = ({ children }) => (
    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">{children}</h3>
  );

  return (
    <div className="data-card">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* From */}
        <div className="space-y-4">
          <SectionTitle>Billed From</SectionTitle>
          <InputGroup label="Your Business" value={data.businessName} onChange={(e) => updateField('businessName', e.target.value)} />
          <InputGroup label="GSTIN / PAN" value={data.businessWebsite} onChange={(e) => updateField('businessWebsite', e.target.value)} />
          <InputGroup label="Address" multiline={true} rows={2} value={data.businessAddress} onChange={(e) => updateField('businessAddress', e.target.value)} />
        </div>

        {/* To */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <SectionTitle>Billed To</SectionTitle>
            <select 
              onChange={(e) => handleClientSelect(e.target.value)}
              className="text-[10px] font-bold text-slate-900 bg-slate-100 rounded px-2 py-0.5 outline-none cursor-pointer border-none"
            >
              <option value="">+ Saved Client</option>
              {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <InputGroup label="Client Name" value={data.clientName} onChange={(e) => updateField('clientName', e.target.value)} />
          <InputGroup label="Client GSTIN" value={data.clientGstin} onChange={(e) => updateField('clientGstin', e.target.value)} />
          <InputGroup label="Billing Address" multiline={true} rows={2} value={data.clientAddress} onChange={(e) => updateField('clientAddress', e.target.value)} />
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-50 flex items-center gap-3">
        <input 
          type="checkbox" 
          checked={data.igstMode} 
          onChange={(e) => updateField('igstMode', e.target.checked)}
          className="w-4 h-4 text-slate-900 rounded border-slate-300 focus:ring-slate-900"
        />
        <label className="text-xs font-bold text-slate-700">Apply IGST (Inter-state Supply)</label>
      </div>
    </div>
  );
};

export default BillingDetails;
