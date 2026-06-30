import { useCallback, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Text,
} from 'react-native';
import { MatchCard } from '../../src/components/MatchCard';
import { CompetitionTabs } from '../../src/components/CompetitionTabs';
import { getMatches, getCompetitions } from '../../src/api';
import type { Match, Competition } from '../../src/types';
import { colors, spacing } from '../../src/theme';

export default function MatchesScreen() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [selected, setSelected] = useState('all');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const [comps, allMatches] = await Promise.all([
        getCompetitions(),
        getMatches(selected === 'all' ? undefined : selected),
      ]);
      setCompetitions(comps);
      setMatches(allMatches);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selected]);

  useEffect(() => {
    load();
  }, [load]);

  const liveCount = matches.filter((m) => m.status === 'LIVE').length;

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CompetitionTabs
        competitions={competitions}
        selected={selected}
        onSelect={setSelected}
      />
      {liveCount > 0 ? (
        <View style={styles.liveBanner}>
          <Text style={styles.liveBannerText}>🔴 {liveCount} match{liveCount > 1 ? 's' : ''} en direct</Text>
        </View>
      ) : null}
      <FlatList
        data={matches}
        keyExtractor={(m) => m.id}
        renderItem={({ item }) => <MatchCard match={item} />}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor={colors.primary} />
        }
        ListEmptyComponent={
          <Text style={styles.empty}>Aucun match pour cette compétition.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  liveBanner: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    padding: spacing.sm,
    backgroundColor: colors.live + '15',
    borderRadius: 8,
    alignItems: 'center',
  },
  liveBannerText: {
    color: colors.live,
    fontWeight: '700',
    fontSize: 13,
  },
  list: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  empty: {
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.xl,
    fontSize: 14,
  },
});
