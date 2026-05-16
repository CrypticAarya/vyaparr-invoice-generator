import React from 'react';
import { useAnalytics } from '../hooks/useAnalytics';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area
} from 'recharts';

// UI Components
import { CardSkeleton } from '../components/Skeleton';
import Card from '../ui/Card';

// Icons
const RevenueIcon = (props) => <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const ARPathIcon = (props) => <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>;
const ProductIcon = (props) => <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>;
const ClientIcon = (props) => <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;

export default function Analytics() {
  const { data: analyticsData, isLoading } = useAnalytics('1Y');

  if (isLoading || !analyticsData) {
    return (
      <div className="space-y-10 animate-pulse">
        <div>
          <div className="h-6 w-48 bg-slate-200 rounded mb-2"></div>
          <div className="h-4 w-64 bg-slate-200 rounded"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <CardSkeleton /><CardSkeleton /><CardSkeleton /><CardSkeleton />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-12"><CardSkeleton /></div>
          <div className="lg:col-span-7"><CardSkeleton /></div>
          <div className="lg:col-span-5"><CardSkeleton /></div>
        </div>
      </div>
    );
  }

  const { metrics, charts } = analyticsData;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white p-2.5 rounded shadow-xl border-none text-[10px] font-bold">
          <p className="mb-1 opacity-50 uppercase tracking-widest">{label}</p>
          <p className="text-sm">₹{payload[0].value.toLocaleString()}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Financial Reports</h1>
        <p className="text-xs font-medium text-slate-500">Comprehensive analysis of revenue and customer activity.</p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-md hover:-translate-y-1 transition-all">
          <div className="flex justify-between items-center mb-1">
            <span className="stat-label">Gross Revenue</span>
            <RevenueIcon className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="stat-value">₹{(metrics.totalRevenue || 0).toLocaleString()}</div>
          <div className="text-[10px] font-medium text-slate-400 mt-1">Total billing across all time</div>
        </Card>
        
        <Card className="hover:shadow-md hover:-translate-y-1 transition-all">
          <div className="flex justify-between items-center mb-1">
            <span className="stat-label">Avg. Ticket Size</span>
            <ARPathIcon className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="stat-value">₹{((metrics.totalRevenue || 0) / Math.max((analyticsData.recentActivity?.length || 0), 1)).toLocaleString(undefined, {maximumFractionDigits: 0})}</div>
          <div className="text-[10px] font-medium text-slate-400 mt-1">Per invoice average</div>
        </Card>

        <Card className="hover:shadow-md hover:-translate-y-1 transition-all">
          <div className="flex justify-between items-center mb-1">
            <span className="stat-label">Client Health</span>
            <ClientIcon className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="stat-value">{metrics.clientCount || 0}</div>
          <div className="text-[10px] font-medium text-slate-400 mt-1">Active business entities</div>
        </Card>

        <Card className="hover:shadow-md hover:-translate-y-1 transition-all">
          <div className="flex justify-between items-center mb-1">
            <span className="stat-label">SKU Diversity</span>
            <ProductIcon className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="stat-value">{metrics.productCount || 0}</div>
          <div className="text-[10px] font-medium text-slate-400 mt-1">Items in inventory catalog</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <Card noPadding className="lg:col-span-12">
          <div className="px-5 py-4 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">Revenue Trajectory</h3>
            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">12-Month Performance Log</p>
          </div>
          <div className="h-[300px] p-5">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts.revenueTrend}>
                <defs>
                  <linearGradient id="revenueGradientFull" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6D5EF5" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#6D5EF5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 600}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 600}} tickFormatter={(v) => `₹${v/1000}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="revenue" stroke="#6D5EF5" strokeWidth={3} fill="url(#revenueGradientFull)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card noPadding className="lg:col-span-7">
          <div className="px-5 py-4 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">Client Revenue Share</h3>
            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Top billing customers</p>
          </div>
          <div className="h-[280px] p-5">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.topClients}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 9, fontWeight: 600}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 9, fontWeight: 600}} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="revenue" fill="#6D5EF5" radius={[4, 4, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card noPadding className="lg:col-span-5">
          <div className="px-5 py-4 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">Inventory Performance</h3>
            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Revenue by Product</p>
          </div>
          <div className="p-4 space-y-2.5">
            {(charts.topProducts || []).slice(0, 5).map((product, idx) => (
              <div key={idx} className="flex items-center justify-between p-2.5 rounded-md hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold text-slate-300">{idx + 1}</span>
                  <div>
                    <p className="text-[11px] font-bold text-slate-900">{product.name}</p>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-v-accent" 
                          style={{ width: `${Math.min(100, (product.revenue / (charts.topProducts[0]?.revenue || 1)) * 100)}%` }}
                        ></div>
                      </div>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{product.sales} Sales</span>
                    </div>
                  </div>
                </div>
                <p className="text-[11px] font-bold text-slate-900">₹{(product.revenue || 0).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
