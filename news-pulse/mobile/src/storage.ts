import AsyncStorage from '@react-native-async-storage/async-storage';
import type { SavedTeam, SavedTopic } from './types';

const TEAMS_KEY = '@pulse_foot_teams';
const TOPICS_KEY = '@pulse_foot_topics';
const PUSH_TOKEN_KEY = '@pulse_foot_push_token';

export async function getFavoriteTeams(): Promise<SavedTeam[]> {
  try {
    const raw = await AsyncStorage.getItem(TEAMS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function saveFavoriteTeam(teamId: string): Promise<SavedTeam[]> {
  const teams = await getFavoriteTeams();
  if (teams.some((t) => t.teamId === teamId)) return teams;

  const updated = [
    { teamId, addedAt: new Date().toISOString(), notificationsEnabled: true },
    ...teams,
  ];
  await AsyncStorage.setItem(TEAMS_KEY, JSON.stringify(updated));
  return updated;
}

export async function removeFavoriteTeam(teamId: string): Promise<SavedTeam[]> {
  const teams = await getFavoriteTeams();
  const updated = teams.filter((t) => t.teamId !== teamId);
  await AsyncStorage.setItem(TEAMS_KEY, JSON.stringify(updated));
  return updated;
}

export async function toggleTeamNotifications(teamId: string): Promise<SavedTeam[]> {
  const teams = await getFavoriteTeams();
  const updated = teams.map((t) =>
    t.teamId === teamId ? { ...t, notificationsEnabled: !t.notificationsEnabled } : t,
  );
  await AsyncStorage.setItem(TEAMS_KEY, JSON.stringify(updated));
  return updated;
}

export async function getSavedTopics(): Promise<SavedTopic[]> {
  try {
    const raw = await AsyncStorage.getItem(TOPICS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function saveTopics(topics: SavedTopic[]): Promise<void> {
  await AsyncStorage.setItem(TOPICS_KEY, JSON.stringify(topics));
}

export async function syncTopicsFromTeams(
  teams: { teamId: string; searchQuery: string; shortName: string; emoji: string }[],
  favorites: SavedTeam[],
): Promise<SavedTopic[]> {
  const topics: SavedTopic[] = teams.map((team) => {
    const fav = favorites.find((f) => f.teamId === team.teamId);
    return {
      query: team.searchQuery,
      label: team.shortName,
      emoji: team.emoji,
      teamId: team.teamId,
      addedAt: fav?.addedAt || new Date().toISOString(),
      notificationsEnabled: fav?.notificationsEnabled ?? true,
    };
  });
  await saveTopics(topics);
  return topics;
}

export async function getStoredPushToken(): Promise<string | null> {
  return AsyncStorage.getItem(PUSH_TOKEN_KEY);
}

export async function setStoredPushToken(token: string): Promise<void> {
  await AsyncStorage.setItem(PUSH_TOKEN_KEY, token);
}
