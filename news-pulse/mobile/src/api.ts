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

const GITHUB_PAGES_BASE = '/cursor-case-studies';
const DEMO_API = `${GITHUB_PAGES_BASE}/demo-api`;

function isGitHubPages(): boolean {
  if (typeof window === 'undefined') return false;
  return window.location.hostname.includes('github.io');
}

function getBasePath(): string {
  if (isGitHubPages()) return GITHUB_PAGES_BASE;
  return '';
}

function getApiBaseUrl(): string {
  const envUrl = process.env.EXPO_PUBLIC_API_URL;
  if (envUrl !== undefined && envUrl !== null && envUrl !== '') {
    return envUrl.replace(/\/$/, '');
  }

  if (isGitHubPages()) {
    return '';
  }

  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin;
  }

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

async function fetchDemoJson<T>(file: string): Promise<T> {
  const response = await fetch(`${DEMO_API}/${file}`);
  if (!response.ok) throw new Error(`Demo API error: ${response.status}`);
  return response.json();
}

async function fetchJson<T>(path: string): Promise<T> {
  if (isGitHubPages()) {
    return fetchDemoForPath<T>(path);
  }

  try {
    const response = await fetch(`${API_BASE}${path}`);
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    return response.json();
  } catch {
    return fetchDemoForPath<T>(path);
  }
}

async function fetchDemoForPath<T>(path: string): Promise<T> {
  if (path.startsWith('/api/headlines')) return fetchDemoJson('headlines.json');
  if (path.startsWith('/api/teams/')) {
    const id = path.split('/').pop()?.split('?')[0];
    return fetchDemoJson(`team-${id}.json`);
  }
  if (path.startsWith('/api/teams')) return fetchDemoJson('teams.json');
  if (path.startsWith('/api/competitions')) return fetchDemoJson('competitions.json');
  if (path.startsWith('/api/matches/live')) return fetchDemoJson('matches-live.json');
  if (path.startsWith('/api/matches')) return fetchDemoJson('matches.json');
  if (path.includes('/api/standings/premier')) return fetchDemoJson('standings-premier.json');
  if (path.startsWith('/api/standings')) return fetchDemoJson('standings-ligue1.json');
  if (path.startsWith('/api/transfers')) return fetchDemoJson('transfers.json');
  if (path.startsWith('/api/suggestions')) return fetchDemoJson('suggestions.json');
  if (path.startsWith('/api/search')) {
    const data = await fetchDemoJson<HeadlinesResponse>('headlines.json');
    return {
      query: 'demo',
      total: data.articles.length,
      articles: data.articles,
      tweets: [],
      items: data.articles,
      sources: { google_news: data.articles.length, newsapi: 0, x: 0 },
    } as T;
  }
  if (path.startsWith('/health')) return fetchDemoJson('health.json');
  throw new Error(`No demo data for ${path}`);
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
  const data = await fetchJson<{ matches: Match[] }>('/api/matches');
  let matches = data.matches;
  if (competition) matches = matches.filter((m) => m.competitionId === competition);
  if (status) matches = matches.filter((m) => m.status === status.toUpperCase());
  return matches;
}

export async function getLiveMatches(): Promise<Match[]> {
  const data = await fetchJson<{ matches: Match[] }>('/api/matches/live');
  return data.matches;
}

export async function getStandings(competitionId: string): Promise<StandingRow[]> {
  const file = competitionId === 'premier' ? 'standings-premier.json' : 'standings-ligue1.json';
  const data = await fetchDemoJson<{ standings: StandingRow[] }>(file);
  return data.standings;
}

export async function getTransfers(teamId?: string): Promise<NewsItem[]> {
  const data = await fetchDemoJson<{ articles: NewsItem[] }>('transfers.json');
  if (teamId) return data.articles.filter((a) => a.teamId === teamId);
  return data.articles;
}

export async function getTeamDetail(teamId: string): Promise<TeamDetail> {
  return fetchDemoJson(`team-${teamId}.json`);
}

export async function getSuggestions(): Promise<Suggestion[]> {
  const data = await fetchJson<{ suggestions: Suggestion[] }>('/api/suggestions');
  return data.suggestions || [];
}

export async function checkHealth(): Promise<boolean> {
  try {
    if (isGitHubPages()) return true;
    const response = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(5000) });
    return response.ok;
  } catch {
    return isGitHubPages();
  }
}

export async function registerPushToken(
  token: string,
  topics: SavedTopic[],
): Promise<boolean> {
  if (isGitHubPages()) return false;
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
  if (isGitHubPages()) return false;
  const response = await fetch(`${API_BASE}/api/push/register`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token }),
  });
  return response.ok;
}

export { API_BASE, getBasePath };
