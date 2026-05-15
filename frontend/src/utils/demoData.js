export const INITIAL_EMPTY_ANALYTICS = {
  totalRevenue: 0,
  pendingPayments: 0,
  totalGST: 0,
  clientCount: 0,
  productCount: 0,
  topClients: [],
  trend: [
    { month: 'Jan', revenue: 0 },
    { month: 'Feb', revenue: 0 },
    { month: 'Mar', revenue: 0 },
    { month: 'Apr', revenue: 0 },
    { month: 'May', revenue: 0 },
    { month: 'Jun', revenue: 0 }
  ],
  recentInvoices: [],
  invoiceDistribution: { drafts: 0, finalized: 0, paid: 0, partial: 0, overdue: 0 }
};

export const DEMO_INVOICES = [
  { id: 'inv1', invoiceNumber: 'INV-7721', clientName: 'SpaceX Systems', totalAmount: 124000, status: 'final', dateIssued: '2026-05-01', createdAt: '2026-05-01' },
  { id: 'inv2', invoiceNumber: 'INV-7722', clientName: 'Neuralink Corp', totalAmount: 84500, status: 'draft', dateIssued: '2026-05-02', createdAt: '2026-05-02' },
  { id: 'inv3', invoiceNumber: 'INV-7723', clientName: 'Tesla Energy', totalAmount: 210000, status: 'final', dateIssued: '2026-04-28', createdAt: '2026-04-28' }
];
