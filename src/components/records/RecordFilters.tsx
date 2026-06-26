import React from 'react';
import { View, Pressable, StyleSheet, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, borderRadius, spacing } from '../../theme';
import { Text } from '../ui';
import type { RecordFilterTab } from '../../constants/records';
import { RECORD_FILTER_TABS } from '../../constants/records';

interface RecordSearchBarProps {
  value: string;
  onChangeText: (value: string) => void;
}

export function RecordSearchBar({ value, onChangeText }: RecordSearchBarProps) {
  return (
    <View style={styles.wrap}>
      <Ionicons name="search-outline" size={18} color={colors.textMuted} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Search transactions..."
        placeholderTextColor={colors.textMuted}
        style={styles.input}
      />
    </View>
  );
}

interface RecordFilterChipsProps {
  active: RecordFilterTab;
  onChange: (tab: RecordFilterTab) => void;
}

export function RecordFilterChips({ active, onChange }: RecordFilterChipsProps) {
  return (
    <View style={styles.chips}>
      {RECORD_FILTER_TABS.map((tab) => {
        const selected = active === tab.key;
        return (
          <Pressable
            key={tab.key}
            onPress={() => onChange(tab.key)}
            style={[styles.chip, selected && styles.chipActive]}
          >
            <Text variant="bodySmall" color={selected ? colors.textInverse : colors.textSecondary}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    minHeight: 48,
    marginBottom: spacing.md,
  },
  input: {
    flex: 1,
    color: colors.text,
    paddingVertical: spacing.sm,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surfaceMuted,
  },
  chipActive: {
    backgroundColor: colors.primary,
  },
});
