import type { BusinessType } from '@/types/models';

export const BUSINESS_TYPE_OPTIONS: { label: string; value: BusinessType }[] = [
  { label: 'Retail', value: 'retail' },
  { label: 'Wholesale', value: 'wholesale' },
  { label: 'Services', value: 'services' },
  { label: 'Agriculture', value: 'agriculture' },
  { label: 'Manufacturing', value: 'manufacturing' },
  { label: 'Technology', value: 'technology' },
  { label: 'Hospitality', value: 'hospitality' },
  { label: 'Other', value: 'other' },
];

export const ONBOARDING_SLIDES = [
  {
    id: 'track',
    title: 'Track Your Financial Activity',
    description: 'Record income, expenses and savings in one secure place.',
    icon: 'stats-chart' as const,
    iconColor: '#3B82F6',
  },
  {
    id: 'score',
    title: 'Build Your Ikizere Score',
    description: 'Improve your financial trust profile through responsible habits.',
    icon: 'trending-up' as const,
    iconColor: '#D97706',
  },
  {
    id: 'loans',
    title: 'Access Better Opportunities',
    description: 'Unlock access to loans and financial services.',
    icon: 'ribbon' as const,
    iconColor: '#16A34A',
  },
] as const;
