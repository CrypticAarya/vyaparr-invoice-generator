import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { getAnalytics } from '../api';
import { DEMO_ANALYTICS } from '../utils/demoData';

const KPIStat = ({ label, value, trend, trendUp, color, sparkline }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="premium-card p-8 group relative overflow-hidden"
  >
    <div className={`absolute top-0 right-0 w-40 h-40 -mr-16 -mt-16 bg-${color}-500/5 rounded-full blur-3xl group-hover:bg-${color}-500/10 transition-all duration-700`}></div>
    
    <div className="flex justify-between items-start relative z-10">
      <div>
        <p className="text-[12px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">{label}</p>
        <h3 className="text-4xl font-black text-slate-900 tracking-tight mb-4 group-hover:text-indigo-600 transition-colors">
          {value}
        </h3>
        <div className="flex items-center gap-2">
          <div className={`flex items-center px-2 py-0.5 rounded-lg text-[11px] font-black ${trendUp ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
            <svg className={`w-3 h-3 mr-1 ${!trendUp && 'rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
            {trend}
          </div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">vs last month</span>
        </div>
      </div>
      
      {/* Sparkline Mock */}
      <div className="w-24 h-12 self-center">
        <svg viewBox="0 0 100 40" className={`w-full h-full overflow-visible drop-shadow-[0_2px_4px_rgba(0,0,0,0.05)]`}>
          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            d={sparkline}
            fill="none"
            stroke={trendUp ? '#10b981' : '#f43f5e'}
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  </motion.div>
);

const ExecutiveAction = ({ label, icon, path, color, desc }) => (
  <NavLink to={path} className="group relative block">
    <motion.div 
      whileHover={{ y: -5 }}
      className="premium-card p-6 border-slate-100 hover:border-indigo-100 transition-all duration-300"
    >
      <div className={`w-14 h-14 bg-${color}-500/10 rounded-2xl flex items-center justify-center text-${color}-600 mb-5 group-hover:scale-110 transition-transform duration-500`}>
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
        </svg>
      </div>
      <h4 className="text-[16px] font-black text-slate-900 mb-1">{label}</h4>
      <p className="text-[12px] font-medium text-slate-400 leading-relaxed">{desc}</p>
      
      <div className="mt-4 flex items-center text-[11px] font-black text-indigo-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0">
        Execute Now <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 5l7 7-7 7" /></svg>
      </div>
    </motion.div>
  </NavLink>
);

export default function Home() {
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
        // Only show demo if user is absolutely empty
        setData({ ...DEMO_ANALYTICS, isDemo: true });
      }
    } catch (err) {
      // Fallback to demo on error for UX, but mark it
      setData({ ...DEMO_ANALYTICS, isDemo: true });
    } finally {
      setLoading(false);
    }
  };

  if (loading || !data) {
    return <div className="p-20 flex justify-center items-center h-[60vh]"><div className="w-12 h-12 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin"></div></div>;
  }

  return (
    <div className="page-container">
      {/* Executive Header */}
      <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            {data.isDemo ? (
              <span className="px-3 py-1 bg-amber-500 text-white text-[10px] font-black rounded-full uppercase tracking-widest shadow-lg shadow-amber-500/20">Demo Data Active</span>
            ) : (
              <span className="px-3 py-1 bg-indigo-600 text-white text-[10px] font-black rounded-full uppercase tracking-widest shadow-lg shadow-indigo-500/20">Operational</span>
            )}
            <span className="text-slate-400 font-bold text-sm">v4.2.0 Stable</span>
          </div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tight">Intelligence Dashboard</h1>
          <p className="text-slate-500 font-bold text-lg mt-2">Managing business health and revenue flow in real-time.</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="btn-secondary group">
            <svg className="w-5 h-5 mr-3 text-slate-400 group-hover:text-slate-900 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            System Logs
          </button>
          <NavLink to="/new-invoice" className="btn-primary shimmer group">
            <svg className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
            Create New Document
          </NavLink>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        <KPIStat 
          label="Gross Revenue" value={`₹${((data?.totalRevenue || 0) / 100000).toFixed(1)}L`} trend="+14.2%" trendUp={true} color="indigo" 
          sparkline="M10 30 Q 30 10, 50 25 T 90 10" 
        />
        <KPIStat 
          label="Pending AR" value={`₹${((data?.pendingPayments || 0) / 100000).toFixed(1)}L`} trend="-2.4%" trendUp={false} color="rose" 
          sparkline="M10 10 Q 30 30, 50 15 T 90 35" 
        />
        <KPIStat 
          label="GST Liability" value={`₹${((data?.totalGST || 0) / 1000).toFixed(1)}K`} trend="+5.8%" trendUp={true} color="amber" 
          sparkline="M10 35 Q 30 25, 50 30 T 90 15" 
        />
        <KPIStat 
          label="Active Clients" value={data?.clientCount || 0} trend="+12.0%" trendUp={true} color="emerald" 
          sparkline="M10 30 Q 30 20, 50 25 T 90 5" 
        />
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Main Analytics Block */}
        <div className="lg:col-span-8 space-y-10">
          
          {/* Revenue Performance Area Chart */}
          <div className="premium-card p-10 bg-slate-900 text-white border-none shadow-2xl shadow-indigo-500/10 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] -mr-48 -mt-48"></div>
            
            <div className="flex items-center justify-between mb-12 relative z-10">
              <div>
                <h3 className="text-2xl font-black mb-1">Revenue Stream</h3>
                <p className="text-slate-400 text-[14px] font-bold uppercase tracking-widest">Aggregate Cash Flow (Annualized)</p>
              </div>
              <div className="flex bg-white/5 p-1 rounded-xl">
                {['1M', '6M', '1Y', 'ALL'].map(t => (
                  <button key={t} className={`px-4 py-2 text-[10px] font-black rounded-lg transition-all ${t === '1Y' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}>{t}</button>
                ))}
              </div>
            </div>

            <div className="h-72 w-full relative group">
              {/* Premium Area Chart SVG */}
              <svg className="w-full h-full" viewBox="0 0 800 240" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {/* Area */}
                <motion.path
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}
                  d="M0 240 L0 180 Q 150 220, 300 140 T 600 100 T 800 40 L 800 240 Z"
                  fill="url(#areaGradient)"
                />
                {/* Main Line */}
                <motion.path
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2 }}
                  d="M0 180 Q 150 220, 300 140 T 600 100 T 800 40"
                  fill="none" stroke="#6366f1" strokeWidth="6" strokeLinecap="round"
                />
              </svg>
              {/* Hover Indicator Line */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
            </div>
            
            <div className="flex justify-between mt-8 text-slate-500 text-[11px] font-black uppercase tracking-widest px-2">
              <span>JAN</span><span>MAR</span><span>MAY</span><span>JUL</span><span>SEP</span><span>NOV</span>
            </div>
          </div>

          {/* Recent Ledger */}
          <div className="premium-card overflow-hidden">
            <div className="p-10 border-b border-slate-50 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-black text-slate-900">Transaction Ledger</h3>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Latest finalized invoices & receipts</p>
              </div>
              <button className="btn-secondary py-2 px-6 text-sm">Full History</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-10 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">Identifier</th>
                    <th className="px-10 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">Counterparty</th>
                    <th className="px-10 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                    <th className="px-10 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {data.recentInvoices && data.recentInvoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-50/80 transition-all cursor-pointer group">
                      <td className="px-10 py-6 text-sm font-black text-slate-900 group-hover:text-indigo-600 transition-colors">#{inv.id}</td>
                      <td className="px-10 py-6 text-sm font-bold text-slate-600">{inv.client}</td>
                      <td className="px-10 py-6 text-sm font-black text-slate-900">{inv.amount}</td>
                      <td className="px-10 py-6">
                        <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-${inv.color || 'emerald'}-50 text-${inv.color || 'emerald'}-600 border border-${inv.color || 'emerald'}-100`}>
                          {inv.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Intelligence Side Block */}
        <div className="lg:col-span-4 space-y-10">
          
          {/* Executive Command Center */}
          <div className="grid grid-cols-1 gap-6">
            <h3 className="text-[14px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 px-2">Executive Actions</h3>
            <ExecutiveAction 
              label="New Invoice" icon="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
              path="/new-invoice" color="indigo" desc="Deploy new revenue request" 
            />
            <ExecutiveAction 
              label="Client CRM" icon="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857" 
              path="/clients" color="purple" desc="Manage business relationships" 
            />
          </div>

          {/* Business Health Analytics - Donut */}
          <div className="premium-card p-10">
            <h3 className="text-xl font-black text-slate-900 mb-8">Revenue Distribution</h3>
            <div className="relative w-48 h-48 mx-auto mb-10">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="#f1f5f9" strokeWidth="12" fill="none" />
                <motion.circle 
                  cx="50" cy="50" r="40" stroke="#6366f1" strokeWidth="12" fill="none" 
                  strokeDasharray="251.2" strokeDashoffset="62.8" // 75%
                  initial={{ strokeDashoffset: 251.2 }} animate={{ strokeDashoffset: 62.8 }} transition={{ duration: 1.5 }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-slate-900">75%</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Growth</span>
              </div>
            </div>
            <div className="space-y-4">
              {[
                { label: 'Subscriptions', value: '75%', color: 'indigo' },
                { label: 'One-time', value: '15%', color: 'slate-300' },
                { label: 'Service Fees', value: '10%', color: 'slate-100' }
              ].map(d => (
                <div key={d.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full bg-${d.color}`}></div>
                    <span className="text-[13px] font-bold text-slate-600">{d.label}</span>
                  </div>
                  <span className="text-[13px] font-black text-slate-900">{d.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* AI Insights Board */}
          <div className="premium-card p-10 bg-indigo-600 text-white border-none shimmer">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <h3 className="text-xl font-black">AI Intelligence</h3>
            </div>
            <p className="text-md text-indigo-100 leading-relaxed font-bold mb-10">
              "System optimization complete. You have 3 overdue invoices totaling ₹2.1L. Automated escalation advised for Tesla Energy."
            </p>
            <button className="w-full py-4 bg-white text-indigo-600 font-black rounded-2xl text-xs hover:bg-indigo-50 transition-all shadow-xl shadow-indigo-900/20 active:scale-95">
              RUN AI ANALYSIS
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
