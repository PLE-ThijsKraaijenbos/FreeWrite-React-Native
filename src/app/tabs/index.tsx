import { useRouter } from 'expo-router';
import { View } from 'react-native';

import QuillIcon from '@/assets/icons/quill.svg';
import ShopIcon from '@/assets/icons/shop.svg';
import UserEditIcon from '@/assets/icons/user-edit.svg';
import { AvatarDisplay } from '@/components/AvatarDisplay';
import { CoinBalance } from '@/components/CoinBalance';
import { CTALarge } from '@/components/cta';
import { PageHeader } from '@/components/PageHeader';
import { useTheme } from '@/hooks/use-theme';
import { toSvgUrl } from '@/lib/avatar';
import { useAuth } from '@/lib/auth-context';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning,';
  if (hour < 18) return 'Good afternoon,';
  return 'Good evening,';
}

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const theme = useTheme();

  return (
    <View className="flex-1" style={{ backgroundColor: theme.background }}>
      <PageHeader absolute subtitle={getGreeting()} title={user?.profile?.name ?? ''} />
      <CoinBalance coins={user?.profile?.coins ?? 0} onPress={() => router.push('/shop')} />
      <AvatarDisplay uri={toSvgUrl(user?.profile?.avatar_url)} />
      <View className="px-4 mt-6 gap-4">
        <CTALarge label="Pick up where you left off" gradient={1} icon={<QuillIcon color="#FAFAF8" width="100%" height="100%" />} onPress={() => router.push('/tabs/journey?focus=available')} />
        <CTALarge label="Item shop" gradient={2} icon={<ShopIcon color="#FAFAF8" width="100%" height="100%" />} onPress={() => router.push('/shop')} />
        <CTALarge label="Edit avatar" gradient={3} icon={<UserEditIcon color="#FAFAF8" width="100%" height="100%" />} onPress={() => router.push('/avatar-editor')} />
      </View>
    </View>
  );
}
