import React from 'react';
import { View, StyleSheet, Pressable, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing } from '../../theme';
import { Text } from '../ui/Text';
import { BrandLogo } from './BrandLogo';

interface AuthHeaderProps {
  title: string;
  subtitle?: string;
  step?: number;
  totalSteps?: number;
  showBack?: boolean;
  onBack?: () => void;
  style?: ViewStyle;
}

export function AuthHeader({
  title,
  subtitle,
  step,
  totalSteps,
  showBack,
  onBack,
  style,
}: AuthHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <LinearGradient
      colors={[colors.primary, colors.primaryDark]}
      style={[styles.gradient, { paddingTop: insets.top + spacing.lg }, style]}
    >
      <View style={styles.decorCircleLarge} />
      <View style={styles.decorCircleSmall} />

      <View style={styles.topRow}>
        <BrandLogo light />
        {showBack ? (
          <Pressable onPress={onBack} style={styles.backBtn} hitSlop={8}>
            <Ionicons name="arrow-back" size={20} color={colors.textInverse} />
            <Text variant="bodySmall" color={colors.textInverse}>
              Back
            </Text>
          </Pressable>
        ) : (
          <View />
        )}
      </View>

      {subtitle ? (
        <Text variant="bodySmall" color="rgba(255,255,255,0.75)" style={styles.subtitle}>
          {subtitle}
        </Text>
      ) : null}

      <Text variant="h1" color={colors.textInverse} style={styles.title}>
        {title}
      </Text>

      {step && totalSteps ? (
        <View style={styles.progressRow}>
          <View style={styles.progressBars}>
            {Array.from({ length: totalSteps }).map((_, index) => (
              <View
                key={index}
                style={[
                  styles.progressSegment,
                  index < step ? styles.progressActive : styles.progressInactive,
                ]}
              />
            ))}
          </View>
          <Text variant="caption" color={colors.textInverse}>
            STEP {step} OF {totalSteps}
          </Text>
        </View>
      ) : null}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing['2xl'],
    overflow: 'hidden',
    minHeight: 200,
  },
  decorCircleLarge: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255,255,255,0.06)',
    top: -40,
    right: -30,
  },
  decorCircleSmall: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.05)',
    bottom: 20,
    left: -20,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  subtitle: { marginBottom: spacing.xs },
  title: { marginBottom: spacing.md },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  progressBars: {
    flex: 1,
    flexDirection: 'row',
    gap: spacing.sm,
  },
  progressSegment: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  progressActive: { backgroundColor: colors.textInverse },
  progressInactive: { backgroundColor: 'rgba(255,255,255,0.35)' },
});
