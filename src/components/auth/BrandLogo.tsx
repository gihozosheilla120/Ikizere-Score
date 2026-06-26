import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../../theme';
import { Text } from '../ui/Text';

export function BrandLogo({ light = false }: { light?: boolean }) {
  return (
    <View style={styles.row}>
      <View style={[styles.iconWrap, light && styles.iconWrapLight]}>
        <Ionicons name="business" size={18} color={light ? colors.primary : colors.textInverse} />
      </View>
      <Text variant="h3" color={light ? colors.textInverse : colors.primary}>
        Ikizere
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapLight: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
});
