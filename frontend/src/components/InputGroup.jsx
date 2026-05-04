import React from 'react';

const InputGroup = ({ label, type = "text", placeholder, multiline = false, rows = 3, className = "", value, onChange }) => (
  <div className={`w-full ${className}`}>
    {label && <label className="block text-[11px] font-bold text-slate-500 mb-1.5 tracking-wider uppercase">{label}</label>}
    {multiline ? (
      <textarea
        rows={rows}
        value={value || ''}
        onChange={onChange}
        className="w-full rounded-[1rem] bg-white border border-slate-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)] px-4 py-3.5 text-[15px] text-slate-800 focus:bg-white focus:ring-[3px] focus:ring-violet-500/10 focus:border-violet-300 outline-none transition-all resize-none placeholder-slate-400 font-medium hover:border-slate-200"
        placeholder={placeholder}
      />
    ) : (
      <input
        type={type}
        value={value || ''}
        onChange={onChange}
        className="w-full rounded-[1rem] bg-white border border-slate-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)] px-4 py-3.5 text-[15px] text-slate-800 focus:bg-white focus:ring-[3px] focus:ring-violet-500/10 focus:border-violet-300 outline-none transition-all placeholder-slate-400 font-medium hover:border-slate-200"
        placeholder={placeholder}
      />
    )}
  </div>
);

export default InputGroup;
