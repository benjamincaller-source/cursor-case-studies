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
      const teamId = data.teamId as string | undefined;
      const query = data.query as string | undefined;

      if (teamId) {
        router.push(`/team/${teamId}`);
      } else if (query) {
        router.push({
          pathname: '/feed/[query]',
          params: {
            query,
            label: (data.label as string) || query,
            emoji: (data.emoji as string) || '⚽',
          },
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
          headerTitleStyle: { fontWeight: '800' },
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="team/[id]" options={{ title: 'Équipe' }} />
        <Stack.Screen name="feed/[query]" options={{ title: 'Actualités' }} />
      </Stack>
    </>
  );
}
