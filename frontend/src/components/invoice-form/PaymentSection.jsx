import React from 'react';
import InputGroup from '../InputGroup';

const PaymentSection = ({ data, updateField }) => {
  return (
    <div className="data-card">
      <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Notes & Settlement</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputGroup label="Payment Terms" multiline={true} rows={2} value={data.paymentTerms} onChange={(e) => updateField('paymentTerms', e.target.value)} />
        <InputGroup label="Additional Notes" multiline={true} rows={2} value={data.notes} onChange={(e) => updateField('notes', e.target.value)} />
      </div>
    </div>
  );
};

export default PaymentSection;
