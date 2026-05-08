import { useQuery } from '@tanstack/react-query';
import { getAnalytics } from '../api';

export const useAnalytics = (range = '1Y') => {
  return useQuery({
    queryKey: ['analytics', range],
    queryFn: () => getAnalytics(range),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};
