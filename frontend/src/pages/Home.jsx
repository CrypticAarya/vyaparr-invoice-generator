import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAnalytics } from '../hooks/useAnalytics';
import { useAiInsights } from '../hooks/useAiInsights';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, BarChart, Bar
} from 'recharts';

// UI Components
import SectionHeader from '../ui/SectionHeader';
import Button from '../ui/Button';
import PageLoader from '../components/PageLoader';
import StatCard from '../ui/analytics/StatCard';
import ChartCard from '../ui/analytics/ChartCard';
import KPISection from '../ui/analytics/KPISection';
import RecommendationPanel from '../ui/ai/RecommendationPanel';

// Icons
const RevenueIcon = (props) => <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const ARPathIcon = (props) => <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>;
const GSTIcon = (props) => <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" /></svg>;
const InventoryIcon = (props) => <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>;

export default function Home() {
  const [range, setRange] = useState('1Y');
  const { data: analyticsData, isLoading } = useAnalytics(range);
  const { data: aiInsights, isLoading: isAiLoading } = useAiInsights();

  if (isLoading || !analyticsData) {
    return <PageLoader />;
  }

  const { metrics, charts, recentActivity } = analyticsData.analytics;

  return (
    <div className="space-y-10">
      <SectionHeader 
        title="Command Center" 
        description="Your business intelligence and revenue health at a glance."
        actions={
          <>
            <Button variant="secondary" icon={() => (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            )}>Export Data</Button>
            <NavLink to="/new-invoice">
              <Button icon={() => (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
              )}>New Invoice</Button>
            </NavLink>
          </>
        }
      />

      {/* KPI Stats */}
      <KPISection>
        <StatCard 
          title="Total Revenue" 
          value={`₹${(metrics.totalRevenue || 0).toLocaleString()}`} 
          trend={metrics.revenueGrowth} 
          subValue="Monthly Growth"
          icon={RevenueIcon}
          color="indigo"
        />
        <StatCard 
          title="Outstanding AR" 
          value={`₹${(metrics.pendingPayments || 0).toLocaleString()}`} 
          subValue="Accounts Receivable"
          icon={ARPathIcon}
          color="rose"
        />
        <StatCard 
          title="Tax Liability" 
          value={`₹${(metrics.totalGST || 0).toLocaleString()}`} 
          subValue="Estimated GST"
          icon={GSTIcon}
          color="amber"
        />
        <StatCard 
          title="Inventory Health" 
          value={`${metrics.inventoryHealth}%`} 
          subValue={`${metrics.lowStockCount} Low stock items`}
          icon={InventoryIcon}
          color="emerald"
        />
      </KPISection>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Analytics Block */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Revenue Trend Chart */}
          <ChartCard 
            title="Revenue Performance" 
            description="Monthly revenue trends over selected period"
            actions={
              <div className="flex bg-slate-100 p-1 rounded-xl">
                {['1M', '6M', '1Y', 'ALL'].map(t => (
                  <button 
                    key={t} 
                    onClick={() => setRange(t)}
                    className={`px-3 py-1.5 text-[10px] font-black rounded-lg transition-all ${range === t ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            }
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts.revenueTrend}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="label" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}}
                  tickFormatter={(value) => `₹${value >= 1000 ? (value/1000).toFixed(0)+'k' : value}`}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
                  formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Recent Activity Table (Alternative to ChartCard) */}
          <ChartCard 
            title="Recent Activity" 
            description="Latest finalized invoices"
            actions={<NavLink to="/history" className="text-xs font-black text-indigo-600 uppercase hover:underline">View All</NavLink>}
          >
            <div className="space-y-4">
              {recentActivity.map((activity, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl group hover:bg-indigo-50 transition-all cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 group-hover:text-indigo-600 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-900">#{activity.id} - {activity.client}</p>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{new Date(activity.date).toLocaleDateString('en-IN')}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-slate-900">₹{(activity.amount || 0).toLocaleString()}</p>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${activity.status === 'paid' ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {activity.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>

        {/* AI Side Block */}
        <div className="lg:col-span-4 space-y-8">
          <RecommendationPanel 
            insights={aiInsights?.insights} 
            isLoading={isAiLoading} 
          />

          <ChartCard 
            title="Invoice Status" 
            description="Current pipeline"
          >
            <ResponsiveContainer width="100%" height="200px">
              <PieChart>
                <Pie
                  data={charts.statusDistribution}
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {charts.statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>
    </div>
  );
}
