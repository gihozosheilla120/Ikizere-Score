import React from 'react';
import { Pressable, PressableProps, StyleSheet, ViewStyle } from 'react-native';
import { colors, borderRadius } from '../../theme';

export interface IconButtonProps extends PressableProps {
  size?: number;
  variant?: 'default' | 'primary' | 'ghost';
  style?: ViewStyle;
}

export function IconButton({
  children,
  size = 40,
  variant = 'default',
  style,
  ...rest
}: IconButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.base,
        {
          width: size,
          height: size,
          borderRadius: borderRadius.full,
          backgroundColor: variantBackground[variant],
        },
        pressed && styles.pressed,
        style,
      ]}
      {...rest}
    >
      {children}
    </Pressable>
  );
}

const variantBackground = {
  default: colors.surfaceMuted,
  primary: colors.primaryMuted,
  ghost: colors.transparent,
} as const;

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { opacity: 0.75 },
});
