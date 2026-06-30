import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import type { SavedTopic } from '../types';
import { colors, radius, spacing } from '../theme';

interface TopicChipProps {
  topic: SavedTopic;
  onPress: () => void;
  onLongPress?: () => void;
}

export function TopicChip({ topic, onPress, onLongPress }: TopicChipProps) {
  return (
    <TouchableOpacity
      style={styles.chip}
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.7}
    >
      <Text style={styles.emoji}>{topic.emoji}</Text>
      <Text style={styles.label} numberOfLines={1}>{topic.label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceHover,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  emoji: {
    fontSize: 16,
  },
  label: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
    maxWidth: 120,
  },
});
