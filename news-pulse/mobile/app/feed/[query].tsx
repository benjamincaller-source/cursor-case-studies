import { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NewsCard } from '../../src/components/NewsCard';
import { TweetCard } from '../../src/components/TweetCard';
import { searchNews } from '../../src/api';
import type { NewsItem, SearchResult } from '../../src/types';
import { colors, spacing, radius } from '../../src/theme';

type Filter = 'all' | 'articles' | 'tweets';

export default function FeedScreen() {
  const { query, label, emoji } = useLocalSearchParams<{
    query: string;
    label: string;
    emoji: string;
  }>();
  const navigation = useNavigation();
  const [result, setResult] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>('all');

  const decodedQuery = decodeURIComponent(query || '');

  useEffect(() => {
    navigation.setOptions({
      title: `${emoji || '📰'} ${label || decodedQuery}`,
    });
  }, [navigation, emoji, label, decodedQuery]);

  const fetchData = useCallback(async (isRefresh = false) => {
    if (!decodedQuery) return;
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const data = await searchNews(decodedQuery);
      setResult(data);
    } catch {
      setError('Impossible de charger les actualités. Vérifiez que le backend est lancé.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [decodedQuery]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredItems: NewsItem[] = (() => {
    if (!result) return [];
    if (filter === 'articles') return result.articles;
    if (filter === 'tweets') return result.tweets;
    return result.items;
  })();

  const renderItem = ({ item }: { item: NewsItem }) =>
    item.type === 'tweet' ? <TweetCard item={item} /> : <NewsCard item={item} />;

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Agrégation en cours…</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorEmoji}>😕</Text>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => fetchData()}>
          <Text style={styles.retryText}>Réessayer</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      {result ? (
        <View style={styles.statsBar}>
          <Text style={styles.statsText}>
            {result.total} résultat{result.total > 1 ? 's' : ''}
          </Text>
          <View style={styles.sourceCounts}>
            <Text style={styles.sourceCount}>🌐 {result.sources.google_news}</Text>
            <Text style={styles.sourceCount}>📰 {result.sources.newsapi}</Text>
            <Text style={styles.sourceCount}>𝕏 {result.sources.x}</Text>
          </View>
        </View>
      ) : null}

      <View style={styles.filters}>
        {(['all', 'articles', 'tweets'] as Filter[]).map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterBtn, filter === f && styles.filterBtnActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
              {f === 'all' ? 'Tout' : f === 'articles' ? '📰 Articles' : '𝕏 X'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchData(true)}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>🔍</Text>
            <Text style={styles.emptyText}>Aucun résultat pour ce sujet.</Text>
            {result && result.sources.x === 0 ? (
              <Text style={styles.emptyHint}>
                Pour activer X/Twitter, configurez X_BEARER_TOKEN dans le backend.
              </Text>
            ) : null}
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
  loadingText: {
    color: colors.textSecondary,
    marginTop: spacing.md,
    fontSize: 14,
  },
  errorEmoji: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  errorText: {
    color: colors.textSecondary,
    textAlign: 'center',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: spacing.lg,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
  },
  retryText: {
    color: colors.text,
    fontWeight: '700',
  },
  statsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  statsText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  sourceCounts: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  sourceCount: {
    color: colors.textMuted,
    fontSize: 11,
  },
  filters: {
    flexDirection: 'row',
    padding: spacing.md,
    gap: spacing.sm,
  },
  filterBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterBtnActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  filterTextActive: {
    color: colors.text,
  },
  list: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  empty: {
    alignItems: 'center',
    paddingTop: spacing.xl * 2,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 15,
  },
  emptyHint: {
    color: colors.textMuted,
    fontSize: 12,
    textAlign: 'center',
    marginTop: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
});
