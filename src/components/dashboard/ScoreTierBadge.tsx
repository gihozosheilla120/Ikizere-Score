import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { borderRadius, spacing } from '../../theme';
import { Text } from '../ui';
import { SCORE_TIER_META, type ScoreTier } from '../../utils/scoreTier';

interface ScoreTierBadgeProps {
  tier: ScoreTier;
  compact?: boolean;
}

export function ScoreTierBadge({ tier, compact = false }: ScoreTierBadgeProps) {
  const meta = SCORE_TIER_META[tier];

  return (
    <View style={[styles.badge, { backgroundColor: meta.background }, compact && styles.compact]}>
      <Ionicons name={meta.icon} size={compact ? 12 : 14} color={meta.color} />
      <Text variant="caption" color={meta.color} style={styles.label}>
        {meta.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  compact: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  label: { fontWeight: '700', letterSpacing: 0.3 },
});
