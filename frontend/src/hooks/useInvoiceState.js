import { useState, useCallback, useEffect } from 'react';

// Default document structure for a clean starting slate
const DEFAULT_INVOICE_STATE = {
  invoiceNumber: 'INV-' + Math.floor(1000 + Math.random() * 9000),
  dateIssued: new Date().toISOString().split('T')[0],
  dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  businessWebsite: '',
  clientName: '',
  clientEmail: '',
  clientAddress: '',
  clientGstin: '',
  shippingAddress: '',
  igstMode: false,
  notes: 'Payment is due within 15 days.',
  paymentTerms: '',
  items: []
};

export const useInvoiceState = (user) => {
  // Initialize from localStorage or defaults
  const [invoiceDetails, setInvoiceDetails] = useState(() => {
    const saved = localStorage.getItem('vyaparflow_active_draft');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          businessName: user?.businessName || parsed.businessName || '',
          businessAddress: user?.businessAddress || parsed.businessAddress || '',
        };
      } catch (e) {
        console.error('Failed to parse saved draft');
      }
    }
    return {
      ...DEFAULT_INVOICE_STATE,
      businessName: user?.businessName || '',
      businessAddress: user?.businessAddress || '',
    };
  });

  // Persist to localStorage on every change
  useEffect(() => {
    localStorage.setItem('vyaparflow_active_draft', JSON.stringify(invoiceDetails));
  }, [invoiceDetails]);

  const updateField = useCallback((field, value) => {
    setInvoiceDetails(prev => ({ ...prev, [field]: value }));
  }, []);

  const updateLineItem = useCallback((id, field, value) => {
    setInvoiceDetails(prev => ({
      ...prev,
      items: prev.items.map(item => item.id === id ? { ...item, [field]: value } : item)
    }));
  }, []);

  const addLineItem = useCallback(() => {
    setInvoiceDetails(prev => ({
      ...prev,
      items: [...prev.items, { id: Date.now().toString(), description: '', hsn: '', qty: 1, rate: 0, gstSlab: 18, discount: 0 }]
    }));
  }, []);

  const removeLineItem = useCallback((id) => {
    setInvoiceDetails(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id)
    }));
  }, []);

  const loadHistoricalInvoice = useCallback((historicalData) => {
    setInvoiceDetails(prev => ({
      ...prev,               
      ...historicalData,     
      items: historicalData.items || [],
      invoiceNumber: historicalData.invoiceNumber || prev.invoiceNumber 
    }));
  }, []);

  // Professional Indian GST Calculations
  const calculations = invoiceDetails.items.reduce((acc, item) => {
    const qty = Number(item.qty) || 0;
    const rate = Number(item.rate) || 0;
    const discountPercent = Number(item.discount) || 0;
    const gstSlab = Number(item.gstSlab) || 0;

    const amountBeforeDiscount = qty * rate;
    const itemDiscount = (amountBeforeDiscount * discountPercent) / 100;
    const taxableAmount = amountBeforeDiscount - itemDiscount;
    const itemTax = (taxableAmount * gstSlab) / 100;

    acc.subtotal += amountBeforeDiscount;
    acc.totalDiscount += itemDiscount;
    acc.taxableAmount += taxableAmount;
    acc.taxAmount += itemTax;

    return acc;
  }, { subtotal: 0, totalDiscount: 0, taxableAmount: 0, taxAmount: 0 });

  calculations.total = calculations.taxableAmount + calculations.taxAmount;

  if (invoiceDetails.igstMode) {
    calculations.igst = calculations.taxAmount;
    calculations.cgst = 0;
    calculations.sgst = 0;
  } else {
    calculations.igst = 0;
    calculations.cgst = calculations.taxAmount / 2;
    calculations.sgst = calculations.taxAmount / 2;
  }

  return {
    invoiceDetails,
    setInvoiceDetails,
    updateField,
    updateLineItem,
    addLineItem,
    removeLineItem,
    loadHistoricalInvoice,
    calculations
  };
};
