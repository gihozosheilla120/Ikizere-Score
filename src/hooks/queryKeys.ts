export const queryKeys = {
  auth: {
    session: ['auth', 'session'] as const,
  },
  records: {
    all: ['records'] as const,
    list: (filters?: Record<string, unknown>) => ['records', 'list', filters] as const,
    detail: (id: string) => ['records', 'detail', id] as const,
    categories: (type?: string) => ['records', 'categories', type] as const,
    monthlyInsights: (params: Record<string, unknown>) =>
      ['records', 'monthlyInsights', params] as const,
  },
  score: {
    summary: ['score', 'summary'] as const,
    breakdown: ['score', 'breakdown'] as const,
    history: (params?: Record<string, unknown>) => ['score', 'history', params] as const,
  },
  loans: {
    marketplace: (params?: Record<string, unknown>) =>
      ['loans', 'marketplace', params] as const,
    product: (id: string, params?: Record<string, unknown>) =>
      ['loans', 'product', id, params] as const,
    eligible: (params?: Record<string, unknown>) =>
      ['loans', 'eligible', params] as const,
    applications: (params?: Record<string, unknown>) =>
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
