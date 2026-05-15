import React from 'react';

const variants = {
  success: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  warning: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  error: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
  info: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
  neutral: 'bg-zinc-800 text-zinc-400 border-zinc-700/50',
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
