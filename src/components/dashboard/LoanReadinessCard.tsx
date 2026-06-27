import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '../../theme';
import { Text, Card, Button } from '../ui';
import { getReadinessQuote } from '../../utils/scoreTier';
import type { LoanReadinessRating } from '@/types/models';

interface LoanReadinessCardProps {
  percent: number;
  rating: LoanReadinessRating;
  onCheckOffers: () => void;
}

export function LoanReadinessCard({ percent, rating, onCheckOffers }: LoanReadinessCardProps) {
  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Text variant="h3">Loan Readiness</Text>
        <View style={styles.iconWrap}>
          <Ionicons name="business-outline" size={18} color={colors.primary} />
        </View>
      </View>

      <View style={styles.row}>
        <Text variant="bodySmall" color={colors.textSecondary}>
          Current Readiness
        </Text>
        <Text variant="h3" color={colors.primary}>
          {percent}%
        </Text>
      </View>

      <View style={styles.track}>
        <View style={[styles.fill, { width: `${Math.min(percent, 100)}%` }]} />
      </View>

      <Text variant="bodySmall" color={colors.textSecondary} style={styles.quote}>
        {getReadinessQuote(rating)}
      </Text>

      <Button title="Check Loan Offers" variant="outline" onPress={onCheckOffers} fullWidth />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: spacing.lg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.md,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  track: {
    height: 8,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surfaceMuted,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  fill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
  },
  quote: {
    fontStyle: 'italic',
    marginBottom: spacing.lg,
    lineHeight: 20,
  },
});
