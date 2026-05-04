import { useState, useCallback } from 'react';
import { generateAiItems } from '../api';

/**
 * Custom React Hook: useAiGenerator
 * 
 * Encapsulates the side effects, loading constraints, and error boundaries associated
 * with calling the external AI processing service. Keeps Dashboard.jsx completely clean
 * of asynchronous networking cruft.
 * 
 * @param {Function} setInvoiceDetails - Reference to the parent state updater
 * @param {Function} addToast - Global notification dispatcher
 */
export const useAiGenerator = (setInvoiceDetails, addToast) => {
  const [promptInteraction, setPromptInteraction] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  /**
   * Dispatches the prompt to the backend, handles loading states, 
   * and gracefully integrates the structured JSON response back into the active invoice.
   */
  const executeGeneration = useCallback(async (e) => {
    // Prevent default form submission behaviors
    if (e) e.preventDefault();
    
    // Guard clauses against empty prompts or double-spamming the API
    if (!promptInteraction.trim() || isProcessing) return;
    
    setIsProcessing(true);
    
    try {
      const responsePayload = await generateAiItems(promptInteraction);
      
      // Merge the AI's intelligent suggestions into the master invoice record
      setInvoiceDetails(prev => ({
        ...prev,
        items: responsePayload.items?.length > 0 ? responsePayload.items : prev.items,
        notes: responsePayload.notes || prev.notes,
        taxRate: responsePayload.suggestedTax !== undefined ? responsePayload.suggestedTax : prev.taxRate
      }));
      
      // Reset the local prompt barrier after success
      setPromptInteraction('');
      addToast('Magic invoice generated successfully!', 'success');
      
    } catch (networkError) {
      console.error('[AI Generation Error]', networkError);
      addToast(networkError.message || 'Failed to establish connection to AI core.', 'error');
    } finally {
      setIsProcessing(false);
    }
  }, [promptInteraction, isProcessing, setInvoiceDetails, addToast]);

  return {
    promptInteraction,
    setPromptInteraction,
    isProcessing,
    executeGeneration
  };
};
