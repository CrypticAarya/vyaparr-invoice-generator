import { useQuery } from '@tanstack/react-query';
import { fetchApi } from '../api';

export const useAnalytics = (range = '1Y') => {
  return useQuery({
    queryKey: ['analytics', range],
    queryFn: () => fetchApi(`/analytics?range=${range}`).then(res => res.data),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};
