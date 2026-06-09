import { Tabs } from 'expo-router';

import { Navigation, type TabKey } from '@/components/navigation';

export default function TabsLayout() {
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
