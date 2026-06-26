import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, borderRadius, spacing } from '../../theme';
import { Text } from '../ui';

interface MonthlyOverviewCardProps {
  onPress: () => void;
}

export function MonthlyOverviewCard({ onPress }: MonthlyOverviewCardProps) {
  return (
    <Pressable onPress={onPress} style={styles.card}>
      <View style={styles.content}>
        <Text variant="caption" color={colors.primary}>
          Monthly Overview
        </Text>
        <Text variant="h3" color={colors.primary} style={styles.title}>
          Healthy Growth
        </Text>
        <Text variant="bodySmall" color={colors.textSecondary}>
          Tap to view income, expenses, savings, and net cash flow for this month.
        </Text>
      </View>
      <Ionicons name="bar-chart-outline" size={48} color={colors.primaryMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  content: { flex: 1 },
  title: { marginVertical: spacing.xs },
});
