import React from 'react';

const variants = {
  success: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  warning: 'bg-amber-50 text-amber-700 border-amber-100',
  error: 'bg-rose-50 text-rose-700 border-rose-100',
  info: 'bg-indigo-50 text-indigo-700 border-indigo-100',
  neutral: 'bg-slate-50 text-slate-700 border-slate-100',
};

const Badge = ({ children, variant = 'info', className = '' }) => {
  return (
    <span className={`
      inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border
      ${variants[variant]} 
      ${className}
    `}>
      {children}
    </span>
  );
};

export default Badge;
