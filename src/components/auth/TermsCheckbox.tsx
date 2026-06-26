import React from 'react';
import { Pressable, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '../../theme';
import { Text } from '../ui/Text';

interface TermsCheckboxProps {
  checked: boolean;
  onToggle: () => void;
  error?: string;
}

export function TermsCheckbox({ checked, onToggle, error }: TermsCheckboxProps) {
  return (
    <View style={styles.wrap}>
      <Pressable onPress={onToggle} style={styles.row}>
        <View style={[styles.box, checked && styles.boxChecked, error ? styles.boxError : null]}>
          {checked ? <Ionicons name="checkmark" size={14} color={colors.textInverse} /> : null}
        </View>
        <Text variant="bodySmall" color={colors.textSecondary} style={styles.text}>
          I agree to the{' '}
          <Text variant="bodySmall" color={colors.primary}>
            Terms & Conditions
          </Text>{' '}
          and{' '}
          <Text variant="bodySmall" color={colors.primary}>
            Privacy Policy
          </Text>
        </Text>
      </Pressable>
      {error ? (
        <Text variant="caption" color={colors.error} style={styles.error}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: spacing.md },
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md },
  box: {
    width: 22,
    height: 22,
    borderRadius: borderRadius.sm,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  boxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  boxError: { borderColor: colors.error },
  text: { flex: 1 },
  error: { marginTop: spacing.xs, marginLeft: 30 },
});
