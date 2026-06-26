import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, borderRadius, spacing, shadows } from '../../theme';
import { Text } from '../ui';
import { formatCurrency } from '../../utils/formatters';
import { categoryLabel } from '../../utils/validation/recordValidation';
import { RECORD_TYPE_META } from '../../constants/records';
import type { FinancialRecord } from '../../types/models';

interface RecordListItemProps {
  record: FinancialRecord;
  onPress: () => void;
}

function formatRelativeTime(isoDate: string): string {
  const date = new Date(isoDate);
  const diffMs = Date.now() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

export function RecordListItem({ record, onPress }: RecordListItemProps) {
  const meta = RECORD_TYPE_META[record.type];
  const isIncome = record.type === 'income';
  const isSavings = record.type === 'savings';
  const sign = record.type === 'expense' ? '-' : '+';
  const amountColor = record.type === 'expense' ? colors.expense : colors.income;

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, shadows.sm, pressed && styles.pressed]}>
      <View style={[styles.icon, { backgroundColor: meta.bg }]}>
        <Ionicons name={meta.icon} size={20} color={meta.color} />
      </View>
      <View style={styles.content}>
        <Text variant="label" numberOfLines={1}>
          {record.description || categoryLabel(record.category)}
        </Text>
        <Text variant="caption" color={colors.textMuted}>
          {formatRelativeTime(record.transactionDate)}
        </Text>
      </View>
      <View style={styles.right}>
        <Text variant="label" color={amountColor}>
          {sign}
          {formatCurrency(record.amount, record.currency)}
        </Text>
        <Text variant="caption" color={colors.textMuted} numberOfLines={1}>
          {isSavings ? 'Savings' : isIncome ? 'Business Account' : categoryLabel(record.category)}
        </Text>
      </View>
    </Pressable>
  );
}

export function RecordListSkeleton() {
  return (
    <View style={styles.skeletonWrap}>
      {Array.from({ length: 5 }).map((_, index) => (
        <View key={index} style={[styles.card, styles.skeleton]}>
          <View style={styles.skeletonIcon} />
          <View style={styles.skeletonLines}>
            <View style={styles.skeletonLineWide} />
            <View style={styles.skeletonLine} />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  pressed: { opacity: 0.92 },
  icon: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { flex: 1 },
  right: { alignItems: 'flex-end', maxWidth: '40%' },
  skeletonWrap: { gap: spacing.sm },
  skeleton: { opacity: 0.7 },
  skeletonIcon: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surfaceMuted,
  },
  skeletonLines: { flex: 1, gap: spacing.sm },
  skeletonLineWide: {
    height: 12,
    width: '70%',
    borderRadius: 6,
    backgroundColor: colors.surfaceMuted,
  },
  skeletonLine: {
    height: 10,
    width: '40%',
    borderRadius: 6,
    backgroundColor: colors.surfaceMuted,
  },
});
