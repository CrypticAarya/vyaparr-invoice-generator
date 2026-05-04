export const DEMO_CLIENTS = [
  { _id: 'demo1', name: 'Rahul Sharma', company: 'TechNova Solutions', email: 'rahul@technova.com', phone: '+91 98765 43210', gstin: '27AAACR1234A1Z1', pendingAmount: 45000, address: 'Plot 42, Hitech City, Hyderabad' },
  { _id: 'demo2', name: 'Ananya Iyer', company: 'Creative Edge', email: 'ananya@creative.in', phone: '+91 91234 56789', gstin: '29BBBCS5678B2Z2', pendingAmount: 12000, address: 'MG Road, Bengaluru' },
  { _id: 'demo3', name: 'Vikram Singh', company: 'Global Logistics', email: 'vikram@gl.com', phone: '+91 88888 77777', gstin: '07CCCDT9012C3Z3', pendingAmount: 0, address: 'Connaught Place, Delhi' }
];

export const DEMO_PRODUCTS = [
  { _id: 'p1', name: 'Premium UI/UX Package', unitPrice: 85000, gstSlab: 18, unit: 'Project', hsn: '9983', description: 'Complete design system and prototyping.' },
  { _id: 'p2', name: 'Backend Infrastructure', unitPrice: 120000, gstSlab: 18, unit: 'Project', hsn: '9983', description: 'Node.js and MongoDB setup.' },
  { _id: 'p3', name: 'Monthly Maintenance', unitPrice: 15000, gstSlab: 12, unit: 'Month', hsn: '9987', description: 'Bug fixes and performance monitoring.' }
];

export const DEMO_ANALYTICS = {
  totalRevenue: 3840000,
  pendingPayments: 420000,
  totalGST: 84200,
  clientCount: 24,
  productCount: 12,
  topClients: [
    { name: 'SpaceX Systems', revenue: 1240000 },
    { name: 'Neuralink Corp', revenue: 845000 },
    { name: 'Tesla Energy', revenue: 210000 }
  ],
  trend: [
    { month: 'Jan', revenue: 240000 },
    { month: 'Feb', revenue: 310000 },
    { month: 'Mar', revenue: 290000 },
    { month: 'Apr', revenue: 450000 },
    { month: 'May', revenue: 520000 },
    { month: 'Jun', revenue: 680000 }
  ],
  recentInvoices: [
    { id: 'INV-7721', client: 'SpaceX Systems', amount: '₹1,24,000', status: 'Settled', color: 'emerald' },
    { id: 'INV-7722', client: 'Neuralink Corp', amount: '₹84,500', status: 'In Review', color: 'amber' },
    { id: 'INV-7723', client: 'Tesla Energy', amount: '₹2,10,000', status: 'Overdue', color: 'rose' }
  ],
  invoiceDistribution: { drafts: 8, finalized: 124 }
};

export const DEMO_INVOICES = [
  { _id: 'inv1', invoiceNumber: 'INV-7721', clientName: 'SpaceX Systems', totalAmount: 124000, status: 'final', dateIssued: '2026-05-01', createdAt: '2026-05-01' },
  { _id: 'inv2', invoiceNumber: 'INV-7722', clientName: 'Neuralink Corp', totalAmount: 84500, status: 'draft', dateIssued: '2026-05-02', createdAt: '2026-05-02' },
  { _id: 'inv3', invoiceNumber: 'INV-7723', clientName: 'Tesla Energy', totalAmount: 210000, status: 'final', dateIssued: '2026-04-28', createdAt: '2026-04-28' }
];
