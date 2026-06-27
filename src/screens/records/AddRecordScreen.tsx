import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ROUTES } from '../../constants/routes';
import { colors, spacing, borderRadius } from '../../theme';
import { Text, Input, Card } from '../../components/ui';
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
  useCreateRecordMutation,
  useRecordCategoriesQuery,
} from '../../hooks';
import type { RecordsScreenProps } from '@/types/navigation';
import type { RecordType } from '@/types/models';
import {
  CreateRecordForm,
  formatInputDate,
  hasErrors,
  parseTags,
  toIsoDateTime,
  validateCreateRecordForm,
} from '../../utils/validation/recordValidation';
import { getErrorMessage } from '../../utils/errors';
import { AuthPrimaryButton } from '../../components/auth';

type Props = RecordsScreenProps<typeof ROUTES.ADD_RECORD>;

export function AddRecordScreen({ navigation, route }: Props) {
  const { user } = useAuth();
  const initialType = route.params?.type ?? 'income';
  const createMutation = useCreateRecordMutation();
  const [form, setForm] = useState<CreateRecordForm>({
    type: initialType,
    category: '',
    amount: '',
    currency: 'RWF',
    transactionDate: formatInputDate(),
    description: '',
    tags: '',
  });
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof CreateRecordForm, string>>>({});
  const [apiError, setApiError] = useState('');

  const categoriesQuery = useRecordCategoriesQuery(form.type);

  useEffect(() => {
    setForm((prev) => ({ ...prev, category: '' }));
  }, [form.type]);

  const updateField = <K extends keyof CreateRecordForm>(key: K, value: CreateRecordForm[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setFieldErrors((prev) => ({ ...prev, [key]: undefined }));
    setApiError('');
  };

  const handleSubmit = () => {
    const errors = validateCreateRecordForm(form);
    setFieldErrors(errors);
    if (hasErrors(errors)) return;

    createMutation.mutate(
      {
        type: form.type,
        category: form.category,
        amount: Number(form.amount),
        currency: form.currency,
        transactionDate: toIsoDateTime(form.transactionDate),
        description: form.description.trim(),
        source: 'manual',
        tags: parseTags(form.tags),
      },
      {
        onSuccess: (data) => {
          navigation.replace(ROUTES.RECORD_SAVED, { recordId: data.record._id });
        },
        onError: (error) => setApiError(getErrorMessage(error, 'Failed to save record')),
      }
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <RecordsScreenHeader name={user?.fullName} imageUrl={user?.profilePictureUrl} />

        <Text variant="h2" style={styles.title}>
          Add Record
        </Text>
        <Text variant="bodySmall" color={colors.textSecondary} style={styles.subtitle}>
          Keep your financial history accurate to improve your credit score.
        </Text>

        <RecordTypeSelector
          value={form.type}
          onChange={(type: RecordType) => updateField('type', type)}
        />

        <Card accentColor={colors.primary} style={styles.formCard}>
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
            loading={categoriesQuery.isLoading}
            onChange={(category) => updateField('category', category)}
            error={fieldErrors.category}
          />

          <DateField
            value={form.transactionDate}
            onChangeText={(value) => updateField('transactionDate', value)}
            error={fieldErrors.transactionDate}
          />

          <Input
            label="Description (Optional)"
            placeholder="What was this for?"
            value={form.description}
            onChangeText={(value) => updateField('description', value)}
            multiline
            numberOfLines={3}
            style={styles.textarea}
            error={fieldErrors.description}
          />

          <Input
            label="Tags (comma separated)"
            placeholder="e.g. retail, monthly"
            value={form.tags}
            onChangeText={(value) => updateField('tags', value)}
            error={fieldErrors.tags}
            containerStyle={styles.tagsField}
          />

          {apiError ? (
            <Text variant="bodySmall" color={colors.error} style={styles.apiError}>
              {apiError}
            </Text>
          ) : null}

          <AuthPrimaryButton
            title="Save Record"
            onPress={handleSubmit}
            loading={createMutation.isPending}
            showArrow
          />
        </Card>

        <View style={styles.privacyRow}>
          <Ionicons name="lock-closed-outline" size={14} color={colors.textMuted} />
          <Text variant="caption" color={colors.textMuted}>
            Your records are encrypted and private.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing['4xl'],
  },
  title: { marginBottom: spacing.xs },
  subtitle: { marginBottom: spacing.lg },
  formCard: { marginBottom: spacing.lg },
  textarea: { minHeight: 88, textAlignVertical: 'top' },
  tagsField: { marginBottom: spacing.lg },
  apiError: { marginBottom: spacing.md },
  privacyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
});
