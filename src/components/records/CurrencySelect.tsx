import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { colors, borderRadius, spacing } from '../../theme';
import { Text } from '../ui';
import type { Currency } from '@/types/models';
import { CURRENCY_OPTIONS } from '../../constants/records';

interface CurrencySelectProps {
  value: Currency;
  onChange: (currency: Currency) => void;
}

export function CurrencySelect({ value, onChange }: CurrencySelectProps) {
  return (
    <View style={styles.row}>
      {CURRENCY_OPTIONS.map((option) => {
        const active = value === option.value;
        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            style={[styles.chip, active && styles.chipActive]}
          >
            <Text variant="bodySmall" color={active ? colors.textInverse : colors.textSecondary}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
});
