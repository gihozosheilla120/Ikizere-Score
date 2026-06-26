import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../../theme';
import { Text, Avatar, IconButton } from '../ui';
import { BrandLogo } from '../auth';

interface RecordsScreenHeaderProps {
  name?: string;
  imageUrl?: string | null;
  showLogoTitle?: boolean;
}

export function RecordsScreenHeader({
  name,
  imageUrl,
  showLogoTitle = true,
}: RecordsScreenHeaderProps) {
  return (
    <View style={styles.row}>
      <Avatar name={name} imageUrl={imageUrl} size={40} />
      {showLogoTitle ? (
        <View style={styles.center}>
          <BrandLogo />
        </View>
      ) : (
        <View style={styles.center} />
      )}
      <IconButton size={40} variant="primary">
        <Ionicons name="notifications-outline" size={20} color={colors.primary} />
      </IconButton>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  center: {
    flex: 1,
    alignItems: 'center',
  },
});
