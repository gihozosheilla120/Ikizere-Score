import React from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { colors, spacing } from '../../theme';
import { Text, Card, Badge, Button, EmptyState } from '../../components/ui';
import { LoanReadinessCard } from '../../components/dashboard';
import { useAuth } from '../../context';
import { useEligibleProductsQuery, useScoreSummaryQuery } from '../../hooks';
import { useMainTabNavigation } from '../../navigation/hooks';
import { tabNavigation } from '../../navigation/navigationActions';
import { formatCurrency, formatRatingLabel } from '../../utils/formatters';
import { getErrorMessage } from '../../utils/errors';
import { getReadinessQuote, getRatingBadgeVariant } from '../../utils/scoreTier';
import type { LoanProductCard } from '@/types/models';

export function ScoreReadinessScreen() {
  const navigation = useMainTabNavigation();
  const { user } = useAuth();
  const summaryQuery = useScoreSummaryQuery();
  const eligibleQuery = useEligibleProductsQuery();

  const isLoading = summaryQuery.isLoading || eligibleQuery.isLoading;
  const isRefetching = summaryQuery.isRefetching || eligibleQuery.isRefetching;

  const refetchAll = () => {
    summaryQuery.refetch();
    eligibleQuery.refetch();
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  if (summaryQuery.isError) {
    return (
      <View style={styles.centered}>
        <EmptyState
          title="Score unavailable"
          description={getErrorMessage(summaryQuery.error)}
          actionLabel="Retry"
          onAction={refetchAll}
        />
      </View>
    );
  }

  const summary = summaryQuery.data;
  const eligibleProducts = eligibleQuery.data?.products ?? [];

  if (!summary) {
    return (
      <View style={styles.centered}>
        <EmptyState
          title="No score yet"
          description="Add financial records to generate your Ikizere Score."
          actionLabel="Add Record"
          onAction={() => tabNavigation.toAddRecord(navigation)}
        />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.flex}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={isRefetching} onRefresh={refetchAll} tintColor={colors.primary} />
      }
    >
      <Text variant="h2" style={styles.title}>
        Loan Readiness
      </Text>
      <Text variant="bodySmall" color={colors.textSecondary} style={styles.subtitle}>
        Hi {user?.fullName?.split(' ')[0] ?? 'there'}, here is how lenders see your readiness.
      </Text>

      <LoanReadinessCard
        percent={summary.loanReadinessPercent}
        rating={summary.loanReadinessRating}
        onCheckOffers={() => tabNavigation.toLoanMarketplace(navigation)}
      />

      <Card style={styles.card}>
        <Text variant="h3">Current Score</Text>
        <Text variant="h1" color={colors.primary} style={styles.score}>
          {summary.currentScore}
        </Text>
        <Badge
          label={formatRatingLabel(summary.rating)}
          variant={getRatingBadgeVariant(summary.rating)}
        />
        <Text variant="bodySmall" color={colors.textSecondary} style={styles.quote}>
          {getReadinessQuote(summary.loanReadinessRating)}
        </Text>
      </Card>

      <Text variant="h3" style={styles.sectionTitle}>
        Eligible Products ({eligibleProducts.length})
      </Text>

      {eligibleQuery.isError ? (
        <Card style={styles.card}>
          <Text variant="bodySmall" color={colors.error}>
            {getErrorMessage(eligibleQuery.error, 'Could not load eligible products')}
          </Text>
          <Button title="Retry" variant="outline" onPress={() => eligibleQuery.refetch()} />
        </Card>
      ) : eligibleProducts.length === 0 ? (
        <Card style={styles.card}>
          <Text variant="body" color={colors.textSecondary}>
            No eligible products yet. Keep recording income and savings to unlock offers.
          </Text>
        </Card>
      ) : (
        eligibleProducts.map((product) => (
          <EligibleProductRow key={product.id} product={product} />
        ))
      )}

      <Button
        title="View Score Insights"
        variant="outline"
        onPress={() => tabNavigation.toScoreInsights(navigation)}
        fullWidth
        style={styles.cta}
      />
    </ScrollView>
  );
}

function EligibleProductRow({ product }: { product: LoanProductCard }) {
  return (
    <Card style={styles.productRow}>
      <View style={styles.productHeader}>
        <View style={styles.productTitleWrap}>
          <Text variant="body">{product.productName}</Text>
          <Text variant="caption" color={colors.textSecondary}>
            {product.lenderName}
          </Text>
        </View>
        <Text variant="h3" color={colors.primary}>
          {product.matchPercent}%
        </Text>
      </View>
      <Text variant="caption" color={colors.textSecondary}>
        Up to {formatCurrency(product.maxAmount, product.currency)} · {product.interestRate}% APR
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing['4xl'],
  },
  centered: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
  },
  title: { marginTop: spacing.md, marginBottom: spacing.xs },
  subtitle: { marginBottom: spacing.lg },
  card: { marginBottom: spacing.lg },
  score: { marginVertical: spacing.sm },
  quote: { marginTop: spacing.md, fontStyle: 'italic' },
  sectionTitle: { marginBottom: spacing.md },
  productRow: { marginBottom: spacing.sm },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xs,
  },
  productTitleWrap: { flex: 1, paddingRight: spacing.md },
  cta: { marginTop: spacing.md },
});
