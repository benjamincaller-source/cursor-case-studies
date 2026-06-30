import { Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { registerPushToken, unregisterPushToken } from './api';
import { getSavedTopics, getStoredPushToken, setStoredPushToken } from './storage';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function setupNotificationChannel(): Promise<void> {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('news', {
      name: 'Actualités',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#6C5CE7',
    });
  }
}

export async function requestPushPermissions(): Promise<boolean> {
  if (!Device.isDevice) {
    console.log('[Push] Simulateur — notifications non disponibles');
    return false;
  }

  const { status: existing } = await Notifications.getPermissionsAsync();
  let finalStatus = existing;

  if (existing !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  return finalStatus === 'granted';
}

export async function getExpoPushToken(): Promise<string | null> {
  if (!Device.isDevice) return null;

  const projectId =
    Constants.expoConfig?.extra?.eas?.projectId ??
    Constants.easConfig?.projectId;

  try {
    const tokenData = await Notifications.getExpoPushTokenAsync(
      projectId ? { projectId } : undefined,
    );
    return tokenData.data;
  } catch (error) {
    console.error('[Push] Token error:', error);
    return null;
  }
}

export async function syncPushSubscriptions(): Promise<boolean> {
  const granted = await requestPushPermissions();
  if (!granted) return false;

  await setupNotificationChannel();

  let token = await getStoredPushToken();
  if (!token) {
    token = await getExpoPushToken();
    if (!token) return false;
    await setStoredPushToken(token);
  }

  const topics = await getSavedTopics();
  return registerPushToken(token, topics);
}

export async function disablePushNotifications(): Promise<void> {
  const token = await getStoredPushToken();
  if (token) {
    await unregisterPushToken(token);
  }
}

export function addNotificationResponseListener(
  callback: (data: Record<string, unknown>) => void,
): Notifications.EventSubscription {
  return Notifications.addNotificationResponseReceivedListener((response) => {
    const data = response.notification.request.content.data;
    callback(data as Record<string, unknown>);
  });
}

export function addNotificationReceivedListener(
  callback: (notification: Notifications.Notification) => void,
): Notifications.EventSubscription {
  return Notifications.addNotificationReceivedListener(callback);
}
