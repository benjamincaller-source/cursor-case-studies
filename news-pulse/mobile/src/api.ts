import Constants from 'expo-constants';
import { Platform } from 'react-native';
import type { SearchResult, Suggestion } from './types';

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

export async function searchNews(query: string): Promise<SearchResult> {
  const params = new URLSearchParams({ q: query, lang: 'fr', country: 'FR' });
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

export { API_BASE };
