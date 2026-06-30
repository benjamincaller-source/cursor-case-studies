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
import { useLocalSearchParams, Stack } from 'expo-router';
import { MatchCard } from '../../src/components/MatchCard';
import { FootballNewsCard } from '../../src/components/FootballNewsCard';
import { TeamBadge } from '../../src/components/TeamBadge';
import { getTeamDetail, searchNews, getTeams } from '../../src/api';
import {
  getFavoriteTeams,
  saveFavoriteTeam,
  removeFavoriteTeam,
  syncTopicsFromTeams,
} from '../../src/storage';
import { syncPushSubscriptions } from '../../src/notifications';
import type { TeamDetail, NewsItem } from '../../src/types';
import { colors, spacing, radius } from '../../src/theme';

export default function TeamScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [detail, setDetail] = useState<TeamDetail | null>(null);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (isRefresh = false) => {
    if (!id) return;
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const [teamDetail, favs] = await Promise.all([
        getTeamDetail(id),
        getFavoriteTeams(),
      ]);
      const newsResult = await searchNews(teamDetail.team.searchQuery, true);
      setDetail(teamDetail);
      setNews(newsResult.articles.slice(0, 8));
      setIsFavorite(favs.some((f) => f.teamId === id));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const toggleFavorite = async () => {
    if (!detail) return;
    const updated = isFavorite
      ? await removeFavoriteTeam(detail.team.id)
      : await saveFavoriteTeam(detail.team.id);

    const teams = await getTeams();
    await syncTopicsFromTeams(
      updated.map((f) => {
        const t = teams.find((team) => team.id === f.teamId)!;
        return {
          teamId: t.id,
          searchQuery: t.searchQuery,
          shortName: t.shortName,
          emoji: t.emoji,
        };
      }),
      updated,
    );
    await syncPushSubscriptions();
    setIsFavorite(!isFavorite);
  };

  if (loading || !detail) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const { team, competition, matches, standing } = detail;

  return (
    <>
      <Stack.Screen
        options={{
          title: team.name,
          headerRight: () => (
            <TouchableOpacity onPress={toggleFavorite} style={styles.starBtn}>
              <Text style={styles.star}>{isFavorite ? '★' : '☆'}</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor={colors.primary} />
        }
      >
        <View style={[styles.hero, { backgroundColor: team.color + '33' }]}>
          <TeamBadge
            team={{ id: team.id, name: team.name, shortName: team.shortName, color: team.color, emoji: team.emoji }}
            size="lg"
          />
          <Text style={styles.heroName}>{team.name}</Text>
          <Text style={styles.heroLeague}>{competition.emoji} {competition.name}</Text>
          {standing ? (
            <View style={styles.rankBadge}>
              <Text style={styles.rankText}>{standing.rank}e · {standing.points} pts</Text>
            </View>
          ) : null}
        </View>

        {matches.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Matchs</Text>
            {matches.map((m) => (
              <MatchCard key={m.id} match={m} />
            ))}
          </View>
        ) : null}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actualités</Text>
          {news.map((article) => (
            <FootballNewsCard key={article.id} item={article} />
          ))}
        </View>
      </ScrollView>
    </>
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
  starBtn: {
    marginRight: spacing.md,
  },
  star: {
    fontSize: 22,
    color: colors.gold,
  },
  hero: {
    alignItems: 'center',
    padding: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  heroName: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '800',
    marginTop: spacing.md,
  },
  heroLeague: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: spacing.xs,
  },
  rankBadge: {
    marginTop: spacing.md,
    backgroundColor: colors.primary + '22',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
  },
  rankText: {
    color: colors.primary,
    fontWeight: '800',
    fontSize: 13,
  },
  section: {
    padding: spacing.md,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '800',
    marginBottom: spacing.md,
  },
});
