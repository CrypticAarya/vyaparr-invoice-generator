import React from 'react';

const Input = ({ label, error, className = '', ...props }) => {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-0.5">
          {label}
        </label>
      )}
      <input
        className={`
          w-full bg-white border border-slate-300 rounded-lg px-4 py-2 text-sm font-medium text-slate-900 
          placeholder-slate-400 outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all
          ${error ? 'border-rose-500 ring-1 ring-rose-500' : ''}
        `}
        {...props}
      />
      {error && (
        <p className="text-[10px] font-semibold text-rose-600 ml-0.5 mt-1">{error}</p>
      )}
    </div>
  );
};

export default Input;
