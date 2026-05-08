import React from 'react';

const InsightCard = ({ type = 'info', title, text, recommendation }) => {
  const styles = {
    success: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-100', icon: 'bg-emerald-500' },
    warning: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-100', icon: 'bg-amber-500' },
    danger: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-100', icon: 'bg-rose-500' },
    info: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-100', icon: 'bg-indigo-500' },
  };

  const style = styles[type] || styles.info;

  return (
    <div className={`p-5 rounded-2xl border ${style.border} ${style.bg} transition-all hover:shadow-md group`}>
      <div className="flex items-start gap-4">
        <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${style.icon} animate-pulse`} />
        <div className="flex-1">
          <h4 className={`text-[13px] font-black uppercase tracking-widest mb-1 ${style.text}`}>{title}</h4>
          <p className="text-[14px] font-bold text-slate-700 leading-snug mb-3">{text}</p>
          
          <div className="bg-white/50 p-3 rounded-xl border border-white/60">
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">Recommendation</p>
            <p className="text-[13px] font-bold text-slate-900 italic">"{recommendation}"</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsightCard;
