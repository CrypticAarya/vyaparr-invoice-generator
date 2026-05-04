import React, { forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const InvoicePreview = forwardRef(({
  data = {}, calculations = { subtotal: 0, totalDiscount: 0, taxableAmount: 0, taxAmount: 0, cgst: 0, sgst: 0, igst: 0, total: 0 },
  isSaving, isExporting, saveSuccess,
  handleSaveDraft, handleExportPDF
}, ref) => {

  const formatCurrency = (amount) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(date);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="w-full flex flex-col hidden-scrollbar overflow-y-auto max-h-[calc(100vh-8rem)] mb-12"
    >
      {/* Document Wrapper */}
      <div className="bg-white shadow-[0_20px_60px_rgb(0,0,0,0.06)] border border-slate-200 p-0 flex flex-col relative overflow-hidden min-h-[800px]" ref={ref}>
        {/* Decorative Top Border */}
        <div className="h-3 w-full bg-slate-900"></div>

        <div className="p-8 sm:p-12">
          {/* Header Section */}
          <div className="flex justify-between items-start mb-8">
            <div className="max-w-[50%]">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">{data.businessName || 'YOUR BUSINESS NAME'}</h2>
              <p className="text-[11px] text-slate-600 font-bold whitespace-pre-line mt-2 leading-relaxed">{data.businessAddress || '123 Business Sector\nCity, State, PIN'}</p>
              {data.businessWebsite && <p className="text-[11px] text-slate-600 font-bold mt-1">GSTIN: {data.businessWebsite}</p>}
            </div>
            <div className="text-right">
              <h1 className="text-3xl font-black text-indigo-600 tracking-tight uppercase mb-2">TAX INVOICE</h1>
              <div className="text-[11px] font-bold text-slate-600 grid grid-cols-2 gap-x-4 gap-y-1 text-right items-center">
                <span className="text-slate-400">Invoice No:</span>
                <span className="text-slate-900">{data.invoiceNumber || 'INV-001'}</span>
                <span className="text-slate-400">Date:</span>
                <span className="text-slate-900">{formatDate(data.dateIssued) || 'N/A'}</span>
                <span className="text-slate-400">Due Date:</span>
                <span className="text-slate-900">{formatDate(data.dueDate) || 'N/A'}</span>
              </div>
            </div>
          </div>

          <div className="h-px w-full bg-slate-200 mb-8"></div>

          {/* Client Details */}
          <div className="flex justify-between gap-8 mb-8">
            <div className="w-1/2">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Billed To</p>
              <h3 className="text-[13px] font-black text-slate-900 uppercase">{data.clientName || 'Client Name'}</h3>
              {data.clientGstin && <p className="text-[11px] font-bold text-slate-600 mt-1">GSTIN: {data.clientGstin}</p>}
              <p className="text-[11px] text-slate-500 font-medium whitespace-pre-line mt-2 leading-relaxed">{data.clientAddress || 'Client Billing Address'}</p>
            </div>
            {data.shippingAddress && (
              <div className="w-1/2">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Shipped To</p>
                <h3 className="text-[13px] font-black text-slate-900 uppercase">{data.clientName}</h3>
                <p className="text-[11px] text-slate-500 font-medium whitespace-pre-line mt-2 leading-relaxed">{data.shippingAddress}</p>
              </div>
            )}
          </div>

          {/* Line Items Table */}
          <div className="mb-8">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-y border-slate-900 bg-slate-50">
                  <th className="py-2.5 px-2 font-black text-slate-900 text-[9px] uppercase tracking-widest w-[10%] text-center">S.No</th>
                  <th className="py-2.5 px-2 font-black text-slate-900 text-[9px] uppercase tracking-widest w-[35%]">Item Details</th>
                  <th className="py-2.5 px-2 font-black text-slate-900 text-[9px] uppercase tracking-widest w-[10%] text-center">HSN/SAC</th>
                  <th className="py-2.5 px-2 font-black text-slate-900 text-[9px] uppercase tracking-widest w-[10%] text-center">Qty</th>
                  <th className="py-2.5 px-2 font-black text-slate-900 text-[9px] uppercase tracking-widest w-[15%] text-right">Rate</th>
                  <th className="py-2.5 px-2 font-black text-slate-900 text-[9px] uppercase tracking-widest w-[20%] text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="text-[11px] text-slate-800 font-medium">
                {data.items.length === 0 && (
                  <tr><td colSpan="6" className="py-8 text-center text-slate-400 italic">No items added.</td></tr>
                )}
                {data.items.map((item, index) => {
                  const qty = Number(item.qty) || 0;
                  const rate = Number(item.rate) || 0;
                  const discountPercent = Number(item.discount) || 0;
                  const grossAmount = qty * rate;
                  const discountAmount = (grossAmount * discountPercent) / 100;
                  const netAmount = grossAmount - discountAmount;
                  
                  return (
                    <tr key={item.id} className="border-b border-slate-100">
                      <td className="py-3 px-2 text-center text-slate-500">{index + 1}</td>
                      <td className="py-3 px-2">
                        <span className="font-bold text-slate-900">{item.description || '-'}</span>
                        {discountPercent > 0 && <span className="block text-[9px] text-rose-500 mt-0.5">Incl. {discountPercent}% discount</span>}
                      </td>
                      <td className="py-3 px-2 text-center text-slate-500">{item.hsn || '-'}</td>
                      <td className="py-3 px-2 text-center">{qty}</td>
                      <td className="py-3 px-2 text-right">{formatCurrency(rate)}</td>
                      <td className="py-3 px-2 text-right font-bold text-slate-900">{formatCurrency(netAmount)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Totals Section */}
          <div className="flex justify-between items-start gap-12">
            <div className="w-1/2">
              <div className="mb-6">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Bank Details</p>
                <p className="text-[11px] text-slate-600 font-bold whitespace-pre-line leading-relaxed">{data.paymentTerms || 'Bank Name: \nAccount No: \nIFSC: '}</p>
              </div>
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Terms & Conditions</p>
                <p className="text-[11px] text-slate-600 font-medium whitespace-pre-line leading-relaxed">{data.notes}</p>
              </div>
            </div>

            <div className="w-1/2 max-w-xs">
              <table className="w-full text-[11px] font-bold">
                <tbody>
                  <tr className="border-b border-slate-100">
                    <td className="py-2 text-slate-500">Total Value</td>
                    <td className="py-2 text-right text-slate-900">{formatCurrency(calculations.subtotal)}</td>
                  </tr>
                  {calculations.totalDiscount > 0 && (
                    <tr className="border-b border-slate-100">
                      <td className="py-2 text-rose-500">Less Discount</td>
                      <td className="py-2 text-right text-rose-500">-{formatCurrency(calculations.totalDiscount)}</td>
                    </tr>
                  )}
                  <tr className="border-b border-slate-100">
                    <td className="py-2 text-slate-500">Taxable Value</td>
                    <td className="py-2 text-right text-slate-900">{formatCurrency(calculations.taxableAmount)}</td>
                  </tr>
                  
                  {/* GST Breakup */}
                  {data.igstMode ? (
                    <tr className="border-b border-slate-100">
                      <td className="py-2 text-slate-500">IGST</td>
                      <td className="py-2 text-right text-slate-900">{formatCurrency(calculations.igst)}</td>
                    </tr>
                  ) : (
                    <>
                      <tr className="border-b border-slate-100">
                        <td className="py-2 text-slate-500">CGST</td>
                        <td className="py-2 text-right text-slate-900">{formatCurrency(calculations.cgst)}</td>
                      </tr>
                      <tr className="border-b border-slate-100">
                        <td className="py-2 text-slate-500">SGST</td>
                        <td className="py-2 text-right text-slate-900">{formatCurrency(calculations.sgst)}</td>
                      </tr>
                    </>
                  )}
                  
                  <tr className="bg-slate-900 text-white border-y-2 border-white">
                    <td className="py-3 px-3 text-[13px] font-black uppercase tracking-widest">Grand Total</td>
                    <td className="py-3 px-3 text-right text-[15px] font-black">{formatCurrency(calculations.total)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer Signature */}
          <div className="mt-16 flex justify-end">
            <div className="text-center w-48">
              <div className="h-12 border-b border-slate-300 mb-2"></div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Authorized Signatory</p>
              <p className="text-[9px] font-bold text-slate-400 mt-1">For {data.businessName || 'Business Name'}</p>
            </div>
          </div>
          
        </div>
      </div>
    </motion.div>
  );
});

export default InvoicePreview;

