import { QueryClient } from '@tanstack/react-query';
import { QUERY_STALE_TIME } from '../constants/config';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: QUERY_STALE_TIME.medium,
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});
