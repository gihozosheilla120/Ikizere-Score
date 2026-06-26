import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '../../theme';
import { Text, Card } from '../ui';
import { formatCurrency } from '../../utils/formatters';

interface FinancialSummaryGridProps {
  income: number;
  expenses: number;
  savings: number;
  netCashFlow: number;
  currency?: string;
  isEmpty?: boolean;
}

export function FinancialSummaryGrid({
  income,
  expenses,
  savings,
  netCashFlow,
  currency = 'RWF',
  isEmpty = false,
}: FinancialSummaryGridProps) {
  if (isEmpty) {
    return (
      <View style={styles.section}>
        <Text variant="h3" style={styles.sectionTitle}>
          Financial Summary
        </Text>
        <Card style={styles.emptyCard}>
          <Ionicons name="wallet-outline" size={28} color={colors.textMuted} />
          <Text variant="body" align="center" style={styles.emptyTitle}>
            No financial activity yet
          </Text>
          <Text variant="bodySmall" color={colors.textSecondary} align="center">
            Add your first income, expense, or savings record to see monthly insights here.
          </Text>
        </Card>
      </View>
    );
  }

  return (
    <View style={styles.section}>
      <Text variant="h3" style={styles.sectionTitle}>
        Financial Summary
      </Text>
      <View style={styles.grid}>
        <SummaryTile
          label="Monthly Income"
          value={formatCurrency(income, currency)}
          footerIcon="trending-up"
          footerText="This month"
          footerColor={colors.success}
        />
        <SummaryTile
          label="Total Savings"
          value={formatCurrency(savings, currency)}
          footerIcon="checkmark-circle"
          footerText="On Track"
          footerColor={colors.success}
        />
        <SummaryTile
          label="Monthly Expenses"
          value={formatCurrency(expenses, currency)}
          footerIcon="trending-up"
          footerText="This month"
          footerColor={colors.expense}
        />
        <SummaryTile
          label="Net Cash Flow"
          value={formatCurrency(netCashFlow, currency)}
          footerIcon="stats-chart"
          footerText={netCashFlow >= 0 ? 'Positive' : 'Negative'}
          footerColor={netCashFlow >= 0 ? colors.primary : colors.expense}
          valueColor={netCashFlow >= 0 ? colors.primary : colors.expense}
        />
      </View>
    </View>
  );
}

function SummaryTile({
  label,
  value,
  footerIcon,
  footerText,
  footerColor,
  valueColor = colors.text,
}: {
  label: string;
  value: string;
  footerIcon: React.ComponentProps<typeof Ionicons>['name'];
  footerText: string;
  footerColor: string;
  valueColor?: string;
}) {
  return (
    <Card padded style={styles.tile}>
      <Text variant="caption" color={colors.textSecondary}>
        {label}
      </Text>
      <Text variant="h3" color={valueColor} style={styles.value} numberOfLines={1} adjustsFontSizeToFit>
        {value}
      </Text>
      <View style={styles.footer}>
        <Ionicons name={footerIcon} size={14} color={footerColor} />
        <Text variant="caption" color={footerColor}>
          {footerText}
        </Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  section: { marginBottom: spacing.lg },
  sectionTitle: { marginBottom: spacing.md },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  tile: {
    width: '47%',
    flexGrow: 1,
    minWidth: '46%',
  },
  value: { marginVertical: spacing.sm },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  emptyCard: {
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing['2xl'],
  },
  emptyTitle: { marginTop: spacing.sm },
});
