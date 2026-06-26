import React from 'react';
import { View, Pressable, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, borderRadius, spacing } from '../../theme';
import { Text } from '../ui/Text';

export function SocialAuthButtons() {
  const showComingSoon = (provider: string) => {
    Alert.alert('Coming soon', `${provider} sign-in will be available in a future release.`);
  };

  return (
    <View style={styles.row}>
      <Pressable style={styles.button} onPress={() => showComingSoon('Google')}>
        <Ionicons name="logo-google" size={18} color={colors.text} />
        <Text variant="bodySmall" color={colors.text}>
          Google
        </Text>
      </Pressable>
      <Pressable style={styles.button} onPress={() => showComingSoon('Facebook')}>
        <Ionicons name="logo-facebook" size={18} color="#1877F2" />
        <Text variant="bodySmall" color={colors.text}>
          Facebook
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    minHeight: 48,
  },
});
