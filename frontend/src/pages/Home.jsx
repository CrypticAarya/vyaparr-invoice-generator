import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAnalytics } from '../hooks/useAnalytics';
import { useAiInsights } from '../hooks/useAiInsights';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

// UI Components
import PageLoader from '../components/PageLoader';
import FloatingCard from '../ui/FloatingCard';
import AiCfoPanel from '../components/AiCfoPanel';

export default function Home() {
  const [range, setRange] = useState('1M');
  const { data: analyticsData, isLoading } = useAnalytics(range);
  const { data: aiInsights, isLoading: isAiLoading } = useAiInsights();

  if (isLoading || !analyticsData) {
    return <PageLoader />;
  }

  const { metrics, charts, recentActivity } = analyticsData;
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div className="space-y-24 pb-20 overflow-x-hidden">
      
      {/* SECTION 1 — HERO EXPERIENCE */}
      <section className="relative min-h-[500px] flex flex-col items-center justify-center text-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 space-y-8 max-w-4xl"
        >
          <h1 className="sketch-title text-5xl md:text-7xl font-bold leading-tight text-balance">
            What’s the state of <br />
            <span className="text-v-accent">your business today?</span>
          </h1>
          <p className="text-zinc-500 font-medium text-lg md:text-xl max-w-2xl mx-auto">
            AI-powered insights, invoices, and cashflow management for modern businesses.
          </p>
          
          <div className="relative group max-w-2xl mx-auto">
            <input 
              type="text" 
              placeholder="Ask Vyapaar AI anything..." 
              className="ai-input-bar pr-20"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <span className="hidden sm:block text-[10px] font-bold text-zinc-400 bg-zinc-100 px-2 py-1 rounded-md">⌘K</span>
              <button className="w-10 h-10 bg-v-accent rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Floating Cards - Positioned around the hero */}
        <div className="absolute inset-0 pointer-events-none overflow-visible hidden lg:block">
          {/* Top Left: Cashflow */}
          <FloatingCard 
            className="top-[10%] left-[5%] w-56" 
            bgColor="bg-v-mint" 
            rotation={-4}
            delay={0.2}
          >
            <div className="space-y-1">
              <p className="text-[11px] font-bold text-emerald-600 uppercase tracking-widest">Cashflow Healthy</p>
              <p className="text-2xl font-bold text-v-text">+18% <span className="text-sm font-medium text-emerald-600/60">this week</span></p>
            </div>
          </FloatingCard>

          {/* Top Right: Pending Invoices */}
          <FloatingCard 
            className="top-[15%] right-[8%] w-60" 
            bgColor="bg-v-peach" 
            rotation={6}
            delay={0.4}
          >
            <div className="space-y-1">
              <p className="text-[11px] font-bold text-orange-600 uppercase tracking-widest">Pending Invoices</p>
              <p className="text-2xl font-bold text-v-text">₹42,000 <span className="text-sm font-medium text-orange-600/60">overdue</span></p>
            </div>
          </FloatingCard>

          {/* Bottom Left: AI Insight */}
          <FloatingCard 
            className="bottom-[10%] left-[10%] w-64" 
            bgColor="bg-v-lavender" 
            rotation={-2}
            delay={0.6}
          >
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-v-accent rounded-full flex items-center justify-center text-white shrink-0">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-bold text-v-accent uppercase tracking-widest">AI Insight</p>
                <p className="text-[13px] font-bold text-v-text leading-tight">Expenses increased unusually this month.</p>
              </div>
            </div>
          </FloatingCard>

          {/* Bottom Right: Top Client */}
          <FloatingCard 
            className="bottom-[15%] right-[12%] w-52" 
            bgColor="bg-v-sky" 
            rotation={3}
            delay={0.8}
          >
            <div className="space-y-1">
              <p className="text-[11px] font-bold text-blue-600 uppercase tracking-widest">Top Client</p>
              <p className="text-xl font-bold text-v-text">Zara India</p>
              <div className="flex -space-x-2 mt-2">
                {[1,2,3].map(i => (
                  <div key={i} className="w-6 h-6 rounded-full border-2 border-v-sky bg-white" />
                ))}
              </div>
            </div>
          </FloatingCard>
        </div>
      </section>

      {/* SECTION 2 — AI INSIGHTS */}
      <section className="page-container max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row gap-4 items-end justify-between mb-12">
          <div className="space-y-2">
            <h2 className="sketch-title text-4xl font-bold">Intelligent Pulse</h2>
            <p className="text-zinc-500 font-medium">Your business performance, interpreted by AI.</p>
          </div>
          <div className="flex gap-2 bg-white/60 p-1.5 rounded-2xl border border-black/5 shadow-sm">
            {['1W', '1M', '3M', 'All'].map(r => (
              <button 
                key={r}
                onClick={() => setRange(r)}
                className={`px-4 py-2 rounded-xl text-[12px] font-bold transition-all ${range === r ? 'bg-v-accent text-white shadow-md' : 'text-zinc-400 hover:text-zinc-600'}`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-10">
            {/* Revenue Trend Chart */}
            <div className="premium-card p-10 bg-white/80 border-black/[0.02]">
              <div className="flex items-center justify-between mb-10">
                <div>
                  <h3 className="text-xl font-bold">Revenue & Momentum</h3>
                  <p className="text-[13px] font-medium text-zinc-500 mt-1">Projected growth based on current pipeline.</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold tracking-tight text-v-accent">₹{(metrics.totalRevenue || 0).toLocaleString()}</p>
                  <p className="text-[11px] font-bold text-emerald-500 uppercase tracking-widest mt-1">+12.5% vs last month</p>
                </div>
              </div>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={charts.revenueTrend}>
                    <defs>
                      <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#6D5EF5" stopOpacity={0.15}/>
                        <stop offset="100%" stopColor="#6D5EF5" stopOpacity={0.01}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#00000008" />
                    <XAxis 
                      dataKey="label" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: '#A1A1AA', fontSize: 11, fontWeight: 600}}
                      dy={15}
                    />
                    <YAxis 
                      hide
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#fff', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 10px 40px rgba(0,0,0,0.05)', fontSize: '13px', fontWeight: 'bold' }}
                      cursor={{ stroke: '#6D5EF5', strokeWidth: 1, strokeDasharray: '4 4' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#6D5EF5" 
                      strokeWidth={4} 
                      fill="url(#revenueGradient)" 
                      activeDot={{ r: 8, fill: '#6D5EF5', stroke: '#fff', strokeWidth: 4, shadow: '0 0 20px rgba(109,94,245,0.4)' }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Growth Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="premium-card p-8 bg-v-lavender/30 border-black/[0.01] hover:scale-[1.02] cursor-pointer group transition-all">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-v-accent shadow-sm mb-6 group-hover:rotate-6 transition-transform">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                </div>
                <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Retention Rate</p>
                <h4 className="text-3xl font-bold">92.4%</h4>
                <p className="text-[13px] font-medium text-zinc-500 mt-2">High stability in client base.</p>
              </div>

              <div className="premium-card p-8 bg-v-sky/30 border-black/[0.01] hover:scale-[1.02] cursor-pointer group transition-all">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-500 shadow-sm mb-6 group-hover:-rotate-6 transition-transform">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Average Invoice</p>
                <h4 className="text-3xl font-bold">₹14,500</h4>
                <p className="text-[13px] font-medium text-zinc-500 mt-2">Up 8% since last quarter.</p>
              </div>
            </div>
          </div>

          {/* AI CFO Panel */}
          <AiCfoPanel 
            name={user.name} 
            insights={aiInsights} 
            isLoading={isAiLoading} 
          />
        </div>
      </section>

      {/* SECTION 3 — OPERATIONAL DASHBOARD */}
      <section className="page-container max-w-7xl mx-auto px-6">
        <div className="space-y-2 mb-10">
          <h2 className="sketch-title text-4xl font-bold">Operations</h2>
          <p className="text-zinc-500 font-medium">Manage your day-to-day business flow.</p>
        </div>

        <div className="premium-card bg-white/60 overflow-hidden">
          <div className="p-8 border-b border-black/[0.03] flex items-center justify-between">
            <h3 className="font-bold text-lg">Recent Transactions</h3>
            <button className="text-[13px] font-bold text-v-accent hover:underline">View Ledger</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-black/[0.01] text-[11px] font-bold text-zinc-400 uppercase tracking-widest">
                  <th className="px-8 py-4">Client</th>
                  <th className="px-8 py-4">Ref #</th>
                  <th className="px-8 py-4">Status</th>
                  <th className="px-8 py-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.03]">
                {(recentActivity || []).map((activity, i) => (
                  <tr key={i} className="hover:bg-black/[0.01] transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-v-bg border border-black/5 flex items-center justify-center text-[10px] font-bold">
                          {activity.client?.charAt(0)}
                        </div>
                        <span className="font-bold text-v-text">{activity.client}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-[13px] font-medium text-zinc-500">#{activity.id}</td>
                    <td className="px-8 py-6">
                      <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                        activity.status === 'paid' ? 'bg-v-mint text-emerald-700' : 'bg-v-peach text-orange-700'
                      }`}>
                        {activity.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right font-bold text-v-text">₹{activity.amount?.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-8 bg-black/[0.01] text-center">
            <button className="btn-premium btn-premium-secondary mx-auto">
              Load More History
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 4 — AI CFO PANEL (Repeated/Integrated but focusing on bottom call to action) */}
      <section className="page-container max-w-7xl mx-auto px-6 pb-20">
        <div className="premium-card p-12 bg-v-accent text-white relative overflow-hidden text-center space-y-6">
          {/* Background circles */}
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          
          <h2 className="sketch-title text-4xl md:text-5xl font-bold !text-white">Ready for your next move?</h2>
          <p className="text-white/80 font-medium text-lg max-w-xl mx-auto">
            Let VyapaarFlow handle the complexity while you focus on building your empire.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button className="btn-premium bg-white text-v-accent hover:bg-v-cream px-10 py-4 shadow-xl">
              Create New Invoice
            </button>
            <button className="btn-premium border border-white/20 hover:bg-white/10 px-10 py-4">
              Explore Analytics
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
