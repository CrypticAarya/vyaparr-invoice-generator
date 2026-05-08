import Invoice from '../models/Invoice.js';
import Client from '../models/Client.js';
import Product from '../models/Product.js';
import catchAsync from '../utils/catchAsync.js';

export const getAnalytics = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const { range = '1Y' } = req.query; // 1M, 6M, 1Y, ALL

  const invoices = await Invoice.find({ userId });
  const clients = await Client.find({ userId });
  const products = await Product.find({ userId });

  // 1. Core Revenue Metrics
  const revenueInvoices = invoices.filter(inv => ['final', 'paid', 'partial', 'overdue'].includes(inv.status));
  const totalRevenue = revenueInvoices.reduce((acc, inv) => acc + (Number(inv.total) || 0), 0);
  
  const pendingPayments = invoices
    .filter(inv => ['final', 'partial', 'overdue'].includes(inv.status))
    .reduce((acc, inv) => acc + ((Number(inv.total) || 0) - (Number(inv.paidAmount) || 0)), 0);

  const totalGST = revenueInvoices.reduce((acc, inv) => acc + (inv.tax || 0), 0);

  // 2. Growth Analysis (Current vs Last Month)
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  const currentMonthRevenue = revenueInvoices
    .filter(inv => {
      const d = new Date(inv.createdAt);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    })
    .reduce((acc, inv) => acc + (inv.total || 0), 0);

  const lastMonthRevenue = revenueInvoices
    .filter(inv => {
      const d = new Date(inv.createdAt);
      return d.getMonth() === lastMonth && d.getFullYear() === lastMonthYear;
    })
    .reduce((acc, inv) => acc + (inv.total || 0), 0);

  const revenueGrowth = lastMonthRevenue === 0 ? 100 : ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100;

  // 3. Inventory Health
  const totalStockItems = products.filter(p => !p.isService).length;
  const lowStockItems = products.filter(p => !p.isService && p.stockQuantity <= p.lowStockThreshold).length;
  const outOfStockItems = products.filter(p => !p.isService && p.stockQuantity <= 0).length;
  
  const inventoryHealth = totalStockItems === 0 ? 100 : Math.max(0, ((totalStockItems - lowStockItems) / totalStockItems) * 100);

  // 4. Top Performers
  const topProducts = products
    .sort((a, b) => (b.totalRevenueGenerated || 0) - (a.totalRevenueGenerated || 0))
    .slice(0, 5)
    .map(p => ({ name: p.name, revenue: p.totalRevenueGenerated || 0, sales: p.usageCount || 0 }));

  const clientRevenueMap = {};
  revenueInvoices.forEach(inv => {
    const name = inv.clientName || 'Unknown';
    clientRevenueMap[name] = (clientRevenueMap[name] || 0) + (inv.total || 0);
  });
  const topClients = Object.entries(clientRevenueMap)
    .map(([name, revenue]) => ({ name, revenue }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  // 5. Dynamic Trends based on range
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const trend = [];
  
  let lookback = 11;
  if (range === '1M') lookback = 0;
  if (range === '6M') lookback = 5;
  if (range === 'ALL') lookback = 23; // 2 years

  for (let i = lookback; i >= 0; i--) {
    const d = new Date();
    d.setMonth(now.getMonth() - i);
    const targetMonth = d.getMonth();
    const targetYear = d.getFullYear();
    
    const monthRev = revenueInvoices
      .filter(inv => {
        const invDate = new Date(inv.createdAt);
        return invDate.getMonth() === targetMonth && invDate.getFullYear() === targetYear;
      })
      .reduce((acc, inv) => acc + (inv.total || 0), 0);
      
    trend.push({ 
      month: months[targetMonth], 
      year: targetYear,
      revenue: monthRev,
      label: lookback > 11 ? `${months[targetMonth]} ${targetYear}` : months[targetMonth]
    });
  }

  // 6. Distribution Formatting for Charts
  const statusDistribution = [
    { name: 'Paid', value: invoices.filter(i => i.status === 'paid').length, color: '#10b981' },
    { name: 'Partial', value: invoices.filter(i => i.status === 'partial').length, color: '#f59e0b' },
    { name: 'Finalized', value: invoices.filter(i => i.status === 'final').length, color: '#6366f1' },
    { name: 'Overdue', value: invoices.filter(i => i.status === 'overdue').length, color: '#f43f5e' },
    { name: 'Drafts', value: invoices.filter(i => i.status === 'draft').length, color: '#94a3b8' }
  ].filter(item => item.value > 0);

  res.json({
    success: true,
    data: {
      analytics: {
        metrics: {
          totalRevenue,
          revenueGrowth: Math.round(revenueGrowth),
          pendingPayments,
          totalGST,
          clientCount: clients.length,
          productCount: products.length,
          inventoryHealth: Math.round(inventoryHealth),
          lowStockCount: lowStockItems,
          outOfStockCount: outOfStockItems
        },
        charts: {
          revenueTrend: trend,
          statusDistribution,
          topProducts,
          topClients
        },
        recentActivity: revenueInvoices
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5)
          .map(inv => ({
            id: inv.invoiceNumber || inv._id.toString().substring(0, 8),
            client: inv.clientName || 'Unknown',
            amount: inv.total || 0,
            status: inv.status,
            date: inv.createdAt
          }))
      }
    }
  });
});
