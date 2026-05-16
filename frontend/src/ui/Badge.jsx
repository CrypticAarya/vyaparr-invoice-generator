import React from 'react';

const variants = {
  success: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  error: 'bg-rose-50 text-rose-600 border-rose-100',
  warning: 'bg-amber-50 text-amber-600 border-amber-100',
  info: 'bg-indigo-50 text-indigo-600 border-indigo-100',
  neutral: 'bg-slate-100 text-slate-600 border-slate-200',
};

const Badge = ({ children, variant = 'neutral', className = '' }) => {
  return (
    <span className={`
      inline-flex items-center px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border
      ${variants[variant]}
      ${className}
    `}>
      {children}
    </span>
  );
};

export default Badge;
