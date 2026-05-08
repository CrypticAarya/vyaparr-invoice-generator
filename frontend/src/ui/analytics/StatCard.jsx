import React from 'react';
import Card from '../Card';

const StatCard = ({ title, value, subValue, trend, icon: Icon, color = 'indigo' }) => {
  const colors = {
    indigo: 'bg-indigo-50 text-indigo-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
    rose: 'bg-rose-50 text-rose-600',
    slate: 'bg-slate-50 text-slate-600',
  };

  return (
    <Card className="relative overflow-hidden group">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1">{title}</p>
          <h3 className="text-3xl font-black text-slate-900 tracking-tight">{value}</h3>
          
          <div className="flex items-center gap-2 mt-2">
            {trend !== undefined && (
              <span className={`text-[11px] font-black px-1.5 py-0.5 rounded-lg ${trend >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                {trend >= 0 ? '+' : ''}{trend}%
              </span>
            )}
            {subValue && <span className="text-[12px] font-bold text-slate-400">{subValue}</span>}
          </div>
        </div>

        <div className={`p-4 rounded-2xl transition-transform group-hover:scale-110 ${colors[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>

      {/* Subtle Background Accent */}
      <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full opacity-[0.03] group-hover:opacity-[0.05] transition-opacity ${colors[color].split(' ')[0]}`} />
    </Card>
  );
};

export default StatCard;
