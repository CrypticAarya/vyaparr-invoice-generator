import { useQuery } from '@tanstack/react-query';
import { fetchBusinessAnalytics } from '../api';

export const useAnalytics = (range = '1Y') => {
  return useQuery({
    queryKey: ['analytics', range],
    queryFn: () => fetchBusinessAnalytics(range),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};
