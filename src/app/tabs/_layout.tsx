import { Redirect, Tabs } from 'expo-router';

import { Navigation, type TabKey } from '@/components/Navigation';
import { useAuth } from '@/lib/auth-context';

export default function TabsLayout() {
  const { isAuthenticated, isLoading, user } = useAuth();

  // Guard the protected area at its own boundary, not just at the `/` route:
  // a web refresh, deep link, or restored navigation state can land directly on
  // `/tabs` and bypass app/index.tsx. The tabs expect a profile to exist.
  if (isLoading) return null;
  if (!isAuthenticated) return <Redirect href="/onboarding" />;
  if (!user?.profile) return <Redirect href="/onboarding/questions/substance" />;

  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => (
        <Navigation
          activeTab={props.state.routes[props.state.index].name as TabKey}
          onTabPress={(tab) => props.navigation.navigate(tab)}
          variant="icon-only"
        />
      )}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="journey" options={{ title: 'Journey' }} />
      <Tabs.Screen name="community" options={{ title: 'Community' }} />
    </Tabs>
  );
}
