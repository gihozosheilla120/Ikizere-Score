import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '../../theme';
import { Text, Card, Divider } from '../ui';
import { formatCurrency, formatRecordDate, formatSignedCurrency } from '../../utils/formatters';
import type { FinancialRecord } from '../../types/models';

interface RecentActivityListProps {
  records: FinancialRecord[];
  onSeeAll: () => void;
}

const TYPE_ICONS: Record<
  FinancialRecord['type'],
  { icon: React.ComponentProps<typeof Ionicons>['name']; bg: string; color: string }
> = {
  expense: { icon: 'cart-outline', bg: colors.surfaceMuted, color: colors.textMuted },
  income: { icon: 'cash-outline', bg: colors.successLight, color: colors.success },
  savings: { icon: 'wallet-outline', bg: colors.infoLight, color: colors.info },
};

export function RecentActivityList({ records, onSeeAll }: RecentActivityListProps) {
  if (!records.length) return null;

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Text variant="h3">Recent Activity</Text>
        <Pressable onPress={onSeeAll} hitSlop={8}>
          <Text variant="bodySmall" color={colors.primary}>
            See All
          </Text>
        </Pressable>
      </View>

      <Card padded={false}>
        {records.map((record, index) => {
          const iconMeta = TYPE_ICONS[record.type];
          const isIncome = record.type === 'income';
          const amount =
            record.type === 'expense'
              ? `-${formatCurrency(record.amount, record.currency)}`
              : formatSignedCurrency(record.amount, record.currency);

          return (
            <View key={record._id}>
              <View style={styles.row}>
                <View style={[styles.icon, { backgroundColor: iconMeta.bg }]}>
                  <Ionicons name={iconMeta.icon} size={18} color={iconMeta.color} />
                </View>
                <View style={styles.content}>
                  <Text variant="label" numberOfLines={1}>
                    {record.description || record.category}
                  </Text>
                  <Text variant="caption" color={colors.textMuted}>
                    {formatRecordDate(record.transactionDate)}
                  </Text>
                </View>
                <Text
                  variant="label"
                  color={isIncome ? colors.income : colors.expense}
                >
                  {amount}
                </Text>
              </View>
              {index < records.length - 1 ? <Divider style={styles.divider} /> : null}
            </View>
          );
        })}
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginBottom: spacing['3xl'] },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { flex: 1 },
  divider: { marginHorizontal: spacing.lg },
});
