import { useCallback } from 'react';
import { useQueries } from '@tanstack/react-query';
import { queryKeys } from './queryKeys';
import { recordsService, scoreService } from '../services';
import { ApiError } from '@/types/api';

function getCurrentMonthParams() {
  const now = new Date();
  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    currency: 'RWF' as const,
  };
}

export function useDashboardData() {
  const insightsParams = getCurrentMonthParams();

  const [summaryQuery, breakdownQuery, insightsQuery, recentQuery] = useQueries({
    queries: [
      {
        queryKey: queryKeys.score.summary,
        queryFn: () => scoreService.getSummary(),
        retry: (failureCount: number, error: unknown) => {
          if (error instanceof ApiError && error.statusCode === 404) return false;
          return failureCount < 2;
        },
      },
      {
        queryKey: queryKeys.score.breakdown,
        queryFn: () => scoreService.getBreakdown(),
        retry: (failureCount: number, error: unknown) => {
          if (error instanceof ApiError && error.statusCode === 404) return false;
          return failureCount < 2;
        },
      },
      {
        queryKey: queryKeys.records.monthlyInsights(insightsParams),
        queryFn: () => recordsService.getMonthlyInsights(insightsParams),
      },
      {
        queryKey: queryKeys.records.list({ limit: 3, sortBy: 'transactionDate', sortOrder: 'desc' }),
        queryFn: () =>
          recordsService.list({ limit: 3, page: 1, sortBy: 'transactionDate', sortOrder: 'desc' }),
      },
    ],
  });

  const refetchAll = useCallback(async () => {
    await Promise.all([
      summaryQuery.refetch(),
      breakdownQuery.refetch(),
      insightsQuery.refetch(),
      recentQuery.refetch(),
    ]);
  }, [summaryQuery, breakdownQuery, insightsQuery, recentQuery]);

  const isLoading =
    summaryQuery.isLoading || breakdownQuery.isLoading || insightsQuery.isLoading;

  const isRefetching =
    summaryQuery.isRefetching ||
    breakdownQuery.isRefetching ||
    insightsQuery.isRefetching ||
    recentQuery.isRefetching;

  const hasHardError =
    (summaryQuery.isError &&
      !(summaryQuery.error instanceof ApiError && summaryQuery.error.statusCode === 404)) ||
    insightsQuery.isError;

  const scoreNotFound =
    summaryQuery.isError &&
    summaryQuery.error instanceof ApiError &&
    summaryQuery.error.statusCode === 404;

  return {
    summary: summaryQuery.data,
    breakdown: breakdownQuery.data,
    insights: insightsQuery.data,
    recentRecords: recentQuery.data?.records ?? [],
    isLoading,
    isRefetching,
    hasHardError,
    scoreNotFound,
    summaryError: summaryQuery.error,
    insightsError: insightsQuery.error,
    refetchAll,
  };
}
