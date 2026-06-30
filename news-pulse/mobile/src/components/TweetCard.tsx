import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import type { NewsItem } from '../types';
import { colors, radius, spacing } from '../theme';

interface TweetCardProps {
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

function formatCount(n?: number): string {
  if (!n) return '0';
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}

export function TweetCard({ item }: TweetCardProps) {
  const openTweet = async () => {
    if (item.url) {
      await WebBrowser.openBrowserAsync(item.url);
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={openTweet} activeOpacity={0.7}>
      <View style={styles.header}>
        <View style={styles.authorRow}>
          <View style={styles.xBadge}>
            <Text style={styles.xBadgeText}>𝕏</Text>
          </View>
          <View>
            <View style={styles.nameRow}>
              <Text style={styles.publisher}>{item.publisher}</Text>
              {item.verified ? <Text style={styles.verified}>✓</Text> : null}
            </View>
            <Text style={styles.handle}>{item.title}</Text>
          </View>
        </View>
        <Text style={styles.date}>{formatDate(item.publishedAt)}</Text>
      </View>
      <Text style={styles.tweetText}>{item.description}</Text>
      {item.metrics ? (
        <View style={styles.metrics}>
          <Text style={styles.metric}>💬 {formatCount(item.metrics.reply_count)}</Text>
          <Text style={styles.metric}>🔁 {formatCount(item.metrics.retweet_count)}</Text>
          <Text style={styles.metric}>❤️ {formatCount(item.metrics.like_count)}</Text>
        </View>
      ) : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.xBlue + '33',
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  xBadge: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    backgroundColor: colors.xBlue + '22',
    alignItems: 'center',
    justifyContent: 'center',
  },
  xBadgeText: {
    color: colors.xBlue,
    fontSize: 16,
    fontWeight: '700',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  publisher: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  verified: {
    color: colors.xBlue,
    fontSize: 12,
  },
  handle: {
    color: colors.textMuted,
    fontSize: 12,
  },
  date: {
    color: colors.textMuted,
    fontSize: 12,
  },
  tweetText: {
    color: colors.text,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: spacing.sm,
  },
  metrics: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  metric: {
    color: colors.textMuted,
    fontSize: 12,
  },
});
