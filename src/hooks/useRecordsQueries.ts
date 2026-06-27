import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
  InfiniteData,
} from '@tanstack/react-query';
import { recordsService } from '../services';
import { queryKeys } from './queryKeys';
import type { PaginationMeta } from '@/types/api';
import type {
  CreateRecordPayload,
  FinancialRecord,
  MonthlyInsights,
  RecordType,
  RecordsListFilters,
  UpdateRecordPayload,
} from '@/types/models';
import { DEFAULT_LIST_LIMIT } from '../constants/records';

type RecordsPage = { records: FinancialRecord[] } & PaginationMeta;

function invalidateScoreAndLoans(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: queryKeys.score.all });
  queryClient.invalidateQueries({ queryKey: queryKeys.loans.all });
  setTimeout(() => {
    queryClient.invalidateQueries({ queryKey: queryKeys.score.all });
    queryClient.invalidateQueries({ queryKey: queryKeys.loans.all });
  }, 1500);
}

export function useRecordsInfiniteQuery(filters: Omit<RecordsListFilters, 'page'>) {
  return useInfiniteQuery({
    queryKey: queryKeys.records.list(filters),
    queryFn: ({ pageParam = 1 }) =>
      recordsService.list({
        ...filters,
        page: pageParam,
        limit: filters.limit ?? DEFAULT_LIST_LIMIT,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
  });
}

export function useRecordQuery(recordId: string) {
  return useQuery({
    queryKey: queryKeys.records.detail(recordId),
    queryFn: () => recordsService.getById(recordId),
    enabled: Boolean(recordId),
  });
}

export function useRecordCategoriesQuery(type?: RecordType) {
  return useQuery({
    queryKey: queryKeys.records.categories(type),
    queryFn: () => recordsService.getCategories(type),
  });
}

export function useMonthlyInsightsQuery(params: {
  year: number;
  month: number;
  currency?: string;
}) {
  return useQuery({
    queryKey: queryKeys.records.monthlyInsights(params),
    queryFn: () => recordsService.getMonthlyInsights(params),
  });
}

function patchRecordsListCache(
  queryClient: ReturnType<typeof useQueryClient>,
  updater: (records: FinancialRecord[]) => FinancialRecord[]
) {
  queryClient.setQueriesData<InfiniteData<RecordsPage>>(
    { queryKey: queryKeys.records.all },
    (old) => {
      if (!old) return old;
      return {
        ...old,
        pages: old.pages.map((page, index) =>
          index === 0 ? { ...page, records: updater(page.records) } : page
        ),
      };
    }
  );
}

export function useCreateRecordMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateRecordPayload) => recordsService.create(payload),
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.records.all });

      const optimisticRecord: FinancialRecord = {
        _id: `temp-${Date.now()}`,
        userId: '',
        type: payload.type,
        category: payload.category,
        amount: payload.amount,
        currency: payload.currency,
        transactionDate: payload.transactionDate,
        description: payload.description,
        source: payload.source ?? 'manual',
        tags: payload.tags ?? [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const previous = queryClient.getQueriesData<InfiniteData<RecordsPage>>({
        queryKey: queryKeys.records.all,
      });

      patchRecordsListCache(queryClient, (records) => [optimisticRecord, ...records]);

      return { previous };
    },
    onError: (_error, _payload, context) => {
      context?.previous.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.records.all });
      queryClient.invalidateQueries({ queryKey: ['records', 'monthlyInsights'] });
      invalidateScoreAndLoans(queryClient);
    },
  });
}

export function useUpdateRecordMutation(recordId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateRecordPayload) => recordsService.update(recordId, payload),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.records.detail(recordId), data);
      queryClient.invalidateQueries({ queryKey: queryKeys.records.all });
      queryClient.invalidateQueries({ queryKey: ['records', 'monthlyInsights'] });
      invalidateScoreAndLoans(queryClient);
    },
  });
}

export function useDeleteRecordMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (recordId: string) => recordsService.remove(recordId),
    onMutate: async (recordId) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.records.all });

      const previous = queryClient.getQueriesData<InfiniteData<RecordsPage>>({
        queryKey: queryKeys.records.all,
      });

      patchRecordsListCache(queryClient, (records) =>
        records.filter((record) => record._id !== recordId)
      );

      queryClient.removeQueries({ queryKey: queryKeys.records.detail(recordId) });

      return { previous, recordId };
    },
    onError: (_error, _recordId, context) => {
      context?.previous.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.records.all });
      queryClient.invalidateQueries({ queryKey: ['records', 'monthlyInsights'] });
      invalidateScoreAndLoans(queryClient);
    },
  });
}

export type { MonthlyInsights };
