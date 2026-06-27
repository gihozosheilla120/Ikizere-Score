import React, { useMemo } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { colors, spacing } from '../../theme';
import { Text, Card, Badge, EmptyState } from '../../components/ui';
import { useScoreBreakdownQuery } from '../../hooks';
import { formatRatingLabel } from '../../utils/formatters';
import { getErrorMessage } from '../../utils/errors';
import { getLowestFactorRecommendations, getRatingBadgeVariant } from '../../utils/scoreTier';

export function ScoreInsightsScreen() {
  const breakdownQuery = useScoreBreakdownQuery();

  const recommendations = useMemo(
    () =>
      breakdownQuery.data?.factors
        ? getLowestFactorRecommendations(breakdownQuery.data.factors)
        : [],
    [breakdownQuery.data?.factors]
  );

  if (breakdownQuery.isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  if (breakdownQuery.isError || !breakdownQuery.data) {
    return (
      <View style={styles.centered}>
        <EmptyState
          title="Insights unavailable"
          description={getErrorMessage(breakdownQuery.error, 'Add records to build your score.')}
          actionLabel="Retry"
          onAction={() => breakdownQuery.refetch()}
        />
      </View>
    );
  }

  const { currentScore, rating, factors, breakdown, lastCalculatedAt } = breakdownQuery.data;

  return (
    <ScrollView
      style={styles.flex}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={breakdownQuery.isRefetching}
          onRefresh={() => breakdownQuery.refetch()}
          tintColor={colors.primary}
        />
      }
    >
      <Text variant="h2" style={styles.title}>
        Score Insights
      </Text>

      <Card style={styles.card}>
        <Text variant="h1" color={colors.primary}>
          {currentScore}
        </Text>
        <Badge label={formatRatingLabel(rating)} variant={getRatingBadgeVariant(rating)} />
        {lastCalculatedAt ? (
          <Text variant="caption" color={colors.textMuted} style={styles.updated}>
            Last updated {new Date(lastCalculatedAt).toLocaleString()}
          </Text>
        ) : null}
      </Card>

      <Text variant="h3" style={styles.sectionTitle}>
        Score Factors
      </Text>
      {factors.map((factor) => (
        <Card key={factor.factor} style={styles.factorCard}>
          <View style={styles.factorHeader}>
            <Text variant="body">{formatRatingLabel(factor.factor)}</Text>
            <Text variant="bodySmall" color={colors.primary}>
              {factor.score}/100
            </Text>
          </View>
          <View style={styles.track}>
            <View style={[styles.fill, { width: `${Math.min(factor.score, 100)}%` }]} />
          </View>
          <Text variant="caption" color={colors.textSecondary}>
            Weight {Math.round(factor.weight * 100)}% · Contribution {factor.weightedContribution.toFixed(1)}
          </Text>
        </Card>
      ))}

      {Object.keys(breakdown).length > 0 ? (
        <>
          <Text variant="h3" style={styles.sectionTitle}>
            Breakdown
          </Text>
          <Card style={styles.card}>
            {Object.entries(breakdown).map(([key, value]) => (
              <View key={key} style={styles.breakdownRow}>
                <Text variant="bodySmall" color={colors.textSecondary}>
                  {formatRatingLabel(key)}
                </Text>
                <Text variant="bodySmall">{(value ?? 0).toFixed(1)}</Text>
              </View>
            ))}
          </Card>
        </>
      ) : null}

      {recommendations.length > 0 ? (
        <>
          <Text variant="h3" style={styles.sectionTitle}>
            Recommendations
          </Text>
          {recommendations.map((item) => (
            <Card key={item.factor} style={styles.factorCard}>
              <Text variant="body">{item.title}</Text>
              <Text variant="bodySmall" color={colors.textSecondary} style={styles.recommendation}>
                {item.description}
              </Text>
            </Card>
          ))}
        </>
      ) : null}
    </ScrollView>
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
  title: { marginTop: spacing.md, marginBottom: spacing.lg },
  card: { marginBottom: spacing.lg },
  updated: { marginTop: spacing.sm },
  sectionTitle: { marginBottom: spacing.md },
  factorCard: { marginBottom: spacing.sm },
  factorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  track: {
    height: 8,
    borderRadius: 999,
    backgroundColor: colors.surfaceMuted,
    overflow: 'hidden',
    marginBottom: spacing.xs,
  },
  fill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
  },
  recommendation: { marginTop: spacing.xs },
});
