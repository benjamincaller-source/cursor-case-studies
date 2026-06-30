import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import type { SavedTopic } from '../types';
import { colors, radius, spacing } from '../theme';

interface TopicChipProps {
  topic: SavedTopic;
  onPress: () => void;
  onLongPress?: () => void;
  onToggleNotifications?: () => void;
}

export function TopicChip({ topic, onPress, onLongPress, onToggleNotifications }: TopicChipProps) {
  const notifEnabled = topic.notificationsEnabled !== false;

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        style={styles.chip}
        onPress={onPress}
        onLongPress={onLongPress}
        activeOpacity={0.7}
      >
        <Text style={styles.emoji}>{topic.emoji}</Text>
        <Text style={styles.label} numberOfLines={1}>{topic.label}</Text>
      </TouchableOpacity>
      {onToggleNotifications ? (
        <TouchableOpacity
          style={[styles.notifBtn, notifEnabled && styles.notifBtnActive]}
          onPress={onToggleNotifications}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={styles.notifIcon}>{notifEnabled ? '🔔' : '🔕'}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
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
  notifBtn: {
    marginLeft: -spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.full,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  notifBtnActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '22',
  },
  notifIcon: {
    fontSize: 12,
  },
});
