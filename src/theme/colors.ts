/**
 * Ikizere Score design tokens — aligned with FRONTEND_SCREEN_ANALYSIS.md
 * White cards, blue primary, green positive, red expenses/pending
 */

export const colors = {
  primary: '#1E3A8A',
  primaryDark: '#172554',
  primaryLight: '#3B82F6',
  primaryMuted: '#DBEAFE',

  secondary: '#EFF6FF',
  secondaryDark: '#BFDBFE',

  background: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceMuted: '#F1F5F9',

  text: '#0F172A',
  textSecondary: '#64748B',
  textMuted: '#94A3B8',
  textInverse: '#FFFFFF',

  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  divider: '#E2E8F0',

  success: '#16A34A',
  successLight: '#DCFCE7',
  successDark: '#15803D',

  warning: '#D97706',
  warningLight: '#FEF3C7',

  error: '#DC2626',
  errorLight: '#FEE2E2',

  info: '#2563EB',
  infoLight: '#DBEAFE',

  income: '#16A34A',
  expense: '#DC2626',
  savings: '#2563EB',

  overlay: 'rgba(15, 23, 42, 0.5)',
  transparent: 'transparent',

  tabBar: '#FFFFFF',
  tabBarBorder: '#E2E8F0',
  tabBarActive: '#1E3A8A',
  tabBarInactive: '#94A3B8',
} as const;

export type ColorToken = keyof typeof colors;
