export const API_ENDPOINTS = {
  health: '/health',

  auth: {
    register: '/auth/register',
    login: '/auth/login',
    logout: '/auth/logout',
    refreshToken: '/auth/refresh-token',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
  },

  users: {
    businessProfile: '/users/me/business-profile',
  },

  verification: {
    upload: '/verification/upload',
    submit: '/verification/submit',
    status: '/verification/status',
    details: '/verification/details',
  },

  records: {
    list: '/records',
    categories: '/records/categories',
    monthlyInsights: '/records/insights/monthly',
    byId: (id: string) => `/records/${id}`,
  },

  score: {
    summary: '/score/summary',
    breakdown: '/score/breakdown',
    history: '/score/history',
  },

  loans: {
    marketplace: '/loans/marketplace',
    marketplaceById: (id: string) => `/loans/marketplace/${id}`,
    eligibleProducts: '/loans/eligible-products',
    applications: '/loans/applications',
    applicationById: (id: string) => `/loans/applications/${id}`,
    applicationTimeline: (id: string) => `/loans/applications/${id}/timeline`,
    cancelApplication: (id: string) => `/loans/applications/${id}/cancel`,
  },
} as const;
