import { View, Text, StyleSheet } from 'react-native';
import type { StandingRow } from '../types';
import { TeamBadge } from './TeamBadge';
import { colors, radius, spacing } from '../theme';

interface StandingsTableProps {
  standings: StandingRow[];
  limit?: number;
}

function FormDot({ result }: { result: string }) {
  const bg =
    result === 'W' ? colors.win : result === 'D' ? colors.draw : colors.loss;
  return <View style={[styles.formDot, { backgroundColor: bg }]} />;
}

export function StandingsTable({ standings, limit }: StandingsTableProps) {
  const rows = limit ? standings.slice(0, limit) : standings;

  return (
    <View style={styles.table}>
      <View style={styles.headerRow}>
        <Text style={[styles.headerCell, styles.rankCol]}>#</Text>
        <Text style={[styles.headerCell, styles.teamCol]}>Équipe</Text>
        <Text style={styles.headerCell}>J</Text>
        <Text style={styles.headerCell}>Pts</Text>
        <Text style={styles.headerCell}>Forme</Text>
      </View>
      {rows.map((row) => (
        <View key={row.teamId} style={styles.row}>
          <Text style={[styles.cell, styles.rankCol, row.rank <= 3 && styles.rankTop]}>
            {row.rank}
          </Text>
          <View style={[styles.teamCol, styles.teamCell]}>
            <TeamBadge team={row.team} size="sm" />
            <Text style={styles.teamName} numberOfLines={1}>{row.team.shortName}</Text>
          </View>
          <Text style={styles.cell}>{row.played}</Text>
          <Text style={[styles.cell, styles.points]}>{row.points}</Text>
          <View style={styles.formRow}>
            {row.form.map((f, i) => (
              <FormDot key={i} result={f} />
            ))}
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  table: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surfaceElevated,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerCell: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '700',
    width: 28,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border + '66',
  },
  cell: {
    color: colors.textSecondary,
    fontSize: 13,
    width: 28,
    textAlign: 'center',
  },
  rankCol: {
    width: 24,
  },
  rankTop: {
    color: colors.primary,
    fontWeight: '800',
  },
  teamCol: {
    flex: 1,
    width: undefined,
    textAlign: 'left',
  },
  teamCell: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  teamName: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
  points: {
    color: colors.text,
    fontWeight: '800',
  },
  formRow: {
    flexDirection: 'row',
    gap: 3,
    width: 50,
    justifyContent: 'flex-end',
  },
  formDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
