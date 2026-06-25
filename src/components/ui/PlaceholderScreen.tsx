import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, spacing } from '../../theme';
import { Text } from './Text';

/**
 * Minimal placeholder used by navigators until screen UI is implemented.
 */
export interface PlaceholderScreenProps {
  title: string;
  subtitle?: string;
}

export function PlaceholderScreen({ title, subtitle }: PlaceholderScreenProps) {
  return (
    <View style={styles.container}>
      <Text variant="h3" align="center">
        {title}
      </Text>
      {subtitle ? (
        <Text variant="bodySmall" color={colors.textSecondary} align="center" style={styles.subtitle}>
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
  subtitle: { marginTop: spacing.sm },
});
