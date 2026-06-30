import AsyncStorage from '@react-native-async-storage/async-storage';
import type { SavedTopic } from './types';

const TOPICS_KEY = '@news_pulse_topics';
const PUSH_TOKEN_KEY = '@news_pulse_push_token';

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

export async function saveTopic(topic: SavedTopic): Promise<SavedTopic[]> {
  const topics = await getSavedTopics();
  const exists = topics.some((t) => t.query.toLowerCase() === topic.query.toLowerCase());
  if (exists) return topics;

  const newTopic: SavedTopic = {
    ...topic,
    notificationsEnabled: topic.notificationsEnabled ?? true,
  };
  const updated = [newTopic, ...topics];
  await saveTopics(updated);
  return updated;
}

export async function removeTopic(query: string): Promise<SavedTopic[]> {
  const topics = await getSavedTopics();
  const updated = topics.filter((t) => t.query.toLowerCase() !== query.toLowerCase());
  await saveTopics(updated);
  return updated;
}

export async function toggleTopicNotifications(query: string): Promise<SavedTopic[]> {
  const topics = await getSavedTopics();
  const updated = topics.map((t) =>
    t.query.toLowerCase() === query.toLowerCase()
      ? { ...t, notificationsEnabled: !t.notificationsEnabled }
      : t,
  );
  await saveTopics(updated);
  return updated;
}

export async function getStoredPushToken(): Promise<string | null> {
  return AsyncStorage.getItem(PUSH_TOKEN_KEY);
}

export async function setStoredPushToken(token: string): Promise<void> {
  await AsyncStorage.setItem(PUSH_TOKEN_KEY, token);
}
