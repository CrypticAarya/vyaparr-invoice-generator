import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import html2pdf from 'html2pdf.js';
import { saveInvoiceRecord, fetchInvoices, lockInvoice } from '../api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

// Custom Hooks for State Isolation
import { useInvoiceState } from '../hooks/useInvoiceState';
import { useAiGenerator } from '../hooks/useAiGenerator';

// View Components
import HistorySidebar from '../components/HistorySidebar';
const InvoiceForm = lazy(() => import('../components/InvoiceForm'));
const InvoicePreview = lazy(() => import('../components/InvoicePreview'));
const CollectionModal = lazy(() => import('../components/CollectionModal'));

function Dashboard() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const location = useLocation();
  
  const { 
    invoiceDetails, setInvoiceDetails, 
    updateField, updateLineItem, addLineItem, removeLineItem, 
    loadHistoricalInvoice, calculations 
  } = useInvoiceState(user);

  useEffect(() => {
    if (location.state?.client) {
      const { client } = location.state;
      updateField('clientName', client.name);
      updateField('clientEmail', client.email || '');
      updateField('clientAddress', client.address || '');
      updateField('clientId', client.id);
      addToast(`Pre-filled for ${client.name}`, 'info');
    }
    if (location.state?.resumeInvoice) {
      loadHistoricalInvoice(location.state.resumeInvoice);
      addToast('Draft resumed', 'info');
    }
  }, [location.state]);

  const { 
    promptInteraction, setPromptInteraction, 
    isProcessing: isAiGenerating, executeGeneration 
  } = useAiGenerator(setInvoiceDetails, addToast);

  const [showHistory, setShowHistory] = useState(false);
  const [historyRecords, setHistoryRecords] = useState([]);
  const [managingCollectionInvoice, setManagingCollectionInvoice] = useState(null);
  
  const [isSaving, setIsSaving] = useState(false);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  
  const invoicePreviewRef = useRef(null);

  useEffect(() => {
    if (showHistory) {
      fetchInvoices()
        .then(setHistoryRecords)
        .catch(err => console.error("Failed to fetch history:", err));
    }
  }, [showHistory]);

  const handleSaveDraft = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      const result = await saveInvoiceRecord({ ...invoiceDetails, ...calculations });
      if (result.success && result.invoice?.id) {
        setInvoiceDetails(prev => ({ ...prev, id: result.invoice.id }));
      }
      setSaveSuccess(true);
      addToast('Draft saved successfully', 'success');
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      addToast('Failed to save draft: ' + err.message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportPDF = () => {
    setIsExporting(true);
    const previewElementNode = invoicePreviewRef.current;
    if (!previewElementNode) {
       addToast("Preview error", "error");
       setIsExporting(false);
       return;
    }
    
    const printOptions = {
      margin:       0,
      filename:     `Invoice_${invoiceDetails.invoiceNumber || 'Draft'}.pdf`,
      image:        { type: 'jpeg', quality: 1 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
    };
    
    html2pdf().from(previewElementNode).set(printOptions).save().then(() => {
      setIsExporting(false);
    });
  };

  const handleFinalize = async () => {
    if (!invoiceDetails.id) {
      addToast('Please save draft first', 'warning');
      return;
    }
    try {
      setIsFinalizing(true);
      const result = await lockInvoice(invoiceDetails.id);
      if (result.success) {
        setInvoiceDetails(prev => ({ ...prev, status: 'final' }));
        addToast('Invoice finalized', 'success');
      }
    } catch (err) {
      addToast('Finalization failed: ' + err.message, 'error');
    } finally {
      setIsFinalizing(false);
    }
  };

  const processHistoricalLoad = (doc) => {
    loadHistoricalInvoice(doc);
    setShowHistory(false);
    addToast('Invoice loaded', 'info');
  };

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      
      <AnimatePresence>
        {showHistory && (
          <HistorySidebar 
            history={historyRecords} 
            onClose={() => setShowHistory(false)} 
            onSelect={processHistoricalLoad} 
            onManage={(inv) => { setManagingCollectionInvoice(inv); setShowHistory(false); }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {managingCollectionInvoice && (
          <CollectionModal 
            invoice={managingCollectionInvoice} 
            onClose={() => setManagingCollectionInvoice(null)} 
            onUpdate={async () => {
              const updated = await fetchInvoices();
              setHistoryRecords(updated.invoices || []);
            }}
          />
        )}
      </AnimatePresence>

      {/* Header Toolbar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 premium-card p-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Invoice Editor</h1>
          <p className="text-[13px] font-medium text-slate-500 mt-1">Draft your professional GST invoice</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          {saveSuccess && (
            <span className="text-[11px] font-bold uppercase text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/10 flex items-center gap-2">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
              Saved
            </span>
          )}
          <Button variant="secondary" size="sm" onClick={() => setShowHistory(true)}>
            History
          </Button>
          <Button variant="secondary" size="sm" onClick={handleSaveDraft} isLoading={isSaving}>
            Save Draft
          </Button>
          <Button variant="secondary" size="sm" onClick={handleExportPDF} isLoading={isExporting}>
            Export PDF
          </Button>
          {invoiceDetails.status !== 'final' && (
            <Button variant="primary" size="sm" onClick={handleFinalize} isLoading={isFinalizing}>
              Finalize & Issue
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Editor Form */}
        <div className="w-full lg:w-[55%]">
          <InvoiceForm 
            data={invoiceDetails}
            updateField={updateField}
            updateItem={updateLineItem}
            addItem={addLineItem}
            removeItem={removeLineItem}
            aiPrompt={promptInteraction}
            setAiPrompt={setPromptInteraction}
            isGenerating={isAiGenerating}
            handleAiGenerate={executeGeneration}
          />
        </div>

        {/* Live Preview */}
        <div className="w-full lg:w-[45%] lg:sticky lg:top-24 self-start">
          <InvoicePreview 
            ref={invoicePreviewRef}
            data={invoiceDetails}
            calculations={calculations}
          />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
