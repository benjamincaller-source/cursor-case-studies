import Constants from 'expo-constants';
import { Platform } from 'react-native';
import type { SearchResult, Suggestion, SavedTopic } from './types';

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

export async function searchNews(query: string, withSummary = true): Promise<SearchResult> {
  const params = new URLSearchParams({
    q: query,
    lang: 'fr',
    country: 'FR',
    ...(withSummary ? { summarize: 'true' } : {}),
  });
  const response = await fetch(`${API_BASE}/api/search?${params}`);

  if (!response.ok) {
    throw new Error('Impossible de récupérer les actualités.');
  }

  return response.json();
}

export async function getSuggestions(): Promise<Suggestion[]> {
  const response = await fetch(`${API_BASE}/api/suggestions`);
  if (!response.ok) return [];
  const data = await response.json();
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
