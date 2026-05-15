import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  fetchInvoices, 
  saveInvoiceRecord, 
  lockInvoice, 
  recordInvoicePayment, 
  trackCommunication, 
  removeInvoiceRecord 
} from '../api';
import { useToast } from '../context/ToastContext';

export const useInvoices = () => {
  return useQuery({
    queryKey: ['invoices'],
    queryFn: fetchInvoices,
  });
};

export const useSaveInvoice = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: saveInvoiceRecord,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      addToast('Invoice saved successfully', 'success');
    },
    onError: (error) => {
      addToast(error.message, 'error');
    },
  });
};

export const useFinalizeInvoice = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: lockInvoice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      addToast('Invoice finalized', 'success');
    },
    onError: (error) => {
      addToast(error.message, 'error');
    },
  });
};

export const useUpdatePayment = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }) => recordInvoicePayment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      addToast('Payment updated', 'success');
    },
    onError: (error) => {
      addToast(error.message, 'error');
    },
  });
};

export const useDeleteInvoice = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: removeInvoiceRecord,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      addToast('Invoice deleted', 'success');
    },
    onError: (error) => {
      addToast(error.message, 'error');
    },
  });
};
