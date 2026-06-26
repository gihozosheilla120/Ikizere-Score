import React from 'react';
import { Pressable, StyleSheet, ViewStyle, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, borderRadius, spacing, shadows } from '../../theme';
import { Text } from '../ui/Text';

interface AuthPrimaryButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  showArrow?: boolean;
  style?: ViewStyle;
}

export function AuthPrimaryButton({
  title,
  onPress,
  loading = false,
  disabled = false,
  showArrow = false,
  style,
}: AuthPrimaryButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.button,
        shadows.md,
        pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={colors.textInverse} />
      ) : (
        <>
          <Text variant="button" color={colors.textInverse}>
            {title}
          </Text>
          {showArrow ? (
            <Ionicons name="arrow-forward" size={18} color={colors.textInverse} />
          ) : null}
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius['2xl'],
    minHeight: 54,
    paddingHorizontal: spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  pressed: { opacity: 0.9 },
  disabled: { opacity: 0.55 },
});
