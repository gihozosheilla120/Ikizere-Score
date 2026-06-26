import { colors } from '../theme';
import type { LoanReadinessRating, ScoreRating } from '../types/models';

export type ScoreTier = 'gold' | 'silver' | 'bronze';

export const SCORE_TIER_META: Record<
  ScoreTier,
  { label: string; color: string; background: string; icon: 'medal' | 'ribbon' | 'star' }
> = {
  gold: { label: 'Gold', color: '#B45309', background: '#FEF3C7', icon: 'medal' },
  silver: { label: 'Silver', color: '#475569', background: '#F1F5F9', icon: 'ribbon' },
  bronze: { label: 'Bronze', color: '#9A3412', background: '#FFEDD5', icon: 'star' },
};

export function getScoreTier(rating: ScoreRating): ScoreTier {
  switch (rating) {
    case 'excellent':
      return 'gold';
    case 'good':
      return 'silver';
    case 'fair':
    case 'poor':
    default:
      return 'bronze';
  }
}

export function getGaugeColors(tier: ScoreTier): [string, string] {
  switch (tier) {
    case 'gold':
      return ['#16A34A', '#15803D'];
    case 'silver':
      return ['#2563EB', '#1E3A8A'];
    case 'bronze':
      return ['#D97706', '#B45309'];
  }
}

export function getReadinessQuote(rating: LoanReadinessRating): string {
  switch (rating) {
    case 'highly_eligible':
      return 'You are eligible for most business loans with preferred interest rates.';
    case 'eligible':
      return 'You qualify for several loan products. Compare offers to find the best fit.';
    case 'needs_improvement':
      return 'Improve your savings and payment consistency to unlock better loan options.';
    case 'not_eligible':
    default:
      return 'Keep tracking records and building your score to become loan-ready.';
  }
}

export function getRatingBadgeVariant(
  rating: ScoreRating
): 'success' | 'info' | 'warning' | 'error' {
  switch (rating) {
    case 'excellent':
      return 'success';
    case 'good':
      return 'info';
    case 'fair':
      return 'warning';
    case 'poor':
    default:
      return 'error';
  }
}

export const FACTOR_RECOMMENDATIONS: Record<string, { title: string; description: string }> = {
  savingsBehaviour: {
    title: 'Increase savings consistency',
    description: 'Setting up an auto-save rule could boost your score by 15 points.',
  },
  incomeStability: {
    title: 'Stabilize income streams',
    description: 'Record regular income to demonstrate predictable cash flow.',
  },
  paymentConsistency: {
    title: 'Maintain timely payments',
    description: 'Avoid late payments to keep your consistency score high.',
  },
  businessActivity: {
    title: 'Track business activity',
    description: 'Add more transactions to show active business operations.',
  },
  creditHistory: {
    title: 'Diversify credit mix',
    description: 'Consider a small micro-loan to demonstrate varied repayment ability.',
  },
};

export function getLowestFactorRecommendations(
  factors: Array<{ factor: string; score: number }>,
  limit = 2
) {
  return [...factors]
    .sort((a, b) => a.score - b.score)
    .slice(0, limit)
    .map((item) => ({
      factor: item.factor,
      score: item.score,
      ...(FACTOR_RECOMMENDATIONS[item.factor] ?? {
        title: 'Improve your financial habits',
        description: 'Focus on this area to raise your Ikizere Score.',
      }),
    }));
}
