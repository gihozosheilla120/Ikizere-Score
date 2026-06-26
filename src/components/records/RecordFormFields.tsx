import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, borderRadius, spacing, typography } from '../../theme';
import { Text } from '../ui';
import type { Currency } from '../../types/models';

interface AmountInputProps {
  value: string;
  currency: Currency;
  onChangeText: (value: string) => void;
  error?: string;
}

export function AmountInput({ value, currency, onChangeText, error }: AmountInputProps) {
  return (
    <View style={styles.wrap}>
      <Text variant="label" color={colors.textSecondary}>
        Amount
      </Text>
      <View style={[styles.inputWrap, error ? styles.inputError : null]}>
        <Text variant="body" color={colors.primaryLight} style={styles.currency}>
          {currency}
        </Text>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          keyboardType="decimal-pad"
          placeholder="0.00"
          placeholderTextColor={colors.textMuted}
          style={styles.input}
        />
      </View>
      {error ? (
        <Text variant="caption" color={colors.error}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}

interface DateFieldProps {
  value: string;
  onChangeText: (value: string) => void;
  error?: string;
}

export function DateField({ value, onChangeText, error }: DateFieldProps) {
  return (
    <View style={styles.wrap}>
      <Text variant="label" color={colors.textSecondary}>
        Date
      </Text>
      <View style={[styles.dateWrap, error ? styles.inputError : null]}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder="YYYY-MM-DD"
          placeholderTextColor={colors.textMuted}
          style={styles.dateInput}
        />
        <Ionicons name="calendar-outline" size={20} color={colors.textMuted} />
      </View>
      {error ? (
        <Text variant="caption" color={colors.error}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: spacing.lg },
  inputWrap: {
    marginTop: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    minHeight: 64,
  },
  currency: { marginRight: spacing.md, fontWeight: '700' },
  input: {
    ...typography.h2,
    flex: 1,
    color: colors.text,
    paddingVertical: spacing.sm,
  },
  dateWrap: {
    marginTop: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    minHeight: 52,
  },
  dateInput: {
    ...typography.body,
    flex: 1,
    color: colors.text,
    paddingVertical: spacing.md,
  },
  inputError: { borderColor: colors.error },
});
