import { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SearchBar } from '../src/components/SearchBar';
import { TopicChip } from '../src/components/TopicChip';
import { getSuggestions, checkHealth } from '../src/api';
import {
  getSavedTopics,
  saveTopic,
  removeTopic,
  toggleTopicNotifications,
} from '../src/storage';
import { syncPushSubscriptions } from '../src/notifications';
import type { SavedTopic, Suggestion } from '../src/types';
import { colors, spacing, radius } from '../src/theme';

export default function HomeScreen() {
  const router = useRouter();
  const [topics, setTopics] = useState<SavedTopic[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [apiOnline, setApiOnline] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [pushEnabled, setPushEnabled] = useState(true);

  const loadData = useCallback(async () => {
    const [saved, sugg, online] = await Promise.all([
      getSavedTopics(),
      getSuggestions(),
      checkHealth(),
    ]);
    setTopics(saved);
    setSuggestions(sugg);
    setApiOnline(online);
  }, []);

  useEffect(() => {
    loadData();
    if (pushEnabled) {
      syncPushSubscriptions();
    }
  }, [loadData, pushEnabled]);

  const navigateToFeed = (query: string, label?: string, emoji?: string) => {
    router.push({
      pathname: '/feed/[query]',
      params: { query, label: label || query, emoji: emoji || '📰' },
    });
  };

  const handleSearch = async (query: string) => {
    setLoading(true);
    const topic: SavedTopic = {
      query,
      label: query.length > 20 ? query.slice(0, 20) + '…' : query,
      emoji: '📰',
      addedAt: new Date().toISOString(),
      notificationsEnabled: pushEnabled,
    };
    const updated = await saveTopic(topic);
    setTopics(updated);
    if (pushEnabled) await syncPushSubscriptions();
    setLoading(false);
    navigateToFeed(query, topic.label, topic.emoji);
  };

  const handleSuggestion = async (suggestion: Suggestion) => {
    const topic: SavedTopic = {
      query: suggestion.query,
      label: suggestion.label,
      emoji: suggestion.emoji,
      addedAt: new Date().toISOString(),
      notificationsEnabled: pushEnabled,
    };
    const updated = await saveTopic(topic);
    setTopics(updated);
    if (pushEnabled) await syncPushSubscriptions();
    navigateToFeed(suggestion.query, suggestion.label, suggestion.emoji);
  };

  const handleRemoveTopic = (topic: SavedTopic) => {
    Alert.alert(
      'Supprimer le sujet',
      `Retirer « ${topic.label} » de vos sujets suivis ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            const updated = await removeTopic(topic.query);
            setTopics(updated);
            if (pushEnabled) await syncPushSubscriptions();
          },
        },
      ],
    );
  };

  const handleToggleTopicNotif = async (topic: SavedTopic) => {
    const updated = await toggleTopicNotifications(topic.query);
    setTopics(updated);
    if (pushEnabled) await syncPushSubscriptions();
  };

  const handlePushToggle = async (value: boolean) => {
    setPushEnabled(value);
    if (value) {
      const ok = await syncPushSubscriptions();
      if (!ok) {
        Alert.alert(
          'Notifications',
          'Activez les notifications dans les réglages de votre appareil pour recevoir les alertes.',
        );
      }
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.hero}>
          <Text style={styles.logo}>📡</Text>
          <Text style={styles.title}>News Pulse</Text>
          <Text style={styles.subtitle}>
            Toutes les actualités sur vos sujets, du web à X
          </Text>
        </View>

        {apiOnline === false ? (
          <View style={styles.offlineBanner}>
            <Text style={styles.offlineText}>
              ⚠️ API hors ligne — lancez le backend sur le port 3001
            </Text>
          </View>
        ) : null}

        <View style={styles.pushCard}>
          <View style={styles.pushRow}>
            <Text style={styles.pushIcon}>🔔</Text>
            <View style={styles.pushText}>
              <Text style={styles.pushTitle}>Alertes nouveaux articles</Text>
              <Text style={styles.pushSubtitle}>
                Notification push quand un nouveau article est publié
              </Text>
            </View>
            <Switch
              value={pushEnabled}
              onValueChange={handlePushToggle}
              trackColor={{ false: colors.border, true: colors.primary + '88' }}
              thumbColor={pushEnabled ? colors.primary : colors.textMuted}
            />
          </View>
        </View>

        <SearchBar onSearch={handleSearch} loading={loading} />

        {topics.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Mes sujets</Text>
            <View style={styles.chipRow}>
              {topics.map((topic) => (
                <TopicChip
                  key={topic.query}
                  topic={topic}
                  onPress={() => navigateToFeed(topic.query, topic.label, topic.emoji)}
                  onLongPress={() => handleRemoveTopic(topic)}
                  onToggleNotifications={() => handleToggleTopicNotif(topic)}
                />
              ))}
            </View>
            <Text style={styles.hint}>
              Appui long pour supprimer · 🔔 pour activer/désactiver les alertes
            </Text>
          </View>
        ) : null}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Suggestions</Text>
          {suggestions.map((suggestion) => (
            <TouchableOpacity
              key={suggestion.query}
              style={styles.suggestionCard}
              onPress={() => handleSuggestion(suggestion)}
              activeOpacity={0.7}
            >
              <Text style={styles.suggestionEmoji}>{suggestion.emoji}</Text>
              <View style={styles.suggestionText}>
                <Text style={styles.suggestionLabel}>{suggestion.label}</Text>
                <Text style={styles.suggestionQuery}>{suggestion.query}</Text>
              </View>
              <Text style={styles.suggestionArrow}>→</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.sourcesInfo}>
          <Text style={styles.sourcesTitle}>Fonctionnalités</Text>
          <View style={styles.sourceRow}>
            <Text style={styles.sourceBadge}>🌐 Google News</Text>
            <Text style={styles.sourceBadge}>📰 NewsAPI</Text>
            <Text style={styles.sourceBadge}>𝕏 X / Twitter</Text>
            <Text style={styles.sourceBadge}>✨ Résumés IA</Text>
            <Text style={styles.sourceBadge}>🔔 Push</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    padding: spacing.lg,
    paddingBottom: spacing.xl * 2,
  },
  hero: {
    alignItems: 'center',
    marginBottom: spacing.lg,
    marginTop: spacing.lg,
  },
  logo: {
    fontSize: 48,
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
    lineHeight: 22,
  },
  offlineBanner: {
    backgroundColor: colors.danger + '22',
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.danger + '44',
  },
  offlineText: {
    color: colors.danger,
    fontSize: 13,
    textAlign: 'center',
  },
  pushCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  pushRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  pushIcon: {
    fontSize: 24,
  },
  pushText: {
    flex: 1,
  },
  pushTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  pushSubtitle: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  section: {
    marginTop: spacing.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.md,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  hint: {
    color: colors.textMuted,
    fontSize: 11,
    marginTop: spacing.xs,
  },
  suggestionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.sm,
    gap: spacing.md,
  },
  suggestionEmoji: {
    fontSize: 28,
  },
  suggestionText: {
    flex: 1,
  },
  suggestionLabel: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  suggestionQuery: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  suggestionArrow: {
    color: colors.primaryLight,
    fontSize: 18,
    fontWeight: '700',
  },
  sourcesInfo: {
    marginTop: spacing.xl,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sourcesTitle: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  sourceRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  sourceBadge: {
    color: colors.textMuted,
    fontSize: 12,
    backgroundColor: colors.surfaceHover,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.sm,
    overflow: 'hidden',
  },
});
