import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../api';
import { useToast } from '../context/ToastContext';

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      addToast('Product created successfully', 'success');
    },
    onError: (error) => {
      addToast(error.message, 'error');
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }) => updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      addToast('Product updated successfully', 'success');
    },
    onError: (error) => {
      addToast(error.message, 'error');
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      addToast('Product deleted successfully', 'success');
    },
    onError: (error) => {
      addToast(error.message, 'error');
    },
  });
};
