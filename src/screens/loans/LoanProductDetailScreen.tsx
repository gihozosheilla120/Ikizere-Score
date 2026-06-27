import React from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { colors, spacing } from '../../theme';
import { Text, Card, Badge, Button, EmptyState } from '../../components/ui';
import { useLoanProductQuery } from '../../hooks';
import { formatCurrency } from '../../utils/formatters';
import { getErrorMessage } from '../../utils/errors';
import type { LoansScreenProps } from '@/types/navigation';
import { ROUTES } from '../../constants/routes';

type Props = LoansScreenProps<typeof ROUTES.LOAN_PRODUCT_DETAIL>;

export function LoanProductDetailScreen({ route, navigation }: Props) {
  const { productId } = route.params;
  const { data, isLoading, isError, error } = useLoanProductQuery(productId);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  if (isError || !data?.product) {
    return (
      <View style={styles.centered}>
        <EmptyState
          title="Product not found"
          description={getErrorMessage(error)}
          actionLabel="Go Back"
          onAction={() => navigation.goBack()}
        />
      </View>
    );
  }

  const product = data.product;

  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.content}>
      <Text variant="h2">{product.productName}</Text>
      <Text variant="bodySmall" color={colors.textSecondary} style={styles.lender}>
        {product.lenderName}
        {product.lender?.verified ? ' · Verified lender' : ''}
      </Text>

      <Card style={styles.card}>
        <Text variant="h1" color={colors.primary}>
          {product.matchPercent}%
        </Text>
        <Text variant="caption" color={colors.textMuted}>
          match score
        </Text>
        <Badge
          label={product.isEligible ? 'Eligible' : 'Not eligible'}
          variant={product.isEligible ? 'success' : 'warning'}
          style={styles.badge}
        />
      </Card>

      {product.description ? (
        <Text variant="body" color={colors.textSecondary} style={styles.description}>
          {product.description}
        </Text>
      ) : null}

      <Card style={styles.card}>
        <DetailRow label="Amount range" value={`${formatCurrency(product.minAmount, product.currency)} – ${formatCurrency(product.maxAmount, product.currency)}`} />
        <DetailRow label="Interest rate" value={`${product.interestRate}%`} />
        <DetailRow label="Term" value={`${product.termMonths} months`} />
        <DetailRow label="Min score" value={String(product.minimumScore)} />
        <DetailRow label="Min revenue" value={formatCurrency(product.minimumRevenue, product.currency)} />
      </Card>

      {!product.isEligible && product.eligibilityReasons?.length ? (
        <Card style={styles.card}>
          <Text variant="h3" style={styles.reasonsTitle}>
            Why not eligible
          </Text>
          {product.eligibilityReasons.map((reason) => (
            <Text key={reason} variant="bodySmall" color={colors.textSecondary} style={styles.reason}>
              • {reason}
            </Text>
          ))}
        </Card>
      ) : null}

      <Button title="Back to Marketplace" variant="outline" onPress={() => navigation.goBack()} fullWidth />
    </ScrollView>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailRow}>
      <Text variant="bodySmall" color={colors.textSecondary}>
        {label}
      </Text>
      <Text variant="bodySmall">{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing['4xl'],
    paddingTop: spacing.md,
  },
  centered: { flex: 1, backgroundColor: colors.background, justifyContent: 'center' },
  lender: { marginBottom: spacing.lg },
  card: { marginBottom: spacing.lg },
  badge: { marginTop: spacing.md },
  description: { marginBottom: spacing.lg },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  reasonsTitle: { marginBottom: spacing.sm },
  reason: { marginBottom: spacing.xs },
});
