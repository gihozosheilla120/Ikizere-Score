import React from 'react';
import { View, ViewProps, StyleSheet, ViewStyle } from 'react-native';
import { colors, borderRadius, spacing, shadows } from '../../theme';

export interface CardProps extends ViewProps {
  padded?: boolean;
  accentColor?: string;
  elevated?: boolean;
  style?: ViewStyle;
}

export function Card({
  children,
  padded = true,
  accentColor,
  elevated = true,
  style,
  ...rest
}: CardProps) {
  return (
    <View
      style={[
        styles.card,
        padded && styles.padded,
        elevated && shadows.sm,
        accentColor ? { borderLeftWidth: 4, borderLeftColor: accentColor } : null,
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
    overflow: 'hidden',
  },
  padded: { padding: spacing.lg },
});
