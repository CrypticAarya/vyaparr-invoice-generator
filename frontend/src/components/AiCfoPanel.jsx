import React from 'react';
import { motion } from 'framer-motion';

const AiCfoPanel = ({ name = "Founder", insights, isLoading }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="lg:col-span-4 flex flex-col gap-6"
    >
      <div className="premium-card p-8 bg-v-lavender/40 border-v-accent/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-v-accent/5 rounded-full blur-3xl -mr-16 -mt-16" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-v-accent rounded-full flex items-center justify-center text-white shadow-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="font-bold text-lg tracking-tight">AI CFO Assistant</h3>
          </div>

          <div className="space-y-6">
            <div className="p-5 bg-white/60 rounded-2xl border border-white/40 shadow-sm min-h-[100px] flex items-center">
              {isLoading ? (
                <div className="flex flex-col gap-2 w-full">
                  <div className="h-4 bg-black/5 animate-pulse rounded w-3/4" />
                  <div className="h-4 bg-black/5 animate-pulse rounded w-1/2" />
                </div>
              ) : (
                <p className="text-v-text font-medium leading-relaxed">
                  {insights?.summary || `Analyzing your data, ${name}... Your dashboard is ready with the latest performance metrics.`}
                </p>
              )}
            </div>

            <div className="space-y-4">
              {isLoading ? (
                [1, 2].map(i => (
                  <div key={i} className="flex gap-4 p-4 animate-pulse">
                    <div className="w-2 h-2 rounded-full bg-black/5 mt-2" />
                    <div className="space-y-2 flex-1">
                      <div className="h-3 bg-black/5 rounded w-1/3" />
                      <div className="h-3 bg-black/5 rounded w-full" />
                    </div>
                  </div>
                ))
              ) : (
                (insights?.tips || []).map((tip, idx) => (
                  <div key={idx} className="flex items-start gap-4 p-4 hover:bg-white/40 rounded-xl transition-colors cursor-pointer group">
                    <div className={`w-2 h-2 rounded-full mt-2 shrink-0 group-hover:scale-125 transition-transform ${
                      tip.type === 'warning' ? 'bg-amber-400' : 'bg-emerald-400'
                    }`} />
                    <div>
                      <p className="text-[13px] font-bold text-v-text capitalize">{tip.type} {tip.category}</p>
                      <p className="text-[12px] text-zinc-500 font-medium">{tip.text}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <button className="w-full btn-premium btn-premium-primary">
              Run Cashflow Analysis
            </button>
          </div>
        </div>
      </div>

      <div className="premium-card p-6 bg-v-mint/30 border-black/[0.02]">
        <h4 className="text-[13px] font-bold text-zinc-400 uppercase tracking-widest mb-4">Quick Tip</h4>
        <p className="text-[14px] text-v-text font-medium leading-relaxed">
          Switching to quarterly tax filings could save you roughly 4 hours of admin work per month.
        </p>
      </div>
    </motion.div>
  );
};

export default AiCfoPanel;
