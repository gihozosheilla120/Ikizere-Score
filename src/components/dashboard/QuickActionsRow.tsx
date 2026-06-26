import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { colors, spacing, borderRadius, shadows } from '../../theme';
import { Text } from '../ui';

type IconName = ComponentProps<typeof Ionicons>['name'];

interface QuickAction {
  key: string;
  label: string;
  icon: IconName;
  color: string;
  background: string;
  onPress: () => void;
}

interface QuickActionsRowProps {
  actions: QuickAction[];
}

export function QuickActionsRow({ actions }: QuickActionsRowProps) {
  return (
    <View style={styles.row}>
      {actions.map((action) => (
        <Pressable
          key={action.key}
          onPress={action.onPress}
          style={({ pressed }) => [styles.item, shadows.sm, pressed && styles.pressed]}
        >
          <View style={[styles.icon, { backgroundColor: action.background }]}>
            <Ionicons name={action.icon} size={20} color={action.color} />
          </View>
          <Text variant="caption" color={colors.text} align="center" style={styles.label}>
            {action.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  item: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    alignItems: 'center',
  },
  pressed: { opacity: 0.9 },
  icon: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  label: { fontWeight: '600' },
});
