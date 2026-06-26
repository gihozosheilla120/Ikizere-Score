import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing } from '../../theme';
import { Text } from '../ui';
import { ScoreTierBadge } from './ScoreTierBadge';
import type { ScoreTier } from '../../utils/scoreTier';
import { getGaugeColors } from '../../utils/scoreTier';

interface ScoreGaugeProps {
  score: number;
  tier: ScoreTier;
  ratingLabel: string;
}

const GAUGE_SIZE = 168;
const RING_WIDTH = 14;

export function ScoreGauge({ score, tier, ratingLabel }: ScoreGaugeProps) {
  const gradientColors = getGaugeColors(tier);
  const innerSize = GAUGE_SIZE - RING_WIDTH * 2;

  return (
    <View style={styles.wrap}>
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.ring, { width: GAUGE_SIZE, height: GAUGE_SIZE, borderRadius: GAUGE_SIZE / 2 }]}
      >
        <View
          style={[
            styles.inner,
            {
              width: innerSize,
              height: innerSize,
              borderRadius: innerSize / 2,
            },
          ]}
        >
          <Text variant="h1" color={colors.primary} style={styles.score}>
            {score}
          </Text>
          <View style={styles.badgeWrap}>
            <ScoreTierBadge tier={tier} compact />
          </View>
          <Text variant="caption" color={colors.successDark} style={styles.rating}>
            {ratingLabel}
          </Text>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', marginBottom: spacing.md },
  ring: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  inner: {
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  score: { fontSize: 42, lineHeight: 48 },
  badgeWrap: { marginTop: spacing.xs },
  rating: {
    marginTop: spacing.xs,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
