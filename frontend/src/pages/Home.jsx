import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAnalytics } from '../hooks/useAnalytics';
import { useAiInsights } from '../hooks/useAiInsights';
import { useAuth } from '../context/AuthContext';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

// UI Components
import { CardSkeleton, TableSkeleton, Skeleton } from '../components/Skeleton';
import FloatingCard from '../ui/FloatingCard';
import AiCfoPanel from '../components/AiCfoPanel';

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [range, setRange] = useState('1M');
  const { data: analyticsData, isLoading } = useAnalytics(range);
  const { data: aiInsights, isLoading: isAiLoading } = useAiInsights();

  // Redirect to Dashboard (New Invoice) on logo click logic handled by Sidebar
  // This page focuses on the Pulse of the business.

  if (isLoading || !analyticsData) {
    return (
      <div className="space-y-12 p-8 animate-in fade-in duration-700">
        <div className="h-64 flex flex-col items-center justify-center space-y-4">
          <Skeleton width="60%" height="3rem" className="mx-auto" />
          <Skeleton width="40%" height="1.5rem" className="mx-auto" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <CardSkeleton />
            <div className="grid grid-cols-2 gap-8">
              <CardSkeleton />
              <CardSkeleton />
            </div>
          </div>
          <div className="lg:col-span-4">
            <CardSkeleton />
          </div>
        </div>
      </div>
    );
  }

  const { metrics, charts, recentActivity } = analyticsData;

  const getStatusStyle = (status) => {
    const s = status.toLowerCase();
    if (s === 'paid') return 'bg-v-mint text-emerald-700';
    if (s === 'overdue') return 'bg-rose-50 text-rose-600';
    if (s === 'draft') return 'bg-slate-100 text-slate-500';
    return 'bg-v-peach text-orange-700';
  };

  return (
    <div className="space-y-24 pb-20 overflow-x-hidden animate-in fade-in slide-in-from-bottom-4 duration-1000">
      
      {/* SECTION 1 — HERO EXPERIENCE */}
      <section className="relative min-h-[450px] flex flex-col items-center justify-center text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 space-y-8 max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-v-accent/5 border border-v-accent/10 text-v-accent text-[11px] font-bold uppercase tracking-widest mx-auto">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-v-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-v-accent"></span>
            </span>
            Real-time Business Intelligence
          </div>
          <h1 className="sketch-title text-5xl md:text-7xl font-bold leading-tight text-balance">
            The state of <br />
            <span className="text-v-accent">your empire today.</span>
          </h1>
          <p className="text-zinc-500 font-medium text-lg md:text-xl max-w-2xl mx-auto">
            {user?.businessName || 'Your Business'} is currently seeing a <span className="text-emerald-500 font-bold">positive growth trend</span> in net liquidity.
          </p>
          
          <div className="relative group max-w-2xl mx-auto">
            <input 
              type="text" 
              placeholder="Ask Vyapaar AI anything..." 
              className="ai-input-bar pr-20"
              onFocus={() => navigate('/home')} // Placeholder for future command palette trigger
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <span className="hidden sm:block text-[10px] font-bold text-zinc-400 bg-zinc-100 px-2 py-1 rounded-md">⌘K</span>
              <button className="w-10 h-10 bg-v-accent rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 active:scale-95 transition-all">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Floating Contextual Cards */}
        <div className="absolute inset-0 pointer-events-none overflow-visible hidden xl:block">
          <FloatingCard className="top-[5%] left-[2%] w-52" bgColor="bg-v-mint" rotation={-4} delay={0.2}>
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Growth</p>
              <p className="text-xl font-bold text-v-text">+12.4%</p>
            </div>
          </FloatingCard>

          <FloatingCard className="top-[10%] right-[4%] w-56" bgColor="bg-v-peach" rotation={6} delay={0.4}>
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-orange-600 uppercase tracking-widest">Avg. Cycle</p>
              <p className="text-xl font-bold text-v-text">14 Days</p>
            </div>
          </FloatingCard>
        </div>
      </section>

      {/* SECTION 2 — DATA PULSE */}
      <section className="page-container max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row gap-4 items-end justify-between mb-12">
          <div className="space-y-2">
            <h2 className="sketch-title text-4xl font-bold">Revenue Momentum</h2>
            <p className="text-zinc-500 font-medium">Tracking your billables and cash-inflow patterns.</p>
          </div>
          <div className="flex gap-1.5 bg-white/60 p-1 rounded-2xl border border-black/5 shadow-sm">
            {['1W', '1M', '3M', '1Y'].map(r => (
              <button 
                key={r}
                onClick={() => setRange(r)}
                className={`px-4 py-2 rounded-xl text-[12px] font-bold transition-all ${range === r ? 'bg-v-accent text-white shadow-lg shadow-v-accent/20' : 'text-zinc-400 hover:text-zinc-600'}`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-10">
            {/* Main Chart Card */}
            <div className="premium-card p-10 bg-white border-black/[0.01]">
              <div className="flex items-center justify-between mb-10">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold">Revenue Stream</h3>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-v-accent" />
                    <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Total Billables</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold tracking-tighter text-v-text">
                    {user?.currency || '₹'}{(metrics.totalRevenue || 0).toLocaleString()}
                  </p>
                  <p className="text-[11px] font-bold text-emerald-500 uppercase tracking-widest mt-1">
                    ↑ {metrics.growthRate}% Growth
                  </p>
                </div>
              </div>

              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={charts.revenueTrend}>
                    <defs>
                      <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#6D5EF5" stopOpacity={0.12}/>
                        <stop offset="100%" stopColor="#6D5EF5" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#00000006" />
                    <XAxis 
                      dataKey="label" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: '#A1A1AA', fontSize: 10, fontWeight: 700}}
                      dy={10}
                    />
                    <YAxis hide />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#fff', borderRadius: '16px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', fontSize: '12px', fontWeight: 'bold' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#6D5EF5" 
                      strokeWidth={3} 
                      fill="url(#revenueGradient)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="premium-card p-8 bg-v-lavender/30 border-v-accent/5 hover:translate-y-[-4px] transition-all cursor-pointer group">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-v-accent shadow-sm mb-6">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                </div>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Client Acquisition</p>
                <h4 className="text-3xl font-bold">{metrics.totalClients} <span className="text-sm text-zinc-400">Total</span></h4>
                <p className="text-[12px] font-medium text-zinc-500 mt-2">Active business partnerships.</p>
              </div>

              <div className="premium-card p-8 bg-v-sky/30 border-blue-100/50 hover:translate-y-[-4px] transition-all cursor-pointer group">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-500 shadow-sm mb-6">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                </div>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Active SKUs</p>
                <h4 className="text-3xl font-bold">{metrics.activeProducts} <span className="text-sm text-zinc-400">Items</span></h4>
                <p className="text-[12px] font-medium text-zinc-500 mt-2">Inventory items with healthy stock.</p>
              </div>
            </div>
          </div>

          {/* AI CFO Panel */}
          <AiCfoPanel 
            name={user?.name} 
            insights={aiInsights} 
            isLoading={isAiLoading} 
          />
        </div>
      </section>

      {/* SECTION 3 — OPERATIONAL FEED */}
      <section className="page-container max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-10">
          <div className="space-y-1">
            <h2 className="sketch-title text-3xl font-bold">Operational Feed</h2>
            <p className="text-zinc-500 font-medium text-sm">Real-time ledger of recent account activity.</p>
          </div>
          <NavLink to="/history" className="btn-premium btn-premium-secondary text-[12px]">View Full Ledger</NavLink>
        </div>

        <div className="premium-card bg-white/70 backdrop-blur-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-black/[0.01] text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                  <th className="px-10 py-5">Entity</th>
                  <th className="px-10 py-5">Reference</th>
                  <th className="px-10 py-5">Status</th>
                  <th className="px-10 py-5 text-right">Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.02]">
                {recentActivity.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-10 py-16">
                      <div className="flex flex-col items-center justify-center text-center space-y-4">
                        <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-2xl flex items-center justify-center border border-slate-100 shadow-sm mb-2">
                          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        </div>
                        <p className="text-[15px] font-bold text-slate-900">Your ledger is perfectly clean.</p>
                        <p className="text-sm font-medium text-slate-500 max-w-sm">Create your first invoice to jumpstart your cashflow and unlock AI insights.</p>
                        <button onClick={() => navigate('/new-invoice')} className="btn-premium btn-premium-secondary mt-4 px-6 text-[13px]">
                          Create First Invoice
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : recentActivity.map((activity, i) => (
                  <tr key={i} className="hover:bg-v-accent/[0.02] transition-colors group">
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-9 h-9 rounded-xl bg-v-bg border border-black/5 flex items-center justify-center text-[11px] font-bold text-v-text group-hover:bg-white transition-colors">
                          {activity.client?.charAt(0)}
                        </div>
                        <span className="font-bold text-v-text text-[14px]">{activity.client}</span>
                      </div>
                    </td>
                    <td className="px-10 py-6 text-[13px] font-bold text-zinc-400 tracking-tight">#{activity.id.slice(-6).toUpperCase()}</td>
                    <td className="px-10 py-6">
                      <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest ${getStatusStyle(activity.status)}`}>
                        {activity.status}
                      </span>
                    </td>
                    <td className="px-10 py-6 text-right font-bold text-v-text">
                      {user?.currency || '₹'}{activity.amount?.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* SECTION 4 — CALL TO ACTION */}
      <section className="page-container max-w-7xl mx-auto px-6 pb-20">
        <div className="premium-card p-16 bg-zinc-900 text-white relative overflow-hidden text-center space-y-8 shadow-2xl shadow-indigo-500/20">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <svg className="w-64 h-64" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          
          <h2 className="sketch-title text-5xl font-bold !text-white leading-tight">Scale your empire with <br /> <span className="text-v-accent">precision & speed.</span></h2>
          <p className="text-zinc-400 font-medium text-lg max-w-2xl mx-auto">
            Automate your billing, track your inventory, and let Vyapaar AI guide your financial decisions.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
            <button onClick={() => navigate('/new-invoice')} className="btn-premium btn-premium-primary px-12 h-16 text-base">
              Create New Invoice
            </button>
            <button onClick={() => navigate('/analytics')} className="btn-premium border border-white/10 hover:bg-white/5 px-12 h-16 text-base">
              Explore Analytics
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
