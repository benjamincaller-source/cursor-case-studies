import { useEffect } from 'react';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { colors } from '../src/theme';
import {
  addNotificationResponseListener,
  syncPushSubscriptions,
} from '../src/notifications';

export default function RootLayout() {
  const router = useRouter();

  useEffect(() => {
    syncPushSubscriptions();

    const subscription = addNotificationResponseListener((data) => {
      const query = data.query as string | undefined;
      const label = data.label as string | undefined;
      const emoji = data.emoji as string | undefined;

      if (query) {
        router.push({
          pathname: '/feed/[query]',
          params: { query, label: label || query, emoji: emoji || '📰' },
        });
      }
    });

    return () => subscription.remove();
  }, [router]);

  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerTitleStyle: { fontWeight: '700' },
          contentStyle: { backgroundColor: colors.background },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen
          name="feed/[query]"
          options={{
            title: 'Actualités',
            headerBackTitle: 'Retour',
          }}
        />
      </Stack>
    </>
  );
}
