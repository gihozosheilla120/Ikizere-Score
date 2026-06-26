import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ROUTES } from '../../constants/routes';
import { colors, spacing, borderRadius } from '../../theme';
import { Text, Button, Card, Badge, Input, EmptyState } from '../../components/ui';
import {
  RecordsScreenHeader,
  RecordTypeSelector,
  CategorySelect,
  CurrencySelect,
  AmountInput,
  DateField,
} from '../../components/records';
import { useAuth } from '../../context';
import {
  useDeleteRecordMutation,
  useRecordCategoriesQuery,
  useRecordQuery,
  useUpdateRecordMutation,
} from '../../hooks';
import type { RecordsScreenProps } from '../../types/navigation';
import type { RecordType } from '../../types/models';
import { formatCurrency, formatRecordDate } from '../../utils/formatters';
import {
  categoryLabel,
  CreateRecordForm,
  formatInputDate,
  hasErrors,
  parseTags,
  toIsoDateTime,
  validateCreateRecordForm,
} from '../../utils/validation/recordValidation';
import { RECORD_TYPE_META } from '../../constants/records';
import { getErrorMessage } from '../../utils/errors';

type Props = RecordsScreenProps<typeof ROUTES.RECORD_DETAIL>;

function recordToForm(record: NonNullable<ReturnType<typeof useRecordQuery>['data']>['record']): CreateRecordForm {
  return {
    type: record.type,
    category: record.category,
    amount: String(record.amount),
    currency: record.currency,
    transactionDate: formatInputDate(new Date(record.transactionDate)),
    description: record.description ?? '',
    tags: (record.tags ?? []).join(', '),
  };
}

export function RecordDetailScreen({ navigation, route }: Props) {
  const { user } = useAuth();
  const { recordId } = route.params;
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<CreateRecordForm | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof CreateRecordForm, string>>>({});
  const [apiError, setApiError] = useState('');

  const recordQuery = useRecordQuery(recordId);
  const updateMutation = useUpdateRecordMutation(recordId);
  const deleteMutation = useDeleteRecordMutation();

  const record = recordQuery.data?.record;
  const categoriesQuery = useRecordCategoriesQuery(form?.type);

  useEffect(() => {
    if (record && !form) {
      setForm(recordToForm(record));
    }
  }, [record, form]);

  const updateField = <K extends keyof CreateRecordForm>(key: K, value: CreateRecordForm[K]) => {
    if (!form) return;
    setForm({ ...form, [key]: value });
    setFieldErrors((prev) => ({ ...prev, [key]: undefined }));
    setApiError('');
  };

  const handleSave = () => {
    if (!form) return;
    const errors = validateCreateRecordForm(form);
    setFieldErrors(errors);
    if (hasErrors(errors)) return;

    updateMutation.mutate(
      {
        type: form.type,
        category: form.category,
        amount: Number(form.amount),
        currency: form.currency,
        transactionDate: toIsoDateTime(form.transactionDate),
        description: form.description.trim(),
        tags: parseTags(form.tags),
      },
      {
        onSuccess: () => setEditing(false),
        onError: (error) => setApiError(getErrorMessage(error, 'Update failed')),
      }
    );
  };

  const confirmDelete = () => {
    Alert.alert('Delete record', 'This action cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deleteMutation.mutate(recordId, {
            onSuccess: () => navigation.goBack(),
            onError: (error) => setApiError(getErrorMessage(error, 'Delete failed')),
          });
        },
      },
    ]);
  };

  if (recordQuery.isLoading || !form) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  if (recordQuery.isError || !record) {
    return (
      <View style={styles.centered}>
        <EmptyState
          title="Record not found"
          description={getErrorMessage(recordQuery.error)}
          actionLabel="Go Back"
          onAction={() => navigation.goBack()}
        />
      </View>
    );
  }

  const meta = RECORD_TYPE_META[record.type];

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <RecordsScreenHeader name={user?.fullName} imageUrl={user?.profilePictureUrl} />

        <View style={styles.titleRow}>
          <Text variant="h2">Record Details</Text>
          <Badge label={record.type.toUpperCase()} variant="info" />
        </View>

        {editing ? (
          <Card style={styles.card}>
            <RecordTypeSelector
              value={form.type}
              onChange={(type: RecordType) => updateField('type', type)}
            />
            <AmountInput
              value={form.amount}
              currency={form.currency}
              onChangeText={(value) => updateField('amount', value)}
              error={fieldErrors.amount}
            />
            <CurrencySelect
              value={form.currency}
              onChange={(currency) => updateField('currency', currency)}
            />
            <CategorySelect
              value={form.category}
              categories={categoriesQuery.data?.categories ?? []}
              onChange={(category) => updateField('category', category)}
              error={fieldErrors.category}
            />
            <DateField
              value={form.transactionDate}
              onChangeText={(value) => updateField('transactionDate', value)}
              error={fieldErrors.transactionDate}
            />
            <Input
              label="Description"
              value={form.description}
              onChangeText={(value) => updateField('description', value)}
              multiline
              numberOfLines={3}
              style={styles.textarea}
            />
            <Input
              label="Tags"
              value={form.tags}
              onChangeText={(value) => updateField('tags', value)}
            />
            {apiError ? (
              <Text variant="bodySmall" color={colors.error} style={styles.apiError}>
                {apiError}
              </Text>
            ) : null}
            <Button
              title="Save Changes"
              onPress={handleSave}
              loading={updateMutation.isPending}
              fullWidth
              style={styles.actionBtn}
            />
            <Button title="Cancel" variant="ghost" onPress={() => setEditing(false)} fullWidth />
          </Card>
        ) : (
          <Card style={styles.card}>
            <View style={[styles.icon, { backgroundColor: meta.bg }]}>
              <Ionicons name={meta.icon} size={28} color={meta.color} />
            </View>
            <Text variant="h1" color={colors.primary} style={styles.amount}>
              {formatCurrency(record.amount, record.currency)}
            </Text>
            <DetailRow label="Category" value={categoryLabel(record.category)} />
            <DetailRow label="Date" value={formatRecordDate(record.transactionDate)} />
            <DetailRow label="Description" value={record.description || '—'} />
            <DetailRow label="Tags" value={record.tags?.length ? record.tags.join(', ') : '—'} />
            <DetailRow label="Source" value={record.source ?? 'manual'} />
          </Card>
        )}

        {!editing ? (
          <View style={styles.actions}>
            <Button title="Edit Record" onPress={() => setEditing(true)} fullWidth />
            <Button
              title="Delete Record"
              variant="danger"
              onPress={confirmDelete}
              loading={deleteMutation.isPending}
              fullWidth
              style={styles.actionBtn}
            />
          </View>
        ) : null}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailRow}>
      <Text variant="bodySmall" color={colors.textSecondary}>
        {label}
      </Text>
      <Text variant="body" style={styles.detailValue}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  centered: { flex: 1, backgroundColor: colors.background },
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing['4xl'],
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  card: { marginBottom: spacing.lg },
  icon: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  amount: { marginBottom: spacing.lg },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
    paddingVertical: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  detailValue: { flex: 1, textAlign: 'right' },
  actions: { gap: spacing.md },
  actionBtn: { marginTop: spacing.sm },
  textarea: { minHeight: 88, textAlignVertical: 'top' },
  apiError: { marginBottom: spacing.md },
});
