import React from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ROUTES } from '../../constants/routes';
import { colors, spacing } from '../../theme';
import { Text, Card, Badge, EmptyState } from '../../components/ui';
import { DashboardHeader } from '../../components/dashboard';
import { useAuth } from '../../context';
import { useLoanMarketplaceQuery } from '../../hooks';
import { useLoanMarketplaceNavigation } from '../../navigation/hooks';
import { formatCurrency, formatRatingLabel } from '../../utils/formatters';
import { getErrorMessage } from '../../utils/errors';
import type { LoanProductCard } from '@/types/models';

export function LoanMarketplaceScreen() {
  const navigation = useLoanMarketplaceNavigation();
  const { user } = useAuth();
  const { data, isLoading, isError, error, refetch, isRefetching } = useLoanMarketplaceQuery();

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.centered}>
        <EmptyState
          title="Could not load loans"
          description={getErrorMessage(error)}
          actionLabel="Retry"
          onAction={() => refetch()}
        />
      </View>
    );
  }

  const products = data?.products ?? [];
  const context = data?.userContext;

  return (
    <FlatList
      style={styles.list}
      contentContainerStyle={styles.content}
      data={products}
      keyExtractor={(item) => item.id}
      refreshControl={
        <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.primary} />
      }
      ListHeaderComponent={
        <View>
          <DashboardHeader name={user?.fullName} imageUrl={user?.profilePictureUrl} />
          <Text variant="h2" style={styles.title}>
            Loan Marketplace
          </Text>
          <Text variant="bodySmall" color={colors.textSecondary} style={styles.subtitle}>
            Compare loan products matched to your Ikizere Score and business profile.
          </Text>

          {context ? (
            <Card style={styles.contextCard}>
              <Text variant="label" color={colors.textSecondary}>
                Your eligibility context
              </Text>
              <View style={styles.contextRow}>
                <ContextStat label="Score" value={String(context.currentScore ?? '—')} />
                <ContextStat
                  label="Readiness"
                  value={`${context.loanReadinessPercent ?? 0}%`}
                />
                <ContextStat
                  label="Revenue/mo"
                  value={formatCurrency(context.monthlyRevenue ?? 0, 'RWF')}
                />
              </View>
              {context.loanReadinessRating ? (
                <Badge
                  label={formatRatingLabel(context.loanReadinessRating)}
                  variant="info"
                  style={styles.readinessBadge}
                />
              ) : null}
            </Card>
          ) : null}

          <Text variant="h3" style={styles.sectionTitle}>
            Available Products ({products.length})
          </Text>
        </View>
      }
      renderItem={({ item }) => (
        <LoanProductListItem
          product={item}
          onPress={() =>
            navigation.navigate(ROUTES.LOAN_PRODUCT_DETAIL, { productId: item.id })
          }
        />
      )}
      ListEmptyComponent={
        <EmptyState
          title="No loan products"
          description="Check back later for new offers from partner lenders."
        />
      }
    />
  );
}

function ContextStat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.contextStat}>
      <Text variant="caption" color={colors.textMuted}>
        {label}
      </Text>
      <Text variant="bodySmall" style={styles.contextValue}>
        {value}
      </Text>
    </View>
  );
}

function LoanProductListItem({
  product,
  onPress,
}: {
  product: LoanProductCard;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress}>
      <Card style={styles.productCard}>
        <View style={styles.productHeader}>
          <View style={styles.productTitleWrap}>
            <Text variant="h3">{product.productName}</Text>
            <Text variant="bodySmall" color={colors.textSecondary}>
              {product.lenderName}
            </Text>
          </View>
          <View style={styles.matchWrap}>
            <Text variant="h3" color={colors.primary}>
              {product.matchPercent}%
            </Text>
            <Text variant="caption" color={colors.textMuted}>
              match
            </Text>
          </View>
        </View>

        {product.description ? (
          <Text variant="bodySmall" color={colors.textSecondary} style={styles.description}>
            {product.description}
          </Text>
        ) : null}

        <View style={styles.metaRow}>
          <Text variant="caption" color={colors.textSecondary}>
            {formatCurrency(product.minAmount, product.currency)} –{' '}
            {formatCurrency(product.maxAmount, product.currency)}
          </Text>
          <Text variant="caption" color={colors.textSecondary}>
            {product.interestRate}% · {product.termMonths} mo
          </Text>
        </View>

        <Badge
          label={product.isEligible ? 'Eligible' : 'Not eligible'}
          variant={product.isEligible ? 'success' : 'warning'}
          style={styles.eligibilityBadge}
        />

        {!product.isEligible && product.eligibilityReasons?.length ? (
          <View style={styles.reasons}>
            {product.eligibilityReasons.slice(0, 2).map((reason) => (
              <View key={reason} style={styles.reasonRow}>
                <Ionicons name="information-circle-outline" size={14} color={colors.warning} />
                <Text variant="caption" color={colors.textSecondary} style={styles.reasonText}>
                  {reason}
                </Text>
              </View>
            ))}
          </View>
        ) : null}
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  list: { flex: 1, backgroundColor: colors.background },
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing['4xl'],
  },
  centered: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
  },
  title: { marginBottom: spacing.xs },
  subtitle: { marginBottom: spacing.lg },
  contextCard: { marginBottom: spacing.lg },
  contextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  contextStat: { flex: 1 },
  contextValue: { fontWeight: '600', marginTop: spacing.xs },
  readinessBadge: { marginTop: spacing.md },
  sectionTitle: { marginBottom: spacing.md },
  productCard: { marginBottom: spacing.md },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  productTitleWrap: { flex: 1 },
  matchWrap: { alignItems: 'flex-end' },
  description: { marginBottom: spacing.sm },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  eligibilityBadge: { marginBottom: spacing.sm },
  reasons: { gap: spacing.xs },
  reasonRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.xs,
  },
  reasonText: { flex: 1 },
});
