import Invoice from '../models/Invoice.js';
import Client from '../models/Client.js';
import Product from '../models/Product.js';

/**
 * Controller to generate business intelligence metrics.
 * Aggregates revenue, pending payments, and top performers.
 */
export const getAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1. Fetch all data for this user
    const invoices = await Invoice.find({ userId });
    const clients = await Client.find({ userId });
    const products = await Product.find({ userId });

    // 2. Calculate Revenue (Any issued invoice: final, paid, partial, overdue)
    const revenueInvoices = invoices.filter(inv => ['final', 'paid', 'partial', 'overdue'].includes(inv.status));
    const totalRevenue = revenueInvoices.reduce((acc, inv) => acc + (inv.total || 0), 0);
    
    // 3. Calculate Pending Payments (Total Outstanding across all unpaid/partially paid)
    const pendingPayments = invoices
      .filter(inv => ['final', 'partial', 'overdue'].includes(inv.status))
      .reduce((acc, inv) => acc + ((inv.total || 0) - (inv.paidAmount || 0)), 0);

    // 4. GST Summary
    const totalGST = revenueInvoices.reduce((acc, inv) => acc + (inv.tax || 0), 0);

    // 5. Top Clients (By Revenue)
    const clientRevenueMap = {};
    revenueInvoices.forEach(inv => {
      const name = inv.clientName || 'Unknown';
      clientRevenueMap[name] = (clientRevenueMap[name] || 0) + (inv.total || 0);
    });
    const topClients = Object.entries(clientRevenueMap)
      .map(([name, revenue]) => ({ name, revenue }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // 6. Revenue Trend (Last 6 Months)
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    const trend = [];
    for (let i = 5; i >= 0; i--) {
      const targetMonthIndex = (currentMonth - i + 12) % 12;
      const monthName = months[targetMonthIndex];
      const monthRev = revenueInvoices
        .filter(inv => new Date(inv.createdAt).getMonth() === targetMonthIndex)
        .reduce((acc, inv) => acc + (inv.total || 0), 0);
      trend.push({ month: monthName, revenue: monthRev });
    }

    const recentInvoices = revenueInvoices
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
      .map(inv => ({
        id: inv.invoiceNumber || inv._id.toString().substring(0, 8),
        client: inv.clientName || 'Unknown',
        amount: `₹${(inv.total || 0).toLocaleString()}`,
        status: inv.status === 'paid' ? 'Settled' : 'Pending',
        color: inv.status === 'paid' ? 'emerald' : 'amber'
      }));

    res.json({
      success: true,
      analytics: {
        totalRevenue,
        pendingPayments,
        totalGST,
        clientCount: clients.length,
        productCount: products.length,
        isNewUser: (invoices.length === 0 && clients.length === 0 && products.length === 0),
        topClients,
        trend,
        recentInvoices,
        invoiceDistribution: {
          drafts: invoices.filter(i => i.status === 'draft').length,
          finalized: invoices.filter(i => i.status === 'final').length,
          paid: invoices.filter(i => i.status === 'paid').length,
          partial: invoices.filter(i => i.status === 'partial').length,
          overdue: invoices.filter(i => i.status === 'overdue').length
        }
      }
    });
  } catch (error) {
    console.error('Analytics Error:', error);
    res.status(500).json({ success: false, error: 'Failed to aggregate business intelligence.' });
  }
};
