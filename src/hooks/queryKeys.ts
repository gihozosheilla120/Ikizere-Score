import type { LoanMarketplaceFilters, RecordsListFilters } from '@/types/models';

export const queryKeys = {
  auth: {
    session: ['auth', 'session'] as const,
  },
  records: {
    all: ['records'] as const,
    list: (filters?: RecordsListFilters) => ['records', 'list', filters] as const,
    detail: (id: string) => ['records', 'detail', id] as const,
    categories: (type?: string) => ['records', 'categories', type] as const,
    monthlyInsights: (params: { year: number; month: number; currency?: string }) =>
      ['records', 'monthlyInsights', params] as const,
  },
  score: {
    all: ['score'] as const,
    summary: ['score', 'summary'] as const,
    breakdown: ['score', 'breakdown'] as const,
    history: (params?: { page?: number; limit?: number }) =>
      ['score', 'history', params] as const,
  },
  loans: {
    all: ['loans'] as const,
    marketplace: (params?: LoanMarketplaceFilters) =>
      ['loans', 'marketplace', params] as const,
    product: (id: string, params?: LoanMarketplaceFilters) =>
      ['loans', 'product', id, params] as const,
    eligible: (params?: LoanMarketplaceFilters) =>
      ['loans', 'eligible', params] as const,
    applications: (params?: { page?: number; limit?: number; status?: string }) =>
      ['loans', 'applications', params] as const,
    application: (id: string) => ['loans', 'application', id] as const,
    timeline: (id: string) => ['loans', 'timeline', id] as const,
  },
  profile: {
    business: ['profile', 'business'] as const,
  },
  verification: {
    status: ['verification', 'status'] as const,
    details: ['verification', 'details'] as const,
  },
} as const;
