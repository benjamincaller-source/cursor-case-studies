import Constants from 'expo-constants';
import { Platform } from 'react-native';
import type {
  SearchResult,
  Suggestion,
  SavedTopic,
  Team,
  Competition,
  Match,
  StandingRow,
  HeadlinesResponse,
  TeamDetail,
  NewsItem,
} from './types';

function getApiBaseUrl(): string {
  const envUrl = process.env.EXPO_PUBLIC_API_URL;
  if (envUrl) return envUrl.replace(/\/$/, '');

  const hostUri = Constants.expoConfig?.hostUri;
  if (hostUri) {
    const host = hostUri.split(':')[0];
    return `http://${host}:3001`;
  }

  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3001';
  }

  return 'http://localhost:3001';
}

const API_BASE = getApiBaseUrl();

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`);
  if (!response.ok) throw new Error(`API error: ${response.status}`);
  return response.json();
}

export async function searchNews(query: string, withSummary = true): Promise<SearchResult> {
  const params = new URLSearchParams({
    q: query,
    lang: 'fr',
    country: 'FR',
    ...(withSummary ? { summarize: 'true' } : {}),
  });
  return fetchJson(`/api/search?${params}`);
}

export async function getHeadlines(): Promise<HeadlinesResponse> {
  return fetchJson('/api/headlines?summarize=true');
}

export async function getTeams(): Promise<Team[]> {
  const data = await fetchJson<{ teams: Team[] }>('/api/teams');
  return data.teams;
}

export async function getCompetitions(): Promise<Competition[]> {
  const data = await fetchJson<{ competitions: Competition[] }>('/api/competitions');
  return data.competitions;
}

export async function getMatches(competition?: string, status?: string): Promise<Match[]> {
  const params = new URLSearchParams();
  if (competition) params.set('competition', competition);
  if (status) params.set('status', status);
  const data = await fetchJson<{ matches: Match[] }>(`/api/matches?${params}`);
  return data.matches;
}

export async function getLiveMatches(): Promise<Match[]> {
  const data = await fetchJson<{ matches: Match[] }>('/api/matches/live');
  return data.matches;
}

export async function getStandings(competitionId: string): Promise<StandingRow[]> {
  const data = await fetchJson<{ standings: StandingRow[] }>(`/api/standings/${competitionId}`);
  return data.standings;
}

export async function getTransfers(teamId?: string): Promise<NewsItem[]> {
  const params = new URLSearchParams({ summarize: 'true' });
  if (teamId) params.set('team', teamId);
  const data = await fetchJson<{ articles: NewsItem[] }>(`/api/transfers?${params}`);
  return data.articles;
}

export async function getTeamDetail(teamId: string): Promise<TeamDetail> {
  return fetchJson(`/api/teams/${teamId}`);
}

export async function getSuggestions(): Promise<Suggestion[]> {
  const data = await fetchJson<{ suggestions: Suggestion[] }>('/api/suggestions');
  return data.suggestions || [];
}

export async function checkHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(5000) });
    return response.ok;
  } catch {
    return false;
  }
}

export async function registerPushToken(
  token: string,
  topics: SavedTopic[],
): Promise<boolean> {
  const notifTopics = topics.filter((t) => t.notificationsEnabled !== false);
  const response = await fetch(`${API_BASE}/api/push/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      token,
      topics: notifTopics.map((t) => ({
        query: t.query,
        label: t.label,
        emoji: t.emoji,
      })),
    }),
  });
  return response.ok;
}

export async function unregisterPushToken(token: string): Promise<boolean> {
  const response = await fetch(`${API_BASE}/api/push/register`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token }),
  });
  return response.ok;
}

export { API_BASE };
