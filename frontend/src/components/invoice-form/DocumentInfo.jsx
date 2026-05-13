import React from 'react';
import InputGroup from '../InputGroup';

const DocumentInfo = ({ data, updateField }) => {
  return (
    <div className="data-card">
      <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Document Details</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <InputGroup label="Invoice #" value={data.invoiceNumber} onChange={(e) => updateField('invoiceNumber', e.target.value)} />
        <InputGroup label="Issue Date" type="date" value={data.dateIssued} onChange={(e) => updateField('dateIssued', e.target.value)} />
        <InputGroup label="Due Date" type="date" value={data.dueDate} onChange={(e) => updateField('dueDate', e.target.value)} />
      </div>
    </div>
  );
};

export default DocumentInfo;
