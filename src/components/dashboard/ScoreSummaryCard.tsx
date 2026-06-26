import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '../../theme';
import { Text, Card, Button, Badge } from '../ui';
import { ScoreGauge } from './ScoreGauge';
import { getScoreTier, getRatingBadgeVariant, SCORE_TIER_META } from '../../utils/scoreTier';
import { formatRatingLabel } from '../../utils/formatters';
import type { ScoreSummary } from '../../types/models';

interface ScoreSummaryCardProps {
  summary: ScoreSummary;
  onViewInsights: () => void;
}

export function ScoreSummaryCard({ summary, onViewInsights }: ScoreSummaryCardProps) {
  const tier = getScoreTier(summary.rating);
  const changePrefix = summary.monthlyChange >= 0 ? '+' : '';
  const changeText = `${changePrefix}${summary.monthlyChange} points`;

  return (
    <Card style={styles.card}>
      <ScoreGauge
        score={summary.currentScore}
        tier={tier}
        ratingLabel={formatRatingLabel(summary.rating)}
      />

      <Text variant="h3" align="center" style={styles.title}>
        Your Ikizere Score
      </Text>

      <Text variant="bodySmall" color={colors.textSecondary} align="center" style={styles.desc}>
        Your score {summary.monthlyChange >= 0 ? 'increased' : 'changed'} by{' '}
        <Text variant="bodySmall" color={colors.text}>
          {changeText}
        </Text>{' '}
        this month. {summary.changeReason || 'Keep maintaining your timely payments to reach the top tier.'}
      </Text>

      <View style={styles.tierRow}>
        <Badge label={formatRatingLabel(summary.rating)} variant={getRatingBadgeVariant(summary.rating)} />
        <ScoreTierBadgeInline tier={tier} />
      </View>

      <Button title="View Score Insights" onPress={onViewInsights} fullWidth style={styles.cta} />
    </Card>
  );
}

function ScoreTierBadgeInline({ tier }: { tier: ReturnType<typeof getScoreTier> }) {
  const meta = SCORE_TIER_META[tier];
  return (
    <View style={[styles.tierBadge, { backgroundColor: meta.background }]}>
      <Ionicons name={meta.icon} size={14} color={meta.color} />
      <Text variant="caption" color={meta.color} style={styles.tierLabel}>
        {meta.label} Tier
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: spacing.lg },
  title: { marginBottom: spacing.sm },
  desc: { marginBottom: spacing.md, paddingHorizontal: spacing.sm },
  tierRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  tierBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  tierLabel: { fontWeight: '700' },
  cta: { marginTop: spacing.xs },
});
