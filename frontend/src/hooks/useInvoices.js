import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getInvoices, 
  saveInvoice, 
  finalizeInvoice, 
  updatePayment, 
  logCommunication, 
  deleteInvoice 
} from '../api';
import { useToast } from '../context/ToastContext';

export const useInvoices = () => {
  return useQuery({
    queryKey: ['invoices'],
    queryFn: getInvoices,
  });
};

export const useSaveInvoice = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: saveInvoice,
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
    mutationFn: finalizeInvoice,
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
    mutationFn: ({ id, data }) => updatePayment(id, data),
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
    mutationFn: deleteInvoice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      addToast('Invoice deleted', 'success');
    },
    onError: (error) => {
      addToast(error.message, 'error');
    },
  });
};
