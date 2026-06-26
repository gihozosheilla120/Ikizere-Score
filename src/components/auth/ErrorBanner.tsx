import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, borderRadius, spacing } from '../../theme';
import { Text } from '../ui/Text';
import { Ionicons } from '@expo/vector-icons';

export function ErrorBanner({ message }: { message: string }) {
  if (!message) return null;

  return (
    <View style={styles.banner}>
      <Ionicons name="alert-circle" size={18} color={colors.error} />
      <Text variant="bodySmall" color={colors.error} style={styles.text}>
        {message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    backgroundColor: colors.errorLight,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  text: { flex: 1 },
});
