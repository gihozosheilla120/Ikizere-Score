import React, { useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ROUTES } from '../../constants/routes';
import type { AuthStackParamList } from '../../types/navigation';
import { colors, spacing } from '../../theme';
import { Text } from '../../components/ui/Text';
import { BrandLogo } from '../../components/auth';
import { tokenStorage } from '../../services/tokenStorage';

type Props = NativeStackScreenProps<AuthStackParamList, typeof ROUTES.SPLASH>;

const SPLASH_DURATION_MS = 2000;

export function SplashScreen({ navigation }: Props) {
  useEffect(() => {
    let mounted = true;

    async function goNext() {
      await new Promise((resolve) => setTimeout(resolve, SPLASH_DURATION_MS));
      if (!mounted) return;

      const onboardingDone = await tokenStorage.getOnboardingCompleted();
      navigation.replace(onboardingDone ? ROUTES.SIGN_IN : ROUTES.ONBOARDING);
    }

    goNext();

    return () => {
      mounted = false;
    };
  }, [navigation]);

  return (
    <LinearGradient colors={[colors.primary, colors.primaryDark]} style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoCircle}>
          <BrandLogo light />
        </View>
        <Text variant="h2" color={colors.textInverse} align="center" style={styles.tagline}>
          Ikizere Score
        </Text>
        <Text variant="bodySmall" color="rgba(255,255,255,0.8)" align="center">
          Build trust. Access opportunity.
        </Text>
        <ActivityIndicator color={colors.textInverse} style={styles.loader} />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing['2xl'],
  },
  logoCircle: {
    marginBottom: spacing.xl,
  },
  tagline: { marginBottom: spacing.sm },
  loader: { marginTop: spacing['3xl'] },
});
