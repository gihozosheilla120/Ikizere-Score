import React from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ROUTES } from '../../constants/routes';
import type { AuthScreenProps } from '../../types/navigation';
import { colors, spacing, borderRadius, shadows } from '../../theme';
import { Text } from '../../components/ui/Text';
import { AuthPrimaryButton } from '../../components/auth';
import { useAuth } from '../../context';

type Props = AuthScreenProps<typeof ROUTES.ACCOUNT_CREATED>;

export function AccountCreatedScreen(_props: Props) {
  const insets = useSafeAreaInsets();
  const { completeRegistration } = useAuth();

  const goToDashboard = () => {
    completeRegistration();
  };

  const goToProfile = () => {
    completeRegistration();
    // Profile onboarding will be implemented in a later module
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + spacing['2xl'], paddingBottom: insets.bottom + spacing.lg },
      ]}
    >
      <View style={[styles.successCard, shadows.lg]}>
        <View style={styles.checkCircle}>
          <Ionicons name="checkmark" size={48} color={colors.textInverse} />
        </View>
        <View style={styles.badge}>
          <Ionicons name="checkmark-circle" size={22} color={colors.primary} />
        </View>
      </View>

      <Text variant="h2" align="center" style={styles.title}>
        Account Created Successfully!
      </Text>
      <Text variant="body" color={colors.textSecondary} align="center" style={styles.subtitle}>
        Welcome to{' '}
        <Text variant="body" color={colors.primary}>
          Ikizere Score
        </Text>
        . You&apos;re now ready to start building your financial trust profile.
      </Text>

      <Pressable onPress={goToProfile} style={styles.secondaryBtn}>
        <Text variant="button" color={colors.primary} align="center">
          Complete My Profile
        </Text>
      </Pressable>

      <AuthPrimaryButton title="Go to Dashboard" onPress={goToDashboard} style={styles.primaryBtn} />

      <View style={[styles.infoCard, styles.infoGreen]}>
        <Ionicons name="shield-checkmark" size={22} color={colors.success} />
        <View style={styles.infoText}>
          <Text variant="label">Data Privacy</Text>
          <Text variant="bodySmall" color={colors.textSecondary}>
            Your financial data is encrypted with bank-level security.
          </Text>
        </View>
      </View>

      <View style={[styles.infoCard, styles.infoBlue]}>
        <Ionicons name="speedometer-outline" size={22} color={colors.primary} />
        <View style={styles.infoText}>
          <Text variant="label">Instant Analysis</Text>
          <Text variant="bodySmall" color={colors.textSecondary}>
            Get your initial score within seconds of linking accounts.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: {
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
  },
  successCard: {
    width: 140,
    height: 140,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
    position: 'relative',
  },
  checkCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.full,
  },
  title: { marginBottom: spacing.md },
  subtitle: { marginBottom: spacing['2xl'], paddingHorizontal: spacing.md },
  secondaryBtn: {
    width: '100%',
    backgroundColor: colors.secondary,
    borderRadius: borderRadius['2xl'],
    minHeight: 54,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  primaryBtn: { width: '100%', marginBottom: spacing['2xl'] },
  infoCard: {
    width: '100%',
    flexDirection: 'row',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderLeftWidth: 4,
  },
  infoGreen: { borderLeftColor: colors.success },
  infoBlue: { borderLeftColor: colors.primary },
  infoText: { flex: 1 },
});
