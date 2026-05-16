import React, { useState, useEffect } from 'react';
import { fetchInvoices, removeInvoiceRecord } from '../api';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// UI Components
import { TableSkeleton } from '../components/Skeleton';
import SearchInput from '../components/SearchInput';
import Table, { TableRow, TableCell } from '../ui/Table';
import Badge from '../ui/Badge';
import Card from '../ui/Card';
import EmptyState from '../ui/EmptyState';
import ConfirmDialog from '../ui/ConfirmDialog';

export default function History() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null); // { id }
  
  const { addToast } = useToast();
  const navigate = useNavigate();

  const loadHistory = async () => {
    try {
      const data = await fetchInvoices();
      // Filter out drafts from the main archive
      const finalized = (data || []).filter(inv => inv.status.toLowerCase() !== 'draft');
      setInvoices(finalized);
    } catch (err) {
      addToast('System could not retrieve document archive', 'error');
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleDelete = (inv) => {
    setConfirmDelete({ id: inv.id, invoiceNumber: inv.invoiceNumber });
  };

  const confirmDeleteInvoice = async () => {
    if (!confirmDelete) return;
    try {
      await removeInvoiceRecord(confirmDelete.id);
      addToast('Document successfully archived', 'success');
      loadHistory();
    } catch (err) {
      addToast('Critical: Failed to modify ledger record', 'error');
    }
  };

  const handleDuplicate = (invoice) => {
    const { id, createdAt, updatedAt, ...rest } = invoice;
    navigate('/new-invoice', { 
      state: { 
        resumeInvoice: { 
          ...rest, 
          status: 'draft', 
          invoiceNumber: `${rest.invoiceNumber}-COPY` 
        } 
      } 
    });
  };

  const filteredInvoices = invoices.filter(inv => {
    const matchesFilter = filter === 'all' || inv.status.toLowerCase() === filter;
    const matchesSearch = 
      inv.invoiceNumber?.toLowerCase().includes(search.toLowerCase()) ||
      inv.clientName?.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusVariant = (status) => {
    const s = status.toLowerCase();
    if (s === 'paid') return 'success';
    if (s === 'partial') return 'info';
    if (s === 'overdue') return 'error';
    return 'warning';
  };

  return (
    <>
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-10 pb-20"
    >
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Invoice Archive</h1>
          <p className="text-sm font-medium text-slate-500">History of finalized revenue documents and settled accounts.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <SearchInput 
            value={search} 
            onChange={setSearch} 
            placeholder="Search by ID or Client..." 
            className="w-full sm:w-64"
          />
          <div className="flex bg-white p-1 rounded-2xl border border-black/5 shadow-sm">
            {['all', 'paid', 'pending', 'overdue'].map(t => (
              <button 
                key={t} 
                onClick={() => setFilter(t)}
                className={`px-5 py-2 text-[10px] font-bold rounded-xl transition-all uppercase tracking-widest ${filter === t ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </header>

      {loading ? (
        <Card><TableSkeleton rows={8} /></Card>
      ) : filteredInvoices.length === 0 ? (
        <Card noPadding>
          <div className="py-20">
            <EmptyState 
              icon={(props) => <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
              title="Archive matches empty"
              description="Try adjusting your filters or search terms to find specific documents."
            />
          </div>
        </Card>
      ) : (
        <Card noPadding>
          <Table headers={['Document', 'Recipient', 'Timeline', 'Value', 'Actions']}>
            {filteredInvoices.map((inv) => (
              <TableRow key={inv.id}>
                <TableCell>
                  <p className="text-[13px] font-bold text-slate-900 group-hover:text-v-accent transition-colors">#{inv.invoiceNumber}</p>
                  <Badge variant={getStatusVariant(inv.status)} className="mt-1.5">
                    {inv.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <p className="text-sm font-bold text-slate-700">{inv.clientName || 'Private Client'}</p>
                  <p className="text-[11px] font-medium text-slate-400 mt-0.5 truncate max-w-[150px]">{inv.clientAddress}</p>
                </TableCell>
                <TableCell>
                  <p className="text-[12px] font-bold text-slate-600">{new Date(inv.dateIssued || inv.createdAt).toLocaleDateString()}</p>
                  <p className="text-[10px] font-medium text-slate-400 mt-0.5 uppercase tracking-widest">Finalized</p>
                </TableCell>
                <TableCell>
                  <p className="text-sm font-bold text-slate-900">₹{(inv.total || 0).toLocaleString()}</p>
                  <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-tight">Paid: ₹{(inv.paidAmount || 0).toLocaleString()}</p>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => handleDuplicate(inv)}
                      className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-v-accent hover:bg-v-accent/5 rounded-xl transition-all"
                      title="Re-issue Document"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 5.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" /></svg>
                    </button>
                    <button 
                      className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all"
                      title="Download PDF"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    </button>
                    <button 
                      onClick={() => handleDelete(inv)}
                      className="w-10 h-10 flex items-center justify-center text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                      title="Archive Record"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </Table>
        </Card>
      )}
    </motion.div>

    <ConfirmDialog
      isOpen={!!confirmDelete}
      onClose={() => setConfirmDelete(null)}
      onConfirm={confirmDeleteInvoice}
      title="Delete Invoice"
      message={`Invoice #${confirmDelete?.invoiceNumber} will be permanently removed from your ledger. This cannot be undone.`}
      confirmText="Yes, Delete Record"
      variant="danger"
    />
  </>
  );
}
