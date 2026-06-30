import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import type { NewsItem } from '../types';
import { colors, radius, spacing } from '../theme';

interface NewsCardProps {
  item: NewsItem;
}

function formatDate(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffHours < 1) return 'À l\'instant';
  if (diffHours < 24) return `Il y a ${diffHours}h`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `Il y a ${diffDays}j`;
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

export function NewsCard({ item }: NewsCardProps) {
  const openArticle = async () => {
    if (item.url) {
      await WebBrowser.openBrowserAsync(item.url);
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={openArticle} activeOpacity={0.7}>
      <View style={styles.header}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>📰 Article</Text>
        </View>
        <Text style={styles.date}>{formatDate(item.publishedAt)}</Text>
      </View>
      <Text style={styles.title} numberOfLines={3}>{item.title}</Text>
      {item.description ? (
        <Text style={styles.description} numberOfLines={3}>{item.description}</Text>
      ) : null}
      <View style={styles.footer}>
        <Text style={styles.publisher}>{item.publisher}</Text>
        <Text style={styles.link}>Lire →</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  badge: {
    backgroundColor: colors.articleGreen + '22',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.sm,
  },
  badgeText: {
    color: colors.articleGreen,
    fontSize: 12,
    fontWeight: '600',
  },
  date: {
    color: colors.textMuted,
    fontSize: 12,
  },
  title: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
    marginBottom: spacing.sm,
  },
  description: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  publisher: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '500',
  },
  link: {
    color: colors.primaryLight,
    fontSize: 13,
    fontWeight: '600',
  },
});
