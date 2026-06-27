import React, { useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ROUTES } from '../../constants/routes';
import { ONBOARDING_SLIDES } from '../../constants/auth';
import type { AuthScreenProps } from '@/types/navigation';
import { colors, spacing, borderRadius, shadows } from '../../theme';
import { Text } from '../../components/ui/Text';
import {
  AuthPrimaryButton,
  BrandLogo,
  PaginationDots,
} from '../../components/auth';
import { tokenStorage } from '../../services/tokenStorage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = AuthScreenProps<typeof ROUTES.ONBOARDING>;

const { width } = Dimensions.get('window');

export function OnboardingScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const listRef = useRef<FlatList>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / width);
    setActiveIndex(index);
  };

  const handleNext = async () => {
    if (activeIndex < ONBOARDING_SLIDES.length - 1) {
      listRef.current?.scrollToIndex({ index: activeIndex + 1, animated: true });
      return;
    }

    await tokenStorage.setOnboardingCompleted(true);
    navigation.replace(ROUTES.SIGN_IN);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.md }]}>
      <View style={styles.header}>
        <BrandLogo />
      </View>

      <FlatList
        ref={listRef}
        data={ONBOARDING_SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width }]}>
            <View style={[styles.illustration, shadows.md]}>
              <Ionicons name={item.icon} size={72} color={item.iconColor} />
            </View>
            <Text variant="h2" align="center" style={styles.title}>
              {item.title}
            </Text>
            <Text variant="body" color={colors.textSecondary} align="center" style={styles.desc}>
              {item.description}
            </Text>
          </View>
        )}
      />

      <PaginationDots total={ONBOARDING_SLIDES.length} activeIndex={activeIndex} />

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.lg }]}>
        <AuthPrimaryButton
          title={activeIndex === ONBOARDING_SLIDES.length - 1 ? 'Get Started' : 'Next'}
          onPress={handleNext}
          showArrow
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  header: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  slide: {
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
  },
  illustration: {
    width: width * 0.72,
    height: width * 0.55,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing['2xl'],
  },
  title: {
    marginBottom: spacing.md,
    color: colors.primary,
  },
  desc: {
    paddingHorizontal: spacing.md,
  },
  footer: {
    paddingHorizontal: spacing.lg,
  },
});
