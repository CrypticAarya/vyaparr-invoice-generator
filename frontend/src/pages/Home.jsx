import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAnalytics } from '../hooks/useAnalytics';
import { useAiInsights } from '../hooks/useAiInsights';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

// UI Components
import PageLoader from '../components/PageLoader';

// Icons
const RevenueIcon = (props) => <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const ARPathIcon = (props) => <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>;
const GSTIcon = (props) => <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" /></svg>;
const InventoryIcon = (props) => <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>;

export default function Home() {
  const [range, setRange] = useState('1Y');
  const { data: analyticsData, isLoading } = useAnalytics(range);
  const { data: aiInsights, isLoading: isAiLoading } = useAiInsights();

  if (isLoading || !analyticsData) {
    return <PageLoader />;
  }

  const { metrics, charts, recentActivity } = analyticsData;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
          <p className="text-xs font-medium text-slate-500">Real-time business performance overview.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn btn-secondary px-3 py-1.5 h-8">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            Export
          </button>
          <NavLink to="/new-invoice">
            <button className="btn btn-primary px-3 py-1.5 h-8">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
              New Invoice
            </button>
          </NavLink>
        </div>
      </div>

      {/* High-Density KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex justify-between items-center mb-1">
            <span className="stat-label">Revenue</span>
            <RevenueIcon className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="stat-value">₹{(metrics.totalRevenue || 0).toLocaleString()}</div>
          <div className="flex items-center gap-1.5 mt-1">
            <span className={`text-[10px] font-bold ${metrics.revenueGrowth >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              {metrics.revenueGrowth >= 0 ? '+' : ''}{metrics.revenueGrowth}%
            </span>
            <span className="text-[10px] font-medium text-slate-400">vs last month</span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="flex justify-between items-center mb-1">
            <span className="stat-label">Outstanding</span>
            <ARPathIcon className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="stat-value">₹{(metrics.pendingPayments || 0).toLocaleString()}</div>
          <div className="text-[10px] font-medium text-slate-400 mt-1">Accounts Receivable</div>
        </div>

        <div className="stat-card">
          <div className="flex justify-between items-center mb-1">
            <span className="stat-label">Tax (GST)</span>
            <GSTIcon className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="stat-value">₹{(metrics.totalGST || 0).toLocaleString()}</div>
          <div className="text-[10px] font-medium text-slate-400 mt-1">Estimated Liability</div>
        </div>

        <div className="stat-card">
          <div className="flex justify-between items-center mb-1">
            <span className="stat-label">Inventory</span>
            <InventoryIcon className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="stat-value">{metrics.inventoryHealth}%</div>
          <div className="text-[10px] font-medium text-slate-400 mt-1">{metrics.lowStockCount} items below threshold</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Revenue Chart */}
        <div className="lg:col-span-8 data-card !p-0 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Net Revenue Trend</h3>
              <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Monthly Performance</p>
            </div>
            <div className="flex bg-slate-100 p-0.5 rounded-md">
              {['1M', '6M', '1Y'].map(t => (
                <button 
                  key={t} 
                  onClick={() => setRange(t)}
                  className={`px-2.5 py-1 text-[9px] font-bold rounded transition-all ${range === t ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="h-[320px] p-5">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts.revenueTrend}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0f172a" stopOpacity={0.03}/>
                    <stop offset="95%" stopColor="#0f172a" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="label" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 600}}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 600}}
                  tickFormatter={(val) => `₹${val >= 1000 ? (val/1000).toFixed(0)+'k' : val}`}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '6px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '11px', fontWeight: 600 }}
                  cursor={{ stroke: '#e2e8f0', strokeWidth: 1 }}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#0f172a" 
                  strokeWidth={2} 
                  fillOpacity={1} 
                  fill="url(#revenueGradient)" 
                  activeDot={{ r: 4, fill: '#0f172a', strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Side Section: Recent Activity Table */}
        <div className="lg:col-span-4 space-y-6">
          <div className="data-card !p-0 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Recent Activity</h3>
              <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Latest Invoices</p>
            </div>
            <div className="divide-y divide-slate-50">
              {(recentActivity || []).length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400 font-medium">No recent activity</div>
              ) : (
                recentActivity.map((activity, idx) => (
                  <div key={idx} className="px-5 py-3.5 hover:bg-slate-50 transition-colors flex items-center justify-between">
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 truncate">#{activity.id}</div>
                      <div className="text-[10px] font-medium text-slate-500 truncate">{activity.client}</div>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-xs font-bold text-slate-900">₹{activity.amount.toLocaleString()}</div>
                      <div className={`text-[9px] font-bold uppercase tracking-tighter ${activity.status === 'paid' ? 'text-emerald-600' : 'text-amber-600'}`}>
                        {activity.status}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="px-5 py-3 bg-slate-50 border-t border-slate-100">
              <NavLink to="/history" className="text-[10px] font-bold text-slate-500 hover:text-slate-900 uppercase tracking-widest transition-colors">
                View Transaction History →
              </NavLink>
            </div>
          </div>

          {/* AI Helper - Subtle Integration */}
          <div className="bg-slate-900 rounded-lg p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Business Intelligence</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              {aiInsights?.insights ? aiInsights.insights[0] : "Welcome to VyaparFlow. Create your first invoice to generate smart financial insights."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
