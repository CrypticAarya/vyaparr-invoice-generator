import React from 'react';
import Card from '../Card';
import InsightCard from './InsightCard';

const RecommendationPanel = ({ insights, isLoading }) => {
  return (
    <Card className="flex flex-col h-full border-none shadow-2xl shadow-indigo-500/5 bg-gradient-to-br from-white to-indigo-50/30">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
        </div>
        <div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight">AI Intelligence</h3>
          <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest">Business Insights & Alerts</p>
        </div>
      </div>

      <div className="space-y-4 flex-1">
        {isLoading ? (
          <div className="space-y-4 animate-pulse">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-slate-100 rounded-2xl" />
            ))}
          </div>
        ) : (
          insights?.map((insight, idx) => (
            <InsightCard key={idx} {...insight} />
          ))
        )}
      </div>

      <div className="mt-8 pt-6 border-t border-indigo-100">
        <button className="w-full py-3 bg-indigo-600 text-white text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-500/10 active:scale-95">
          Refresh Intelligence
        </button>
      </div>
    </Card>
  );
};

export default RecommendationPanel;
