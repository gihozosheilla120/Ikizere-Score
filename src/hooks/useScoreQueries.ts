import { useQuery } from '@tanstack/react-query';
import { scoreService } from '../services';
import { queryKeys } from './queryKeys';
import { ApiError } from '@/types/api';

export function useScoreSummaryQuery() {
  return useQuery({
    queryKey: queryKeys.score.summary,
    queryFn: () => scoreService.getSummary(),
    retry: (failureCount, error) => {
      if (error instanceof ApiError && error.statusCode === 404) return false;
      return failureCount < 2;
    },
  });
}

export function useScoreBreakdownQuery() {
  return useQuery({
    queryKey: queryKeys.score.breakdown,
    queryFn: () => scoreService.getBreakdown(),
    retry: (failureCount, error) => {
      if (error instanceof ApiError && error.statusCode === 404) return false;
      return failureCount < 2;
    },
  });
}
