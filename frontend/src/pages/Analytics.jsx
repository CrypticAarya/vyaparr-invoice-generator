import React from 'react';
import { useAnalytics } from '../hooks/useAnalytics';
import { useAiInsights } from '../hooks/useAiInsights';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line
} from 'recharts';

// UI Components
import SectionHeader from '../ui/SectionHeader';
import PageLoader from '../components/PageLoader';
import StatCard from '../ui/analytics/StatCard';
import ChartCard from '../ui/analytics/ChartCard';
import Badge from '../ui/Badge';
import AIAlert from '../ui/ai/AIAlert';

// Icons
const RevenueIcon = (props) => <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const ARPathIcon = (props) => <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>;
const ProductIcon = (props) => <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>;
const ClientIcon = (props) => <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;

export default function Analytics() {
  const { data: analyticsData, isLoading } = useAnalytics();
  const { data: aiInsights, isLoading: isAiLoading } = useAiInsights();

  if (isLoading || !analyticsData) {
    return <PageLoader />;
  }

  const { metrics, charts } = analyticsData;

  return (
    <div className="space-y-10">
      <SectionHeader 
        title="Business Intelligence" 
        description="Deep dive into your revenue streams, product performance, and customer lifetime value."
      />

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Gross Revenue" 
          value={`₹${(metrics.totalRevenue || 0).toLocaleString()}`} 
          trend={metrics.revenueGrowth} 
          icon={RevenueIcon}
          color="indigo"
        />
        <StatCard 
          title="Avg Order Value" 
          value={`₹${(metrics.totalRevenue / (analyticsData.recentActivity?.length || 1)).toLocaleString(undefined, {maximumFractionDigits: 0})}`} 
          icon={ARPathIcon}
          color="purple"
        />
        <StatCard 
          title="Active Products" 
          value={metrics.productCount} 
          subValue={`${metrics.outOfStockCount} Out of stock`}
          icon={ProductIcon}
          color="amber"
        />
        <StatCard 
          title="Total Customers" 
          value={metrics.clientCount} 
          icon={ClientIcon}
          color="emerald"
        />
      </div>

      {/* AI Predictive Section */}
      {!isAiLoading && aiInsights && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AIAlert 
            type="info" 
            title="Revenue Forecast" 
            text={aiInsights.predictions.revenueForecast} 
          />
          <AIAlert 
            type={aiInsights.predictions.riskLevel === 'Low' ? 'success' : 'warning'} 
            title="Risk Assessment" 
            text={`Current business risk level is ${aiInsights.predictions.riskLevel}. ${aiInsights.healthSummary}`} 
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <ChartCard 
          className="lg:col-span-12"
          title="Revenue Growth Over Time" 
          description="Detailed monthly revenue tracking with comparison markers"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={charts.revenueTrend}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="label" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 700}}
                dy={10}
              />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 700}} />
              <Tooltip 
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
              />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#6366f1" 
                strokeWidth={4} 
                dot={{ r: 6, fill: '#6366f1', strokeWidth: 3, stroke: '#fff' }}
                activeDot={{ r: 8, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard 
          className="lg:col-span-7"
          title="Client Contribution" 
          description="Revenue distribution across your top customers"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={charts.topClients}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 700}}
              />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 700}} />
              <Tooltip 
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
              />
              <Bar dataKey="revenue" fill="#818cf8" radius={[8, 8, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard 
          className="lg:col-span-5"
          title="Product Performance" 
          description="Revenue generated by your inventory"
        >
          <div className="space-y-4">
            {charts.topProducts.map((product, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center font-black text-slate-400">
                    {idx + 1}
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-900">{product.name}</p>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{product.sales} Sales</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-slate-900">₹{(product.revenue || 0).toLocaleString()}</p>
                  <Badge variant="info">Top Tier</Badge>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>
    </div>
  );
}
