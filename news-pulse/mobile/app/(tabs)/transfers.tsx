import { useCallback, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Text,
} from 'react-native';
import { FootballNewsCard } from '../../src/components/FootballNewsCard';
import { getTransfers } from '../../src/api';
import type { NewsItem } from '../../src/types';
import { colors, spacing } from '../../src/theme';

export default function TransfersScreen() {
  const [articles, setArticles] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const data = await getTransfers();
      setArticles(data);
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
        <Text style={styles.loadingText}>Chargement du mercato…</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.banner}>
        <Text style={styles.bannerTitle}>🔁 Mercato</Text>
        <Text style={styles.bannerSub}>
          Transferts, rumeurs et officiels — résumés par IA
        </Text>
      </View>
      <FlatList
        data={articles}
        keyExtractor={(a) => a.id}
        renderItem={({ item }) => <FootballNewsCard item={item} />}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor={colors.primary} />
        }
        ListEmptyComponent={
          <Text style={styles.empty}>Aucune info mercato pour le moment.</Text>
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
  loadingText: {
    color: colors.textMuted,
    marginTop: spacing.md,
    fontSize: 14,
  },
  banner: {
    margin: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.transfer + '15',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.transfer + '33',
  },
  bannerTitle: {
    color: colors.transfer,
    fontSize: 18,
    fontWeight: '800',
  },
  bannerSub: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: 4,
  },
  list: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
  },
  empty: {
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
});
