import { View, Text, StyleSheet } from 'react-native';
import type { TeamRef } from '../types';
import { colors, radius } from '../theme';

interface TeamBadgeProps {
  team: TeamRef | null;
  size?: 'sm' | 'md' | 'lg';
}

export function TeamBadge({ team, size = 'md' }: TeamBadgeProps) {
  if (!team) return null;

  const dim = size === 'sm' ? 28 : size === 'lg' ? 48 : 36;
  const fontSize = size === 'sm' ? 10 : size === 'lg' ? 14 : 11;

  return (
    <View style={[styles.badge, { width: dim, height: dim, backgroundColor: team.color }]}>
      <Text style={[styles.text, { fontSize }]}>{team.shortName}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  text: {
    color: colors.text,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
});
