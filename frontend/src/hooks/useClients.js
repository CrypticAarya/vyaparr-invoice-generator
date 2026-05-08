import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getClients, createClient, updateClient, deleteClient } from '../api';
import { useToast } from '../context/ToastContext';

export const useClients = () => {
  return useQuery({
    queryKey: ['clients'],
    queryFn: getClients,
  });
};

export const useCreateClient = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: createClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      addToast('Client created successfully', 'success');
    },
    onError: (error) => {
      addToast(error.message, 'error');
    },
  });
};

export const useUpdateClient = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }) => updateClient(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      addToast('Client updated successfully', 'success');
    },
    onError: (error) => {
      addToast(error.message, 'error');
    },
  });
};

export const useDeleteClient = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: deleteClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      addToast('Client deleted successfully', 'success');
    },
    onError: (error) => {
      addToast(error.message, 'error');
    },
  });
};
