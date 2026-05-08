import React from 'react';

const AIAlert = ({ type = 'warning', title, text }) => {
  const styles = {
    warning: 'bg-amber-50 border-amber-200 text-amber-800',
    danger: 'bg-rose-50 border-rose-200 text-rose-800',
    info: 'bg-indigo-50 border-indigo-200 text-indigo-800',
    success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
  };

  return (
    <div className={`p-4 rounded-xl border ${styles[type]} flex items-start gap-3`}>
      <div className="mt-0.5">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      </div>
      <div>
        <h5 className="text-[13px] font-black uppercase tracking-widest">{title}</h5>
        <p className="text-[13px] font-bold mt-0.5 opacity-90">{text}</p>
      </div>
    </div>
  );
};

export default AIAlert;
