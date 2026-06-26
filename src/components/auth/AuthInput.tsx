import React, { useState } from 'react';
import {
  View,
  TextInput,
  TextInputProps,
  StyleSheet,
  Pressable,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { colors, borderRadius, spacing, typography } from '../../theme';
import { Text } from '../ui/Text';

type IconName = ComponentProps<typeof Ionicons>['name'];

export interface AuthInputProps extends TextInputProps {
  label: string;
  error?: string;
  leftIcon?: IconName;
  containerStyle?: ViewStyle;
}

export function AuthInput({
  label,
  error,
  leftIcon,
  containerStyle,
  style,
  secureTextEntry,
  ...rest
}: AuthInputProps) {
  const [hidden, setHidden] = useState(secureTextEntry ?? false);

  return (
    <View style={[styles.container, containerStyle]}>
      <Text variant="label" color={colors.text} style={styles.label}>
        {label}
      </Text>
      <View style={[styles.inputWrap, error ? styles.inputError : null]}>
        {leftIcon ? (
          <Ionicons name={leftIcon} size={18} color={colors.textMuted} style={styles.leftIcon} />
        ) : null}
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor={colors.textMuted}
          secureTextEntry={hidden}
          {...rest}
        />
        {secureTextEntry ? (
          <Pressable onPress={() => setHidden((v) => !v)} hitSlop={8} style={styles.eyeBtn}>
            <Ionicons
              name={hidden ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={colors.textMuted}
            />
          </Pressable>
        ) : null}
      </View>
      {error ? (
        <Text variant="caption" color={colors.error} style={styles.error}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%' },
  label: { marginBottom: spacing.sm },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    minHeight: 52,
    paddingHorizontal: spacing.md,
  },
  inputError: { borderColor: colors.error },
  leftIcon: { marginRight: spacing.sm },
  input: {
    ...typography.body,
    flex: 1,
    color: colors.text,
    paddingVertical: spacing.md,
  },
  eyeBtn: { paddingLeft: spacing.sm },
  error: { marginTop: spacing.xs },
});
