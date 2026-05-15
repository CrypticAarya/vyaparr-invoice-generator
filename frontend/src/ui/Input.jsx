import React from 'react';

const Input = ({ label, error, className = '', ...props }) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-[0.08em] ml-0.5">
          {label}
        </label>
      )}
      <input
        className={`
          w-full bg-[#121217] border border-[#1E1E24] rounded-xl px-4 py-2.5 text-[13px] font-medium text-white 
          placeholder-zinc-600 outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all
          ${error ? 'border-rose-500 ring-rose-500/10' : ''}
        `}
        {...props}
      />
      {error && (
        <p className="text-[11px] font-semibold text-rose-500 ml-0.5 mt-1">{error}</p>
      )}
    </div>
  );
};

export default Input;
