import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import type { NewsItem } from '../types';
import { TeamBadge } from './TeamBadge';
import { colors, radius, spacing } from '../theme';

interface FootballNewsCardProps {
  item: NewsItem;
  teamColor?: string;
}

function formatDate(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffHours = Math.floor((now.getTime() - date.getTime()) / 3600000);
  if (diffHours < 1) return 'À l\'instant';
  if (diffHours < 24) return `Il y a ${diffHours}h`;
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

export function FootballNewsCard({ item }: FootballNewsCardProps) {
  const isTransfer = item.category === 'transfer';

  const open = async () => {
    if (item.url) await WebBrowser.openBrowserAsync(item.url);
  };

  return (
    <TouchableOpacity style={styles.card} onPress={open} activeOpacity={0.75}>
      <View style={styles.topRow}>
        {isTransfer ? (
          <View style={styles.transferBadge}>
            <Text style={styles.transferText}>🔁 MERCATO</Text>
          </View>
        ) : (
          <View style={styles.newsBadge}>
            <Text style={styles.newsText}>📰 ACTU</Text>
          </View>
        )}
        <Text style={styles.date}>{formatDate(item.publishedAt)}</Text>
      </View>

      <Text style={styles.title} numberOfLines={3}>{item.title}</Text>

      {item.aiSummary ? (
        <View style={styles.summaryBox}>
          <Text style={styles.summaryLabel}>✨ Résumé IA</Text>
          <Text style={styles.summaryText} numberOfLines={3}>{item.aiSummary}</Text>
        </View>
      ) : item.description ? (
        <Text style={styles.description} numberOfLines={2}>{item.description}</Text>
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
    marginBottom: spacing.sm,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  transferBadge: {
    backgroundColor: colors.transfer + '22',
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.sm,
  },
  transferText: {
    color: colors.transfer,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  newsBadge: {
    backgroundColor: colors.primary + '22',
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.sm,
  },
  newsText: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  date: {
    color: colors.textMuted,
    fontSize: 11,
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
    fontSize: 13,
    lineHeight: 19,
    marginBottom: spacing.sm,
  },
  summaryBox: {
    backgroundColor: colors.primary + '10',
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
    borderRadius: radius.sm,
    padding: spacing.sm,
    marginBottom: spacing.sm,
  },
  summaryLabel: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: '800',
    marginBottom: 3,
    letterSpacing: 0.5,
  },
  summaryText: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  publisher: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '600',
  },
  link: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '700',
  },
});
