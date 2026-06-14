import { useRouter } from 'expo-router';

import { Navigation, type TabKey } from '@/components/Navigation';

const TAB_ROUTES: Record<TabKey, '/tabs' | '/tabs/journey' | '/tabs/community'> = {
  index: '/tabs',
  journey: '/tabs/journey',
  community: '/tabs/community',
};

export function AppTabBar() {
  const router = useRouter();

  return (
    <Navigation
      activeTab={null}
      onTabPress={(tab) => router.navigate(TAB_ROUTES[tab])}
      variant="icon-only"
    />
  );
}
