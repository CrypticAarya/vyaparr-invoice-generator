import React from 'react';

const TextArea = ({ label, value, onChange, placeholder, rows = 3, className = '', error, ...props }) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="text-[13px] font-black text-slate-700 uppercase tracking-widest ml-1">
          {label}
        </label>
      )}
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className={`w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-[14px] font-bold text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-indigo-600/20 focus:bg-white transition-all resize-none leading-relaxed ${error ? 'ring-2 ring-rose-500/50' : ''}`}
        {...props}
      />
      {error && <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest ml-1">{error}</p>}
    </div>
  );
};

export default TextArea;
