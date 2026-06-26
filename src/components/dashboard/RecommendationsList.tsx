import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '../../theme';
import { Text, Card } from '../ui';

interface RecommendationItem {
  factor: string;
  title: string;
  description: string;
}

interface RecommendationsListProps {
  items: RecommendationItem[];
}

const ICONS: Record<string, { icon: React.ComponentProps<typeof Ionicons>['name']; bg: string; color: string }> = {
  savingsBehaviour: { icon: 'wallet-outline', bg: colors.infoLight, color: colors.info },
  incomeStability: { icon: 'trending-up-outline', bg: colors.successLight, color: colors.success },
  paymentConsistency: { icon: 'checkmark-done-outline', bg: colors.secondary, color: colors.primary },
  businessActivity: { icon: 'briefcase-outline', bg: colors.warningLight, color: colors.warning },
  creditHistory: { icon: 'card-outline', bg: colors.successLight, color: colors.successDark },
};

export function RecommendationsList({ items }: RecommendationsListProps) {
  if (!items.length) return null;

  return (
    <View style={styles.section}>
      <Text variant="h3" style={styles.sectionTitle}>
        Recommendations
      </Text>
      {items.map((item) => {
        const iconMeta = ICONS[item.factor] ?? ICONS.creditHistory;
        return (
          <Pressable key={item.factor}>
            <Card style={styles.card}>
              <View style={styles.row}>
                <View style={[styles.icon, { backgroundColor: iconMeta.bg }]}>
                  <Ionicons name={iconMeta.icon} size={20} color={iconMeta.color} />
                </View>
                <View style={styles.content}>
                  <Text variant="label">{item.title}</Text>
                  <Text variant="bodySmall" color={colors.textSecondary} style={styles.desc}>
                    {item.description}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
              </View>
            </Card>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginBottom: spacing.lg },
  sectionTitle: { marginBottom: spacing.md },
  card: { marginBottom: spacing.md },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  icon: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { flex: 1 },
  desc: { marginTop: spacing.xs },
});
