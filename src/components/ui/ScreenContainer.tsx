import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, layout } from '../../theme';

export interface ScreenContainerProps {
  children: React.ReactNode;
  padded?: boolean;
  safe?: boolean;
  style?: ViewStyle;
}

export function ScreenContainer({
  children,
  padded = true,
  safe = true,
  style,
}: ScreenContainerProps) {
  const content = (
    <View style={[styles.inner, padded && styles.padded, style]}>{children}</View>
  );

  if (safe) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
        {content}
      </SafeAreaView>
    );
  }

  return <View style={styles.safe}>{content}</View>;
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  inner: { flex: 1 },
  padded: {
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingVertical: layout.screenPaddingVertical,
  },
});
