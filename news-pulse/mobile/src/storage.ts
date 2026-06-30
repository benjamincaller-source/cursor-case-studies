import AsyncStorage from '@react-native-async-storage/async-storage';
import type { SavedTopic } from './types';

const TOPICS_KEY = '@news_pulse_topics';

export async function getSavedTopics(): Promise<SavedTopic[]> {
  try {
    const raw = await AsyncStorage.getItem(TOPICS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function saveTopic(topic: SavedTopic): Promise<SavedTopic[]> {
  const topics = await getSavedTopics();
  const exists = topics.some((t) => t.query.toLowerCase() === topic.query.toLowerCase());
  if (exists) return topics;

  const updated = [topic, ...topics];
  await AsyncStorage.setItem(TOPICS_KEY, JSON.stringify(updated));
  return updated;
}

export async function removeTopic(query: string): Promise<SavedTopic[]> {
  const topics = await getSavedTopics();
  const updated = topics.filter((t) => t.query.toLowerCase() !== query.toLowerCase());
  await AsyncStorage.setItem(TOPICS_KEY, JSON.stringify(updated));
  return updated;
}
