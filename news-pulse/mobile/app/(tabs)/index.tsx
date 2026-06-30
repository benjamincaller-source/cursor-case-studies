import { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MatchCard } from '../../src/components/MatchCard';
import { FootballNewsCard } from '../../src/components/FootballNewsCard';
import { StandingsTable } from '../../src/components/StandingsTable';
import { TeamCard } from '../../src/components/TeamCard';
import {
  getHeadlines,
  getTeams,
  getStandings,
  checkHealth,
} from '../../src/api';
import { getFavoriteTeams } from '../../src/storage';
import type { Match, NewsItem, StandingRow, Team } from '../../src/types';
import { colors, spacing, radius } from '../../src/theme';

export default function HomeScreen() {
  const router = useRouter();
  const [liveMatches, setLiveMatches] = useState<Match[]>([]);
  const [articles, setArticles] = useState<NewsItem[]>([]);
  const [standings, setStandings] = useState<StandingRow[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [apiOnline, setApiOnline] = useState(true);

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const [headlines, allTeams, ligue1, favs, online] = await Promise.all([
        getHeadlines(),
        getTeams(),
        getStandings('ligue1'),
        getFavoriteTeams(),
        checkHealth(),
      ]);
      setLiveMatches(headlines.liveMatches);
      setArticles(headlines.articles);
      setStandings(ligue1);
      setTeams(allTeams.slice(0, 8));
      setFavorites(favs.map((f) => f.teamId));
      setApiOnline(online);
    } catch {
      setApiOnline(false);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor={colors.primary} />
      }
    >
      {!apiOnline ? (
        <View style={styles.offline}>
          <Text style={styles.offlineText}>⚠️ Backend hors ligne — lancez le serveur sur le port 3001</Text>
        </View>
      ) : null}

      {liveMatches.length > 0 ? (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.liveHeader}>
              <View style={styles.liveDot} />
              <Text style={styles.sectionTitle}>En direct</Text>
            </View>
            <TouchableOpacity onPress={() => router.push('/(tabs)/matches')}>
              <Text style={styles.seeAll}>Tout voir →</Text>
            </TouchableOpacity>
          </View>
          {liveMatches.map((m) => (
            <MatchCard key={m.id} match={m} />
          ))}
        </View>
      ) : null}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Équipes populaires</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {teams.map((team) => (
            <TeamCard
              key={team.id}
              team={team}
              isFavorite={favorites.includes(team.id)}
              onPress={() => router.push(`/team/${team.id}`)}
            />
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>🇫🇷 Ligue 1 — Classement</Text>
        </View>
        <StandingsTable standings={standings} limit={5} />
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>À la une</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/transfers')}>
            <Text style={styles.seeAll}>Mercato →</Text>
          </TouchableOpacity>
        </View>
        {articles.map((article) => (
          <FootballNewsCard key={article.id} item={article} />
        ))}
      </View>
    </ScrollView>
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
  offline: {
    margin: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.live + '15',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.live + '33',
  },
  offlineText: {
    color: colors.live,
    fontSize: 13,
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '800',
  },
  liveHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.live,
  },
  seeAll: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '700',
  },
});
