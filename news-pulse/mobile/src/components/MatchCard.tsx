import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { Match } from '../types';
import { TeamBadge } from './TeamBadge';
import { colors, radius, spacing } from '../theme';

interface MatchCardProps {
  match: Match;
  onPress?: () => void;
  compact?: boolean;
}

function formatKickoff(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

function formatDate(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' });
}

export function MatchCard({ match, onPress, compact = false }: MatchCardProps) {
  const isLive = match.status === 'LIVE';
  const isFinished = match.status === 'FINISHED';
  const isScheduled = match.status === 'SCHEDULED';

  const content = (
    <View style={[styles.card, compact && styles.cardCompact]}>
      <View style={styles.header}>
        <Text style={styles.competition}>
          {match.competition?.emoji} {match.competition?.name}
        </Text>
        {isLive ? (
          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>{match.minute}'</Text>
          </View>
        ) : isFinished ? (
          <Text style={styles.finishedText}>Terminé</Text>
        ) : (
          <Text style={styles.timeText}>{formatKickoff(match.kickoff)}</Text>
        )}
      </View>

      <View style={styles.teamsRow}>
        <View style={styles.teamSide}>
          <TeamBadge team={match.homeTeam} size={compact ? 'sm' : 'md'} />
          <Text style={styles.teamName} numberOfLines={1}>
            {match.homeTeam?.name}
          </Text>
        </View>

        <View style={styles.scoreBox}>
          {isScheduled ? (
            <Text style={styles.vs}>vs</Text>
          ) : (
            <Text style={[styles.score, isLive && styles.scoreLive]}>
              {match.homeScore} - {match.awayScore}
            </Text>
          )}
          {!compact && isScheduled ? (
            <Text style={styles.dateLabel}>{formatDate(match.kickoff)}</Text>
          ) : null}
        </View>

        <View style={[styles.teamSide, styles.teamSideRight]}>
          <Text style={[styles.teamName, styles.teamNameRight]} numberOfLines={1}>
            {match.awayTeam?.name}
          </Text>
          <TeamBadge team={match.awayTeam} size={compact ? 'sm' : 'md'} />
        </View>
      </View>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.75}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  cardCompact: {
    padding: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  competition: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.live + '22',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.full,
    gap: 4,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.live,
  },
  liveText: {
    color: colors.live,
    fontSize: 11,
    fontWeight: '800',
  },
  finishedText: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '600',
  },
  timeText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  teamsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  teamSide: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  teamSideRight: {
    justifyContent: 'flex-end',
  },
  teamName: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '600',
    flexShrink: 1,
  },
  teamNameRight: {
    textAlign: 'right',
  },
  scoreBox: {
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    minWidth: 72,
  },
  score: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 1,
  },
  scoreLive: {
    color: colors.live,
  },
  vs: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: '600',
  },
  dateLabel: {
    color: colors.textMuted,
    fontSize: 10,
    marginTop: 2,
  },
});
