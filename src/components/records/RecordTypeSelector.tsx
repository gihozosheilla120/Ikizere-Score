import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { colors, borderRadius, spacing } from '../../theme';
import { Text } from '../ui';
import type { RecordType } from '../../types/models';
import { RECORD_TYPE_FORM_TABS } from '../../constants/records';

interface RecordTypeSelectorProps {
  value: RecordType;
  onChange: (type: RecordType) => void;
}

export function RecordTypeSelector({ value, onChange }: RecordTypeSelectorProps) {
  return (
    <View style={styles.row}>
      {RECORD_TYPE_FORM_TABS.map((tab) => {
        const active = value === tab.key;
        return (
          <Pressable
            key={tab.key}
            onPress={() => onChange(tab.key)}
            style={[styles.tab, active && styles.tabActive]}
          >
            <Text
              variant="caption"
              color={active ? colors.textInverse : colors.textSecondary}
              align="center"
              style={styles.tabText}
            >
              {tab.label}
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
    backgroundColor: colors.surfaceMuted,
    borderRadius: borderRadius.lg,
    padding: spacing.xs,
    marginBottom: spacing.lg,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: colors.primary,
  },
  tabText: { fontWeight: '600' },
});
