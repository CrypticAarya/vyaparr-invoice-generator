import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import html2pdf from 'html2pdf.js';
import { saveInvoice, getInvoices, finalizeInvoice } from '../api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

// Custom Hooks for State Isolation
import { useInvoiceState } from '../hooks/useInvoiceState';
import { useAiGenerator } from '../hooks/useAiGenerator';

// View Components

import HistorySidebar from '../components/HistorySidebar';
import InvoiceForm from '../components/InvoiceForm';
import InvoicePreview from '../components/InvoicePreview';
import CollectionModal from '../components/CollectionModal';

// Abstracted template configurations mapped by business sector
const SECTOR_TEMPLATES = {
  freelancer: {
    taxRate: 0,
    notes: 'Payment is due upon receipt. Bank details: XYZ-123456.',
  },
  agency: {
    taxRate: 8.5,
    notes: 'Net 30. Wire transfer preferred. 1.5% late fee applies post 30 days.',
  },
  fitness: {
    taxRate: 5,
    notes: 'Annual dues. Next auto-withdrawal scheduled for Q4.',
  }
};

/**
 * Dashboard Component
 * 
 * Serves as the primary controller view for the authenticated user space.
 * Following SOLID principles, this file now delegates business logic and heavy
 * state transformations to dedicated hooks (`useInvoiceState`, `useAiGenerator`).
 */
function Dashboard() {
  // Global Providers
  const { user, logout } = useAuth();
  const { addToast } = useToast();
  const location = useLocation();
  
  // Custom Hook Injections
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
      updateField('clientId', client._id);
      addToast(`Pre-filled for ${client.name}`, 'info');
    }
    if (location.state?.resumeInvoice) {
      loadHistoricalInvoice(location.state.resumeInvoice);
      addToast('Draft resumed successfully', 'info');
    }
  }, [location.state]);

  const { 
    promptInteraction, setPromptInteraction, 
    isProcessing: isAiGenerating, executeGeneration 
  } = useAiGenerator(setInvoiceDetails, addToast);

  // Local UI States
  const [activeTheme, setActiveTheme] = useState('freelancer');
  const [showHistory, setShowHistory] = useState(false);
  const [historyRecords, setHistoryRecords] = useState([]);
  const [managingCollectionInvoice, setManagingCollectionInvoice] = useState(null);
  
  // Network Lifecycle States
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  
  // DOM References
  const invoicePreviewRef = useRef(null);

  /**
   * Lifecycle logic to lazily fetch historical invoices only when the sidebar acts upon it.
   */
  useEffect(() => {
    if (showHistory) {
      getInvoices()
        .then(setHistoryRecords)
        .catch(err => console.error("Failed to fetch historical documents:", err));
    }
  }, [showHistory]);


  /**
   * View-level interaction allowing users to swap their baseline sector templates on the fly.
   */
  const applySectorTemplate = (templateMode) => {
    setActiveTheme(templateMode);
    
    const targetConfig = SECTOR_TEMPLATES[templateMode];
    if (targetConfig) {
      setInvoiceDetails(prev => ({
        ...prev,
        taxRate: targetConfig.taxRate,
        notes: targetConfig.notes
      }));
    }
  };

  /**
   * Asynchronous dispatch to push the local draft state to the persistent database.
   */
  const handleSaveDraft = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    
    try {
      const result = await saveInvoice({ ...invoiceDetails, ...calculations });
      if (result.success && result.invoice?._id) {
        setInvoiceDetails(prev => ({ ...prev, _id: result.invoice._id }));
      }
      setSaveSuccess(true);
      addToast('Invoice pushed securely to core storage.', 'success');
      
      // Cleanup the visual indicator
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (networkError) {
      addToast('Failed to persist draft: ' + networkError.message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Invokes the client-side `html2pdf.js` library to extract the DOM node Ref 
   * and transpile it into a downloadable PDF format.
   */
  const handleExportPDF = () => {
    setIsExporting(true);
    
    const previewElementNode = invoicePreviewRef.current;
    if (!previewElementNode) {
       addToast("Critical: Rendering preview node disconnected.", "error");
       setIsExporting(false);
       return;
    }
    
    const printOptions = {
      margin:       0,
      filename:     `${invoiceDetails.invoiceNumber || 'vyaparflow_export'}.pdf`,
      image:        { type: 'jpeg', quality: 1 },
      html2canvas:  { scale: 3, useCORS: true },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    
    html2pdf().from(previewElementNode).set(printOptions).save().then(() => {
      setIsExporting(false);
    });
  };

  /**
   * Finalizes the current invoice document.
   * Transforms it from a 'draft' to a 'final' record in the intelligence layer.
   */
  const handleFinalize = async () => {
    if (!invoiceDetails._id) {
      addToast('Please save as draft before finalizing.', 'warning');
      return;
    }

    try {
      setIsSaving(true);
      const result = await finalizeInvoice(invoiceDetails._id);
      if (result.success) {
        setInvoiceDetails(prev => ({ ...prev, status: 'final' }));
        addToast('Invoice finalized and issued!', 'success');
      }
    } catch (err) {
      addToast('Failed to finalize: ' + err.message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleManageCollection = (invoice) => {
    setManagingCollectionInvoice(invoice);
    setShowHistory(false);
  };

  const refreshHistory = async () => {
    const updated = await getInvoices();
    setHistoryRecords(updated.invoices || []);
  };

  /**
   * Mark as Paid: Syncs with Client (AR) and updates local state.
   */
  // Removed in favor of CollectionModal

  /**
   * View-level delegate to fetch a document from the sidebar list, push it to state,
   * and subsequently close the sidebar modal.
   */
  const processHistoricalLoad = (pastInvoiceDocument) => {
    loadHistoricalInvoice(pastInvoiceDocument);
    setShowHistory(false);
    addToast('Historical invoice loaded from storage.', 'info');
  };

  return (
    <div className="page-container relative z-10 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <AnimatePresence>
        {showHistory && (
          <HistorySidebar 
            history={historyRecords} 
            onClose={() => setShowHistory(false)} 
            onSelect={processHistoricalLoad} 
            onManage={handleManageCollection}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {managingCollectionInvoice && (
          <CollectionModal 
            invoice={managingCollectionInvoice} 
            onClose={() => setManagingCollectionInvoice(null)} 
            onUpdate={refreshHistory}
          />
        )}
      </AnimatePresence>

      {/* GLOBAL TOP ACTION BAR */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight uppercase">New Invoice</h1>
          <p className="text-xs sm:text-sm text-slate-500 font-bold mt-1 tracking-wide">Professional Billing Workstation</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          {saveSuccess && (
            <motion.span initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-[10px] font-black uppercase tracking-widest text-emerald-600 flex items-center gap-1.5 bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-100">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
              Draft Saved
            </motion.span>
          )}
          <button 
            onClick={() => setShowHistory(true)} 
            className="px-4 py-2.5 text-[11px] font-black text-slate-600 bg-slate-50 border border-slate-200 hover:bg-slate-100 rounded-xl transition-all uppercase tracking-widest flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            History
          </button>
          <button
            onClick={handleSaveDraft}
            disabled={isSaving}
            className="px-5 py-2.5 rounded-xl text-[11px] font-black text-slate-700 bg-white border border-slate-200 hover:bg-hf-50 transition-all shadow-sm uppercase tracking-widest disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save Draft'}
          </button>
          <button
            onClick={handleExportPDF}
            disabled={isExporting}
            className="px-6 py-2.5 rounded-xl text-[11px] font-black text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-70 flex items-center gap-2 uppercase tracking-widest"
          >
            {isExporting ? 'Generating...' : 'Export PDF'}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </button>
          {invoiceDetails.status !== 'final' && (
            <button
              onClick={handleFinalize}
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl text-[11px] font-black text-white bg-emerald-600 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 disabled:opacity-70 flex items-center gap-2 uppercase tracking-widest"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Finalize & Issue
            </button>
          )}
        </div>
      </div>

      {/* FULL WIDTH SPLIT WORKSPACE */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        
        {/* LEFT: STRUCTURED BILLING COMMAND PANELS (55%) */}
        <div className="w-full lg:w-[55%] flex flex-col gap-6">
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
            activeTheme={activeTheme}
            applyTemplate={applySectorTemplate}
          />
        </div>

        {/* RIGHT: LARGE STICKY LIVE GST INVOICE PREVIEW (45%) */}
        <div className="w-full lg:w-[45%] lg:sticky lg:top-6">
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
