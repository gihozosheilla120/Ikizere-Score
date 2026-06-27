import React, { useMemo, useState } from 'react';
import {
  View,
  StyleSheet,
  SectionList,
  Pressable,
  Modal,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ROUTES } from '../../constants/routes';
import { colors, spacing, borderRadius } from '../../theme';
import { Text, Button, EmptyState, Input } from '../../components/ui';
import {
  RecordsScreenHeader,
  RecordSearchBar,
  RecordFilterChips,
  RecordListItem,
  RecordListSkeleton,
  MonthlyOverviewCard,
} from '../../components/records';
import { useAuth } from '../../context';
import { useDebouncedValue, useRecordsInfiniteQuery } from '../../hooks';
import type { RecordFilterTab } from '../../constants/records';
import type { RecordsScreenProps } from '@/types/navigation';
import { getErrorMessage } from '../../utils/errors';
import { groupRecordsByDate } from '../../utils/records';
import { MonthlyInsightsScreen } from './MonthlyInsightsScreen';

type Props = RecordsScreenProps<typeof ROUTES.RECORDS_LIST>;

export function RecordsListScreen({ navigation }: Props) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<RecordFilterTab>('all');
  const [search, setSearch] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [insightsOpen, setInsightsOpen] = useState(false);

  const debouncedSearch = useDebouncedValue(search);

  const filters = useMemo(
    () => ({
      type: activeTab === 'all' ? undefined : activeTab,
      search: debouncedSearch.trim() || undefined,
      fromDate: fromDate.trim() || undefined,
      toDate: toDate.trim() || undefined,
      sortBy: 'transactionDate' as const,
      sortOrder: 'desc' as const,
    }),
    [activeTab, debouncedSearch, fromDate, toDate]
  );

  const { data, isLoading, isError, error, refetch, isRefetching, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useRecordsInfiniteQuery(filters);

  const records = useMemo(
    () => data?.pages.flatMap((page) => page.records) ?? [],
    [data]
  );

  const sections = useMemo(() => groupRecordsByDate(records), [records]);

  const listHeader = (
    <View>
      <View style={styles.addRow}>
        <Text variant="h3">Add new record</Text>
        <Pressable
          style={styles.addBtn}
          onPress={() => navigation.navigate(ROUTES.ADD_RECORD)}
        >
          <Ionicons name="add" size={28} color={colors.textInverse} />
        </Pressable>
      </View>

      <Text variant="h3" style={styles.sectionTitle}>
        Transaction History
      </Text>

      <RecordSearchBar value={search} onChangeText={setSearch} />
      <RecordFilterChips active={activeTab} onChange={setActiveTab} />

      <Pressable style={styles.dateFilterBtn} onPress={() => setFilterOpen(true)}>
        <Ionicons name="calendar-outline" size={16} color={colors.primary} />
        <Text variant="bodySmall" color={colors.primary}>
          {fromDate || toDate ? 'Date filter active' : 'Filter by date'}
        </Text>
      </Pressable>

      <MonthlyOverviewCard onPress={() => setInsightsOpen(true)} />
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        <RecordsScreenHeader name={user?.fullName} imageUrl={user?.profilePictureUrl} />
        {listHeader}
        <RecordListSkeleton />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.container}>
        <RecordsScreenHeader name={user?.fullName} imageUrl={user?.profilePictureUrl} />
        <EmptyState
          title="Couldn't load records"
          description={getErrorMessage(error)}
          actionLabel="Retry"
          onAction={() => refetch()}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SectionList
        sections={sections}
        keyExtractor={(item) => item._id}
        stickySectionHeadersEnabled={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            <RecordsScreenHeader name={user?.fullName} imageUrl={user?.profilePictureUrl} />
            {listHeader}
          </>
        }
        renderSectionHeader={({ section: { title } }) => (
          <Text variant="caption" color={colors.textMuted} style={styles.sectionHeader}>
            {title}
          </Text>
        )}
        renderItem={({ item }) => (
          <RecordListItem
            record={item}
            onPress={() =>
              navigation.navigate(ROUTES.RECORD_DETAIL, { recordId: item._id })
            }
          />
        )}
        ListEmptyComponent={
          <EmptyState
            title="No records yet"
            description="Add your first income, expense, or savings record to start building your financial history."
            actionLabel="Add Record"
            onAction={() => navigation.navigate(ROUTES.ADD_RECORD)}
          />
        }
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.primary} />
        }
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) fetchNextPage();
        }}
        onEndReachedThreshold={0.4}
        ListFooterComponent={
          isFetchingNextPage ? (
            <ActivityIndicator color={colors.primary} style={styles.footerLoader} />
          ) : null
        }
      />

      <Modal visible={filterOpen} transparent animationType="slide" onRequestClose={() => setFilterOpen(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <Text variant="h3" style={styles.modalTitle}>
              Filter by date
            </Text>
            <Input label="From (YYYY-MM-DD)" value={fromDate} onChangeText={setFromDate} />
            <Input label="To (YYYY-MM-DD)" value={toDate} onChangeText={setToDate} containerStyle={styles.modalField} />
            <Button title="Apply" onPress={() => setFilterOpen(false)} fullWidth />
            <Button
              title="Clear"
              variant="ghost"
              onPress={() => {
                setFromDate('');
                setToDate('');
                setFilterOpen(false);
              }}
              fullWidth
              style={styles.modalClear}
            />
          </View>
        </View>
      </Modal>

      <MonthlyInsightsScreen visible={insightsOpen} onClose={() => setInsightsOpen(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing['4xl'],
  },
  addRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },
  addBtn: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: { marginBottom: spacing.md },
  sectionHeader: {
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
    letterSpacing: 0.6,
  },
  dateFilterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.lg,
  },
  footerLoader: { marginVertical: spacing.lg },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    padding: spacing.lg,
  },
  modalTitle: { marginBottom: spacing.lg },
  modalField: { marginTop: spacing.md },
  modalClear: { marginTop: spacing.sm },
});
