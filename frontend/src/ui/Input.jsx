import React from 'react';

const Input = ({ label, error, className = '', ...props }) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="text-[13px] font-black text-slate-700 uppercase tracking-widest ml-1">
          {label}
        </label>
      )}
      <input
        className={`
          w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-[14px] font-bold text-slate-900 
          placeholder-slate-400 focus:ring-2 focus:ring-indigo-600/20 focus:bg-white transition-all
          ${error ? 'ring-2 ring-rose-500/20' : ''}
        `}
        {...props}
      />
      {error && (
        <p className="text-[11px] font-bold text-rose-500 ml-1 mt-1">{error}</p>
      )}
    </div>
  );
};

export default Input;
