import { Redirect } from 'expo-router';

import { useAuth } from '@/lib/auth-context';

export default function Index() {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) return null;
  if (!isAuthenticated) return <Redirect href="/onboarding" />;
  if (!user?.profile) return <Redirect href="/onboarding/questions/substance" />;
  return <Redirect href="/tabs" />;
}
