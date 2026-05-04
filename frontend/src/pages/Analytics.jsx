import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getAnalytics } from '../api';
import { DEMO_ANALYTICS } from '../utils/demoData';

const StatBox = ({ label, value, trend, trendUp, color }) => (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="premium-card p-8">
    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">{label}</p>
    <h3 className="text-3xl font-black text-slate-900 mb-4">{value}</h3>
    <div className="flex items-center gap-2">
      <span className={`text-[10px] font-black px-2 py-0.5 rounded ${trendUp ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
        {trend}
      </span>
      <span className="text-[10px] font-bold text-slate-400 uppercase">Growth Index</span>
    </div>
  </motion.div>
);

export default function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const result = await getAnalytics();
      if (result && !result.isNewUser) {
        setData(result);
      } else {
        setData({ ...DEMO_ANALYTICS, isDemo: true });
      }
    } catch (err) {
      setData({ ...DEMO_ANALYTICS, isDemo: true });
    } finally {
      setLoading(false);
    }
  };

  if (loading || !data) {
    return <div className="p-20 flex justify-center"><div className="w-10 h-10 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin"></div></div>;
  }

  return (
    <div className="page-container">
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-2">
          {data.isDemo ? (
            <span className="px-3 py-1 bg-amber-500 text-white text-[10px] font-black rounded-full uppercase tracking-widest shadow-lg shadow-amber-500/20">Preview Mode</span>
          ) : (
            <span className="px-3 py-1 bg-emerald-600 text-white text-[10px] font-black rounded-full uppercase tracking-widest shadow-lg shadow-emerald-500/20">Verified Truth</span>
          )}
        </div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Business Intelligence</h1>
        <p className="text-slate-500 font-bold text-lg mt-2">Deep analytics and revenue forecasting for your enterprise.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        <StatBox label="Aggregate Revenue" value={`₹${((data?.totalRevenue || 0) / 100000).toFixed(1)}L`} trend="+14%" trendUp={true} color="indigo" />
        <StatBox label="Pending AR" value={`₹${((data?.pendingPayments || 0) / 1000).toFixed(0)}K`} trend="-2%" trendUp={false} color="rose" />
        <StatBox label="GST Reserve" value={`₹${((data?.totalGST || 0) / 1000).toFixed(0)}K`} trend="+5%" trendUp={true} color="amber" />
        <StatBox label="Active Clients" value={data?.clientCount || 0} trend="+3" trendUp={true} color="emerald" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Revenue Trend Chart */}
        <div className="lg:col-span-8 premium-card p-10">
          <h3 className="text-xl font-black text-slate-900 mb-8">Revenue Momentum</h3>
          <div className="h-64 w-full flex items-end gap-2 px-2">
            {(data?.trend || []).map((item, i) => (
              <div key={i} className="flex-1 flex flex-col items-center group">
                <div className="w-full relative group">
                  <motion.div 
                    initial={{ height: 0 }} animate={{ height: `${(item.revenue / (Math.max(...(data?.trend || [{revenue: 1}]).map(t => t.revenue)) || 1)) * 100}%` }}
                    className="w-full bg-slate-900 rounded-t-xl transition-all group-hover:bg-indigo-600 relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </motion.div>
                </div>
                <span className="text-[10px] font-black text-slate-400 mt-4 uppercase tracking-widest">{item.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Clients */}
        <div className="lg:col-span-4 premium-card p-10">
          <h3 className="text-xl font-black text-slate-900 mb-8">Top Revenue Sources</h3>
          <div className="space-y-6">
            {(data?.topClients || []).map((client, i) => (
              <div key={i} className="flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-xs font-black text-slate-400 group-hover:text-indigo-600 group-hover:bg-indigo-50 transition-all">
                    {i + 1}
                  </div>
                  <span className="text-sm font-bold text-slate-700">{client.name}</span>
                </div>
                <span className="text-sm font-black text-slate-900">₹{((client.revenue || 0) / 1000).toFixed(0)}K</span>
              </div>
            ))}
          </div>
          <button className="w-full mt-10 py-4 bg-slate-50 text-slate-500 text-[11px] font-black rounded-2xl hover:bg-slate-100 hover:text-slate-900 transition-all uppercase tracking-[0.2em]">
            View All Clients
          </button>
        </div>
      </div>
    </div>
  );
}
