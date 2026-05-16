import React from 'react';

const Input = ({ label, error, className = '', ...props }) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 block">
          {label}
        </label>
      )}
      <input
        className={`input-field ${error ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/10' : ''}`}
        {...props}
      />
      {error && <p className="text-[11px] font-bold text-rose-500 ml-1">{error}</p>}
    </div>
  );
};

export default Input;
