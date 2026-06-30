import { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { TeamCard } from '../../src/components/TeamCard';
import { getTeams } from '../../src/api';
import {
  getFavoriteTeams,
  saveFavoriteTeam,
  removeFavoriteTeam,
  toggleTeamNotifications,
  syncTopicsFromTeams,
} from '../../src/storage';
import { syncPushSubscriptions } from '../../src/notifications';
import type { Team, SavedTeam } from '../../src/types';
import { colors, spacing, radius } from '../../src/theme';

export default function FavoritesScreen() {
  const router = useRouter();
  const [allTeams, setAllTeams] = useState<Team[]>([]);
  const [favorites, setFavorites] = useState<SavedTeam[]>([]);
  const [pushEnabled, setPushEnabled] = useState(true);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const [teams, favs] = await Promise.all([getTeams(), getFavoriteTeams()]);
    setAllTeams(teams);
    setFavorites(favs);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const favIds = favorites.map((f) => f.teamId);
  const favoriteTeams = allTeams.filter((t) => favIds.includes(t.id));
  const otherTeams = allTeams.filter((t) => !favIds.includes(t.id));

  const syncPush = async (favs: SavedTeam[]) => {
    const topics = await syncTopicsFromTeams(
      favs.map((f) => {
        const team = allTeams.find((t) => t.id === f.teamId)!;
        return {
          teamId: team.id,
          searchQuery: team.searchQuery,
          shortName: team.shortName,
          emoji: team.emoji,
        };
      }),
      favs,
    );
    if (pushEnabled) await syncPushSubscriptions();
    return topics;
  };

  const handleToggleFavorite = async (team: Team) => {
    const isFav = favIds.includes(team.id);
    const updated = isFav
      ? await removeFavoriteTeam(team.id)
      : await saveFavoriteTeam(team.id);
    setFavorites(updated);
    await syncPush(updated);
  };

  const handleToggleNotif = async (teamId: string) => {
    const updated = await toggleTeamNotifications(teamId);
    setFavorites(updated);
    await syncPush(updated);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.pushCard}>
        <Text style={styles.pushTitle}>🔔 Alertes matchs & mercato</Text>
        <Text style={styles.pushSub}>Notifications pour vos équipes favorites</Text>
        <Switch
          value={pushEnabled}
          onValueChange={async (v) => {
            setPushEnabled(v);
            if (v) await syncPushSubscriptions();
          }}
          trackColor={{ false: colors.border, true: colors.primary + '88' }}
          thumbColor={pushEnabled ? colors.primary : colors.textMuted}
        />
      </View>

      {favoriteTeams.length > 0 ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⭐ Mes équipes ({favoriteTeams.length})</Text>
          <View style={styles.grid}>
            {favoriteTeams.map((team) => {
              const fav = favorites.find((f) => f.teamId === team.id);
              const notifOn = fav?.notificationsEnabled !== false;
              return (
                <View key={team.id} style={styles.favItem}>
                  <TeamCard
                    team={team}
                    onPress={() => router.push(`/team/${team.id}`)}
                    onToggleFavorite={() => handleToggleFavorite(team)}
                    isFavorite
                  />
                  <TouchableOpacity
                    style={styles.notifToggle}
                    onPress={() => handleToggleNotif(team.id)}
                  >
                    <Text style={styles.notifIcon}>{notifOn ? '🔔' : '🔕'}</Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        </View>
      ) : (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyEmoji}>⭐</Text>
          <Text style={styles.emptyTitle}>Aucune équipe favorite</Text>
          <Text style={styles.emptySub}>
            Appuyez sur ☆ pour suivre une équipe et recevoir ses actus
          </Text>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Toutes les équipes</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {otherTeams.map((team) => (
            <TeamCard
              key={team.id}
              team={team}
              onPress={() => router.push(`/team/${team.id}`)}
              onToggleFavorite={() => handleToggleFavorite(team)}
              isFavorite={false}
            />
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.md,
    paddingBottom: spacing.xl * 2,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  pushCard: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  pushTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
    flex: 1,
  },
  pushSub: {
    color: colors.textMuted,
    fontSize: 12,
    width: '100%',
    marginBottom: spacing.xs,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '800',
    marginBottom: spacing.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  favItem: {
    position: 'relative',
  },
  notifToggle: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: colors.surfaceElevated,
    borderRadius: radius.full,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifIcon: {
    fontSize: 12,
  },
  emptyBox: {
    alignItems: 'center',
    padding: spacing.xl,
    marginBottom: spacing.lg,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  emptySub: {
    color: colors.textMuted,
    fontSize: 13,
    textAlign: 'center',
    marginTop: spacing.sm,
    lineHeight: 20,
  },
});
