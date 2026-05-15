import prisma from '../lib/prisma.js';

/**
 * ANALYTICS SERVICE
 * 
 * This service transforms raw database records into meaningful business intelligence.
 * We calculate real-time KPIs like revenue growth, inventory health, and cashflow trends.
 */
class AnalyticsService {

  /**
   * GENERATE DASHBOARD DATA
   * Consolidates all business metrics into a single unified object for the frontend.
   */
  async getBusinessOverview(userId, timeframe = '1Y') {
    const today = new Date();
    
    // 1. Fetch the necessary raw data buckets
    const invoices = await prisma.invoice.findMany({
      where: { userId },
      include: { items: true }
    });
    
    const totalClients = await prisma.client.count({ where: { userId } });
    const productCatalog = await prisma.product.findMany({ where: { userId } });

    // 2. Identify Revenue-Generating Invoices
    // We exclude Drafts as they represent potential but not realized revenue.
    const activeInvoices = invoices.filter(inv => 
      ['FINAL', 'PAID', 'PARTIAL', 'OVERDUE'].includes(inv.status)
    );
    
    const totalRevenue = activeInvoices.reduce((sum, inv) => sum + (inv.total || 0), 0);
    const totalTaxCollected = activeInvoices.reduce((sum, inv) => sum + (inv.tax || 0), 0);
    
    // Calculate what's still 'in the air' (Accounts Receivable)
    const pendingReceivables = invoices
      .filter(inv => ['FINAL', 'PARTIAL', 'OVERDUE'].includes(inv.status))
      .reduce((sum, inv) => sum + ((inv.total || 0) - (inv.paidAmount || 0)), 0);

    // 3. Growth Benchmarking (Month-over-Month)
    const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const nextMonthStart = new Date(today.getFullYear(), today.getMonth() + 1, 1);

    const currentMonthRevenue = activeInvoices
      .filter(inv => inv.createdAt >= thisMonthStart && inv.createdAt < nextMonthStart)
      .reduce((sum, inv) => sum + (inv.total || 0), 0);

    const previousMonthRevenue = activeInvoices
      .filter(inv => inv.createdAt >= lastMonthStart && inv.createdAt < thisMonthStart)
      .reduce((sum, inv) => sum + (inv.total || 0), 0);

    const revenueGrowthRate = previousMonthRevenue === 0 
      ? (currentMonthRevenue > 0 ? 100 : 0) 
      : ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100;

    // 4. Logistics & Inventory Health
    const physicalProducts = productCatalog.filter(p => !p.isService);
    const lowStockAlerts = physicalProducts.filter(p => p.stockQuantity <= p.lowStockThreshold).length;
    const stockouts = physicalProducts.filter(p => p.stockQuantity <= 0).length;
    
    // Health score: Percentage of items that are well-stocked
    const inventoryHealthScore = physicalProducts.length === 0 
      ? 100 
      : ((physicalProducts.length - lowStockAlerts) / physicalProducts.length) * 100;

    // 5. Time-Series Trends (Revenue Chart)
    const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const revenueTrend = [];
    
    // Determine how many months back we look based on the selected timeframe
    let lookbackMonths = 11; // Default 1 Year
    if (timeframe === '1M') lookbackMonths = 0;
    if (timeframe === '6M') lookbackMonths = 5;
    if (timeframe === 'ALL') lookbackMonths = 23;

    for (let i = lookbackMonths; i >= 0; i--) {
      const targetDate = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const m = targetDate.getMonth();
      const y = targetDate.getFullYear();
      
      const monthRevenue = activeInvoices
        .filter(inv => inv.createdAt.getMonth() === m && inv.createdAt.getFullYear() === y)
        .reduce((sum, inv) => sum + (inv.total || 0), 0);
        
      revenueTrend.push({ 
        month: monthLabels[m], 
        year: y,
        revenue: monthRevenue,
        label: lookbackMonths > 11 ? `${monthLabels[m]} ${y}` : monthLabels[m]
      });
    }

    // 6. Business Distribution (Status & Top Performers)
    const statusPie = [
      { name: 'Paid', value: invoices.filter(i => i.status === 'PAID').length, color: '#10b981' },
      { name: 'Partial', value: invoices.filter(i => i.status === 'PARTIAL').length, color: '#f59e0b' },
      { name: 'Finalized', value: invoices.filter(i => i.status === 'FINAL').length, color: '#6366f1' },
      { name: 'Overdue', value: invoices.filter(i => i.status === 'OVERDUE').length, color: '#f43f5e' },
      { name: 'Drafts', value: invoices.filter(i => i.status === 'DRAFT').length, color: '#94a3b8' }
    ].filter(segment => segment.value > 0);

    const topSellingProducts = productCatalog
      .sort((a, b) => (b.totalRevenueGenerated || 0) - (a.totalRevenueGenerated || 0))
      .slice(0, 5)
      .map(p => ({ name: p.name, revenue: p.totalRevenueGenerated || 0, sales: p.usageCount || 0 }));

    return {
      metrics: {
        totalRevenue,
        revenueGrowth: Math.round(revenueGrowthRate),
        pendingPayments: pendingReceivables,
        totalGST: totalTaxCollected,
        clientCount: totalClients,
        productCount: productCatalog.length,
        inventoryHealth: Math.round(inventoryHealthScore),
        lowStockCount: lowStockAlerts,
        outOfStockCount: stockouts
      },
      charts: {
        revenueTrend,
        statusDistribution: statusPie,
        topProducts: topSellingProducts
      },
      recentLedger: activeInvoices
        .sort((a, b) => b.createdAt - a.createdAt)
        .slice(0, 5)
        .map(inv => ({
          id: inv.invoiceNumber || inv.id.substring(0, 8),
          client: inv.clientName || 'Unknown',
          amount: inv.total || 0,
          status: inv.status.toLowerCase(),
          date: inv.createdAt
        }))
    };
  }
}

export default new AnalyticsService();
