import React from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { useProductLedger } from '../hooks/useProductLedger';
import PageLoader from './PageLoader';

const StockLedgerModal = ({ isOpen, onClose, product }) => {
  const { data: transactions = [], isLoading } = useProductLedger(product?._id);

  if (!product) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Stock Ledger: ${product.name}`}
      size="lg"
      actions={<Button onClick={onClose}>Close</Button>}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Current Balance</p>
            <p className="text-2xl font-black text-slate-900">{product.stockQuantity} <span className="text-sm text-slate-400 font-bold">{product.unit}</span></p>
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Status</p>
            {product.stockQuantity <= product.lowStockThreshold ? (
              <Badge variant="warning">Critical Inventory</Badge>
            ) : (
              <Badge variant="success">Healthy Stock</Badge>
            )}
          </div>
        </div>

        <div className="overflow-hidden border border-slate-100 rounded-2xl">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Date</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Event</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Qty</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                <tr>
                  <td colSpan="4" className="py-12"><PageLoader /></td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-12 text-center">
                    <p className="text-sm font-bold text-slate-400">No transactions recorded yet.</p>
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => (
                  <tr key={tx._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-xs font-bold text-slate-900">{new Date(tx.createdAt).toLocaleDateString()}</p>
                      <p className="text-[10px] font-medium text-slate-400">{new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className={`text-[10px] font-black uppercase tracking-wider ${
                          tx.type === 'inbound' ? 'text-emerald-600' : 
                          tx.type === 'outbound' ? 'text-rose-600' : 'text-indigo-600'
                        }`}>
                          {tx.type}
                        </span>
                        <p className="text-xs font-bold text-slate-600 truncate max-w-[150px]">{tx.notes || 'System Adjustment'}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`text-sm font-black ${tx.quantity < 0 || tx.type === 'outbound' ? 'text-rose-500' : 'text-emerald-500'}`}>
                        {tx.type === 'outbound' ? '-' : '+'}{Math.abs(tx.quantity)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className="text-sm font-black text-slate-900">{tx.newStock}</p>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Modal>
  );
};

export default StockLedgerModal;
