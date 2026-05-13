import React, { forwardRef } from 'react';

const InvoicePreview = forwardRef(({
  data = {}, calculations = { subtotal: 0, totalDiscount: 0, taxableAmount: 0, taxAmount: 0, cgst: 0, sgst: 0, igst: 0, total: 0 }
}, ref) => {

  const formatCurrency = (amount) => new Intl.NumberFormat('en-IN', { 
    style: 'currency', 
    currency: 'INR',
    maximumFractionDigits: 0 
  }).format(amount);

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date);
  };

  return (
    <div className="w-full flex flex-col overflow-y-auto max-h-[calc(100vh-10rem)] shadow-inner bg-slate-100 p-6 rounded-xl border border-slate-200">
      {/* Document Wrapper */}
      <div className="bg-white shadow-2xl mx-auto w-full max-w-[800px] flex flex-col relative overflow-hidden min-h-[1000px] text-slate-900 font-sans" ref={ref} id="invoice-capture-area">
        
        {/* Header Ribbon */}
        <div className="h-2 w-full bg-slate-900"></div>

        <div className="p-10 sm:p-14 flex flex-col h-full">
          {/* Top Section */}
          <div className="flex justify-between items-start mb-12">
            <div className="flex-1 pr-8">
              <h1 className="text-xl font-bold text-slate-900 uppercase tracking-tight mb-3">{data.businessName || 'YOUR BUSINESS NAME'}</h1>
              <div className="text-[11px] text-slate-500 font-medium space-y-1 leading-relaxed">
                <p className="whitespace-pre-line">{data.businessAddress || 'Business Address Not Provided'}</p>
                {data.businessWebsite && <p className="font-bold text-slate-700">GSTIN: {data.businessWebsite}</p>}
              </div>
            </div>
            <div className="text-right">
              <h2 className="text-2xl font-black text-slate-900 mb-4 tracking-tighter uppercase">Tax Invoice</h2>
              <div className="text-[11px] font-bold text-slate-600 space-y-1.5">
                <p><span className="text-slate-400 mr-2 uppercase tracking-wider">No:</span> <span className="text-slate-900">{data.invoiceNumber || '—'}</span></p>
                <p><span className="text-slate-400 mr-2 uppercase tracking-wider">Date:</span> <span className="text-slate-900">{formatDate(data.dateIssued)}</span></p>
                <p><span className="text-slate-400 mr-2 uppercase tracking-wider">Due:</span> <span className="text-slate-900">{formatDate(data.dueDate)}</span></p>
              </div>
            </div>
          </div>

          <div className="h-px w-full bg-slate-100 mb-10"></div>

          {/* Client Details */}
          <div className="grid grid-cols-2 gap-12 mb-12">
            <div>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-3">Bill To</p>
              <h3 className="text-sm font-bold text-slate-900 uppercase mb-2">{data.clientName || 'Client Name'}</h3>
              <div className="text-[11px] text-slate-500 font-medium space-y-1 leading-relaxed">
                {data.clientGstin && <p className="font-bold text-slate-700">GSTIN: {data.clientGstin}</p>}
                <p className="whitespace-pre-line">{data.clientAddress || 'Client Address Not Provided'}</p>
              </div>
            </div>
            <div className="text-right">
              {/* Optional secondary info could go here */}
            </div>
          </div>

          {/* Line Items Table */}
          <div className="flex-1 mb-12">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-900">
                  <th className="py-3 px-2 font-bold text-slate-900 text-[10px] uppercase tracking-widest w-[8%]">#</th>
                  <th className="py-3 px-2 font-bold text-slate-900 text-[10px] uppercase tracking-widest w-[42%]">Description</th>
                  <th className="py-3 px-2 font-bold text-slate-900 text-[10px] uppercase tracking-widest w-[10%] text-center">Qty</th>
                  <th className="py-3 px-2 font-bold text-slate-900 text-[10px] uppercase tracking-widest w-[20%] text-right">Price</th>
                  <th className="py-3 px-2 font-bold text-slate-900 text-[10px] uppercase tracking-widest w-[20%] text-right">Total</th>
                </tr>
              </thead>
              <tbody className="text-[11px] text-slate-800">
                {data.items.length === 0 ? (
                  <tr><td colSpan="5" className="py-12 text-center text-slate-300 font-medium">No items listed on this invoice.</td></tr>
                ) : (
                  data.items.map((item, index) => {
                    const qty = Number(item.qty) || 0;
                    const rate = Number(item.rate) || 0;
                    const netAmount = (qty * rate) * (1 - (Number(item.discount) || 0) / 100);
                    
                    return (
                      <tr key={item.id} className="border-b border-slate-100">
                        <td className="py-4 px-2 text-slate-400 font-medium">{index + 1}</td>
                        <td className="py-4 px-2 font-bold text-slate-900">
                          {item.description || '—'}
                          {item.hsn && <span className="block text-[9px] text-slate-400 font-normal mt-0.5">HSN: {item.hsn}</span>}
                        </td>
                        <td className="py-4 px-2 text-center font-medium">{qty}</td>
                        <td className="py-4 px-2 text-right font-medium">{formatCurrency(rate)}</td>
                        <td className="py-4 px-2 text-right font-bold text-slate-900">{formatCurrency(netAmount)}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Totals Section */}
          <div className="mt-auto pt-10 border-t border-slate-100 flex justify-between items-start">
            <div className="w-1/2 pr-12">
              <div className="mb-6">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">Payment Details</p>
                <p className="text-[10px] text-slate-600 font-bold whitespace-pre-line leading-relaxed">{data.paymentTerms || 'Bank details not provided.'}</p>
              </div>
              <div>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">Notes</p>
                <p className="text-[10px] text-slate-500 font-medium whitespace-pre-line leading-relaxed">{data.notes || 'No additional notes.'}</p>
              </div>
            </div>

            <div className="w-1/2 max-w-[280px]">
              <div className="space-y-3 text-[11px] font-bold">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal</span>
                  <span>{formatCurrency(calculations.subtotal)}</span>
                </div>
                {calculations.totalDiscount > 0 && (
                  <div className="flex justify-between text-rose-500">
                    <span>Discount</span>
                    <span>-{formatCurrency(calculations.totalDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-500">
                  <span>Taxable Amount</span>
                  <span>{formatCurrency(calculations.taxableAmount)}</span>
                </div>
                
                {data.igstMode ? (
                  <div className="flex justify-between text-slate-500">
                    <span>IGST</span>
                    <span>{formatCurrency(calculations.igst)}</span>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between text-slate-500">
                      <span>CGST</span>
                      <span>{formatCurrency(calculations.cgst)}</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>SGST</span>
                      <span>{formatCurrency(calculations.sgst)}</span>
                    </div>
                  </>
                )}
                
                <div className="flex justify-between items-center pt-4 mt-4 border-t-2 border-slate-900">
                  <span className="text-[12px] font-black uppercase text-slate-900">Total Amount</span>
                  <span className="text-[18px] font-black text-slate-900">{formatCurrency(calculations.total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-20 flex justify-between items-end border-t border-slate-50 pt-8">
            <div className="text-[9px] text-slate-400 font-bold tracking-wider">
              GENERATED VIA VYAPAAR FLOW
            </div>
            <div className="text-center w-48">
              <div className="h-10 border-b border-slate-300 mb-2"></div>
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Authorized Signatory</p>
              <p className="text-[8px] font-medium text-slate-400 mt-1">For {data.businessName || 'Business Name'}</p>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
});

export default InvoicePreview;
