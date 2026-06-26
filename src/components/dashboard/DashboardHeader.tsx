import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../../theme';
import { Text, Avatar, IconButton } from '../ui';
import { getGreeting } from '../../utils/formatters';

interface DashboardHeaderProps {
  name?: string;
  imageUrl?: string | null;
}

export function DashboardHeader({ name, imageUrl }: DashboardHeaderProps) {
  const firstName = name?.trim().split(/\s+/)[0] ?? 'there';

  return (
    <View style={styles.row}>
      <View style={styles.left}>
        <Avatar name={name} imageUrl={imageUrl} size={44} />
        <View>
          <Text variant="bodySmall" color={colors.textSecondary}>
            {getGreeting()},
          </Text>
          <Text variant="h2" color={colors.primary}>
            {firstName}
          </Text>
        </View>
      </View>
      <IconButton size={44} variant="primary">
        <Ionicons name="notifications-outline" size={22} color={colors.primary} />
      </IconButton>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
});
