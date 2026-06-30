import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import { colors } from '../../src/theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: '800', fontSize: 18 },
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 4,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '700' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Accueil',
          headerTitle: '⚽ Pulse Foot',
          tabBarIcon: ({ color }) => <TabIcon emoji="🏠" active={color === colors.primary} />,
        }}
      />
      <Tabs.Screen
        name="matches"
        options={{
          title: 'Matchs',
          headerTitle: 'Matchs',
          tabBarIcon: ({ color }) => <TabIcon emoji="📅" active={color === colors.primary} />,
        }}
      />
      <Tabs.Screen
        name="transfers"
        options={{
          title: 'Mercato',
          headerTitle: '🔁 Mercato',
          tabBarIcon: ({ color }) => <TabIcon emoji="🔁" active={color === colors.primary} />,
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Favoris',
          headerTitle: 'Mes équipes',
          tabBarIcon: ({ color }) => <TabIcon emoji="⭐" active={color === colors.primary} />,
        }}
      />
    </Tabs>
  );
}

function TabIcon({ emoji, active }: { emoji: string; active: boolean }) {
  return <Text style={{ fontSize: 20, opacity: active ? 1 : 0.45 }}>{emoji}</Text>;
}
