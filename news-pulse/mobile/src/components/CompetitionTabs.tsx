import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import type { Competition } from '../types';
import { colors, radius, spacing } from '../theme';

interface CompetitionTabsProps {
  competitions: Competition[];
  selected: string;
  onSelect: (id: string) => void;
}

export function CompetitionTabs({ competitions, selected, onSelect }: CompetitionTabsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      <TouchableOpacity
        style={[styles.tab, selected === 'all' && styles.tabActive]}
        onPress={() => onSelect('all')}
      >
        <Text style={[styles.tabText, selected === 'all' && styles.tabTextActive]}>Tout</Text>
      </TouchableOpacity>
      {competitions.map((c) => (
        <TouchableOpacity
          key={c.id}
          style={[styles.tab, selected === c.id && styles.tabActive]}
          onPress={() => onSelect(c.id)}
        >
          <Text style={[styles.tabText, selected === c.id && styles.tabTextActive]}>
            {c.emoji} {c.name}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  tab: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: spacing.sm,
  },
  tabActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  tabText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#000',
    fontWeight: '800',
  },
});
