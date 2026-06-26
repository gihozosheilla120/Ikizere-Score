import React, { useMemo } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, borderRadius, shadows } from '../../theme';
import { Text, Card, Button } from '../../components/ui';
import { useMonthlyInsightsQuery } from '../../hooks';
import { formatCurrency } from '../../utils/formatters';
import { getCurrentMonthParams } from '../../utils/records';
import { getErrorMessage } from '../../utils/errors';

interface MonthlyInsightsScreenProps {
  visible: boolean;
  onClose: () => void;
}

export function MonthlyInsightsScreen({ visible, onClose }: MonthlyInsightsScreenProps) {
  const insets = useSafeAreaInsets();
  const params = useMemo(() => getCurrentMonthParams(), []);
  const { data, isLoading, isError, error, refetch, isRefetching } = useMonthlyInsightsQuery({
    ...params,
    currency: 'RWF',
  });

  const monthLabel = new Date(params.year, params.month - 1, 1).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={[styles.container, { paddingTop: insets.top + spacing.md }]}>
        <View style={styles.header}>
          <Pressable onPress={onClose} hitSlop={8}>
            <Ionicons name="close" size={24} color={colors.text} />
          </Pressable>
          <Text variant="h3">Monthly Insights</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <Text variant="bodySmall" color={colors.textSecondary} style={styles.subtitle}>
            {monthLabel}
          </Text>

          {isLoading ? (
            <ActivityIndicator color={colors.primary} size="large" style={styles.loader} />
          ) : isError ? (
            <Card style={styles.errorCard}>
              <Text variant="body" color={colors.error}>
                {getErrorMessage(error)}
              </Text>
              <Button title="Retry" onPress={() => refetch()} style={styles.retryBtn} />
            </Card>
          ) : (
            <>
              <View style={styles.grid}>
                <InsightTile
                  label="Total Income"
                  value={formatCurrency(data?.totalIncome ?? 0, data?.currency ?? 'RWF')}
                  color={colors.income}
                />
                <InsightTile
                  label="Total Expenses"
                  value={formatCurrency(data?.totalExpenses ?? 0, data?.currency ?? 'RWF')}
                  color={colors.expense}
                />
                <InsightTile
                  label="Savings"
                  value={formatCurrency(data?.totalSavings ?? 0, data?.currency ?? 'RWF')}
                  color={colors.savings}
                />
                <InsightTile
                  label="Net Cash Flow"
                  value={formatCurrency(data?.netCashFlow ?? 0, data?.currency ?? 'RWF')}
                  color={(data?.netCashFlow ?? 0) >= 0 ? colors.primary : colors.expense}
                />
              </View>

              <Card style={styles.chartPlaceholder} elevated>
                <Ionicons name="bar-chart-outline" size={40} color={colors.primaryMuted} />
                <Text variant="label" align="center" style={styles.chartTitle}>
                  Trend chart
                </Text>
                <Text variant="bodySmall" color={colors.textSecondary} align="center">
                  Visual breakdown coming in a future release.
                </Text>
              </Card>
            </>
          )}
        </ScrollView>

        {isRefetching ? (
          <ActivityIndicator color={colors.primary} style={styles.refreshing} />
        ) : null}
      </View>
    </Modal>
  );
}

function InsightTile({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <Card style={styles.tile} accentColor={color}>
      <Text variant="caption" color={colors.textSecondary}>
        {label}
      </Text>
      <Text variant="h3" color={color} style={styles.tileValue} numberOfLines={1} adjustsFontSizeToFit>
        {value}
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  headerSpacer: { width: 24 },
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing['4xl'],
  },
  subtitle: { marginBottom: spacing.lg },
  loader: { marginTop: spacing['3xl'] },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  tile: {
    width: '47%',
    flexGrow: 1,
    minWidth: '46%',
  },
  tileValue: { marginTop: spacing.sm },
  chartPlaceholder: {
    alignItems: 'center',
    paddingVertical: spacing['3xl'],
    gap: spacing.sm,
    ...shadows.sm,
  },
  chartTitle: { marginTop: spacing.sm },
  errorCard: { gap: spacing.md },
  retryBtn: { marginTop: spacing.sm },
  refreshing: { marginBottom: spacing.lg },
});
