import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ROUTES } from '../../constants/routes';
import { colors, spacing, borderRadius } from '../../theme';
import { Text, Button, Card, Badge } from '../../components/ui';
import { RecordsScreenHeader } from '../../components/records';
import { useRecordQuery } from '../../hooks';
import type { RecordsScreenProps } from '@/types/navigation';
import { formatCurrency, formatRecordDate } from '../../utils/formatters';
import { categoryLabel } from '../../utils/validation/recordValidation';
import { ActivityIndicator } from 'react-native';

type Props = RecordsScreenProps<typeof ROUTES.RECORD_SAVED>;

export function RecordSavedScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const { recordId } = route.params;
  const { data, isLoading } = useRecordQuery(recordId);
  const record = data?.record;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + spacing.md, paddingBottom: insets.bottom + spacing.lg },
      ]}
    >
      <RecordsScreenHeader showLogoTitle />

      <View style={styles.successIcon}>
        <Ionicons name="checkmark" size={48} color={colors.textInverse} />
      </View>

      <Text variant="h2" align="center" style={styles.title}>
        Record Saved!
      </Text>
      <Text variant="bodySmall" color={colors.textSecondary} align="center" style={styles.subtitle}>
        Your financial record has been securely added to your audit trail.
      </Text>

      <Card style={styles.summaryCard}>
        <View style={styles.summaryHeader}>
          <Text variant="caption" color={colors.textMuted}>
            RECORD SUMMARY
          </Text>
          <Badge label="Verified" variant="success" />
        </View>

        {isLoading || !record ? (
          <ActivityIndicator color={colors.primary} style={styles.loader} />
        ) : (
          <>
            <Text variant="h2" color={colors.primary} style={styles.amount}>
              {formatCurrency(record.amount, record.currency)}
            </Text>
            <SummaryRow label="Category" value={categoryLabel(record.category)} />
            <SummaryRow label="Date" value={formatRecordDate(record.transactionDate)} />
          </>
        )}
      </Card>

      <Button
        title="View All Records"
        onPress={() => navigation.navigate(ROUTES.RECORDS_LIST)}
        fullWidth
        style={styles.primaryBtn}
      />
      <Button
        title="Add Another Record"
        variant="secondary"
        onPress={() => navigation.navigate(ROUTES.ADD_RECORD)}
        fullWidth
      />
    </ScrollView>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text variant="bodySmall" color={colors.textSecondary}>
        {label}
      </Text>
      <Text variant="body">{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: {
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
  },
  successIcon: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: spacing.xl,
  },
  title: { marginBottom: spacing.sm },
  subtitle: { marginBottom: spacing.xl, paddingHorizontal: spacing.md },
  summaryCard: { width: '100%', marginBottom: spacing.xl },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  amount: { marginBottom: spacing.lg },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  loader: { marginVertical: spacing.lg },
  primaryBtn: { marginBottom: spacing.md },
});
