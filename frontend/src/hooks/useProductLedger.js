import { useQuery } from '@tanstack/react-query';
import { fetchApi } from '../api';

export const useProductLedger = (productId) => {
  return useQuery({
    queryKey: ['product-ledger', productId],
    queryFn: () => fetchApi(`/products/${productId}/ledger`).then(res => res.data.transactions),
    enabled: !!productId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
