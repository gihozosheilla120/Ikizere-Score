export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:5000';

export const API_TIMEOUT_MS = 30_000;

export const STORAGE_KEYS = {
  ACCESS_TOKEN: '@ikizere/access_token',
  REFRESH_TOKEN: '@ikizere/refresh_token',
  USER: '@ikizere/user',
  ONBOARDING_COMPLETED: '@ikizere/onboarding_completed',
  LANGUAGE: '@ikizere/language',
} as const;

export const QUERY_STALE_TIME = {
  short: 30_000,
  medium: 5 * 60_000,
  long: 15 * 60_000,
} as const;
