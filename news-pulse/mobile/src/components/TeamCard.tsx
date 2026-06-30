import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import type { Team } from '../types';
import { TeamBadge } from './TeamBadge';
import { colors, radius, spacing } from '../theme';

interface TeamCardProps {
  team: Team;
  selected?: boolean;
  onPress: () => void;
  onToggleFavorite?: () => void;
  isFavorite?: boolean;
}

export function TeamCard({ team, selected, onPress, onToggleFavorite, isFavorite }: TeamCardProps) {
  return (
    <TouchableOpacity
      style={[styles.card, selected && styles.cardSelected]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <TeamBadge
        team={{ id: team.id, name: team.name, shortName: team.shortName, color: team.color, emoji: team.emoji }}
        size="lg"
      />
      <Text style={styles.name}>{team.shortName}</Text>
      <Text style={styles.fullName} numberOfLines={1}>{team.name}</Text>
      {onToggleFavorite ? (
        <TouchableOpacity style={styles.starBtn} onPress={onToggleFavorite}>
          <Text style={styles.star}>{isFavorite ? '★' : '☆'}</Text>
        </TouchableOpacity>
      ) : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 100,
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginRight: spacing.sm,
    position: 'relative',
  },
  cardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '15',
  },
  name: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '800',
    marginTop: spacing.sm,
  },
  fullName: {
    color: colors.textMuted,
    fontSize: 10,
    marginTop: 2,
    textAlign: 'center',
  },
  starBtn: {
    position: 'absolute',
    top: 6,
    right: 8,
  },
  star: {
    fontSize: 16,
    color: colors.gold,
  },
});
