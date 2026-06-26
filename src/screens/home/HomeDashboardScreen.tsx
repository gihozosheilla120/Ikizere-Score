import React, { useMemo } from 'react';
import {
  ScrollView,
  StyleSheet,
  RefreshControl,
  View,
} from 'react-native';
import { tabNavigation } from '../../navigation/navigationActions';
import { useHomeDashboardNavigation } from '../../navigation/hooks';
import { colors, spacing } from '../../theme';
import { useAuth } from '../../context';
import { useDashboardData } from '../../hooks/useDashboardData';
import { getErrorMessage } from '../../utils/errors';
import { getLowestFactorRecommendations } from '../../utils/scoreTier';
import {
  DashboardHeader,
  DashboardSkeleton,
  FinancialSummaryGrid,
  LoanReadinessCard,
  QuickActionsRow,
  RecentActivityList,
  RecommendationsList,
  ScoreSummaryCard,
} from '../../components/dashboard';
import { Button, Card, EmptyState, Text } from '../../components/ui';

export function HomeDashboardScreen() {
  const navigation = useHomeDashboardNavigation();
  const { user } = useAuth();
  const {
    summary,
    breakdown,
    insights,
    recentRecords,
    isLoading,
    isRefetching,
    hasHardError,
    scoreNotFound,
    refetchAll,
  } = useDashboardData();

  const recommendations = useMemo(
    () => (breakdown?.factors ? getLowestFactorRecommendations(breakdown.factors) : []),
    [breakdown?.factors]
  );

  const insightsEmpty =
    !insights ||
    (insights.totalIncome === 0 &&
      insights.totalExpenses === 0 &&
      insights.totalSavings === 0);

  const goToAddRecord = () => {
    tabNavigation.toAddRecord(navigation);
  };

  const goToLoans = () => {
    tabNavigation.toLoanMarketplace(navigation);
  };

  const goToScoreInsights = () => {
    tabNavigation.toScoreInsights(navigation);
  };

  const goToRecordsList = () => {
    tabNavigation.toRecordsList(navigation);
  };

  const quickActions = [
    {
      key: 'add-record',
      label: 'Add Record',
      icon: 'add-circle-outline' as const,
      color: colors.primary,
      background: colors.secondary,
      onPress: goToAddRecord,
    },
    {
      key: 'view-loans',
      label: 'View Loans',
      icon: 'business-outline' as const,
      color: colors.info,
      background: colors.infoLight,
      onPress: goToLoans,
    },
    {
      key: 'view-score',
      label: 'Score Details',
      icon: 'speedometer-outline' as const,
      color: colors.successDark,
      background: colors.successLight,
      onPress: goToScoreInsights,
    },
  ];

  if (isLoading) {
    return (
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <DashboardSkeleton />
      </ScrollView>
    );
  }

  if (hasHardError && !summary && !insights) {
    return (
      <View style={styles.centered}>
        <EmptyState
          title="Couldn't load dashboard"
          description={getErrorMessage(undefined, 'Pull to refresh or try again later.')}
          actionLabel="Retry"
          onAction={() => refetchAll()}
        />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={isRefetching}
          onRefresh={refetchAll}
          tintColor={colors.primary}
        />
      }
    >
      <DashboardHeader name={user?.fullName} imageUrl={user?.profilePictureUrl} />

      {summary ? (
        <ScoreSummaryCard summary={summary} onViewInsights={goToScoreInsights} />
      ) : scoreNotFound ? (
        <Card style={styles.emptyScore}>
          <Text variant="h3" align="center">
            Build your Ikizere Score
          </Text>
          <Text variant="bodySmall" color={colors.textSecondary} align="center" style={styles.emptyDesc}>
            Add financial records to generate your first score and unlock loan readiness insights.
          </Text>
          <Button title="Add Your First Record" onPress={goToAddRecord} fullWidth />
        </Card>
      ) : null}

      <QuickActionsRow actions={quickActions} />

      {summary ? (
        <LoanReadinessCard
          percent={summary.loanReadinessPercent}
          rating={summary.loanReadinessRating}
          onCheckOffers={goToLoans}
        />
      ) : null}

      <FinancialSummaryGrid
        income={insights?.totalIncome ?? 0}
        expenses={insights?.totalExpenses ?? 0}
        savings={insights?.totalSavings ?? 0}
        netCashFlow={insights?.netCashFlow ?? 0}
        currency={insights?.currency ?? 'RWF'}
        isEmpty={insightsEmpty}
      />

      {recommendations.length > 0 ? <RecommendationsList items={recommendations} /> : null}

      <RecentActivityList records={recentRecords} onSeeAll={goToRecordsList} />

      {!recentRecords.length && !insightsEmpty ? (
        <Card style={styles.emptyActivity}>
          <Text variant="bodySmall" color={colors.textSecondary} align="center">
            No recent transactions yet. Use Add Record to start tracking activity.
          </Text>
        </Card>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing['4xl'],
  },
  centered: {
    flex: 1,
    backgroundColor: colors.background,
  },
  emptyScore: {
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  emptyDesc: {
    marginBottom: spacing.sm,
  },
  emptyActivity: {
    marginBottom: spacing['3xl'],
  },
});
