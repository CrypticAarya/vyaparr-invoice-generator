import { useQuery } from '@tanstack/react-query';
import { fetchApi } from '../api';

export const useAiInsights = () => {
  return useQuery({
    queryKey: ['ai-insights'],
    queryFn: () => fetchApi('/generate/insights').then(res => res.data.insights),
    staleTime: 1000 * 60 * 15, // 15 minutes
    retry: 1,
  });
};
