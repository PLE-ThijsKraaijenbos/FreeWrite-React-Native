import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CTA } from '@/components/cta';
import { useAuth } from '@/lib/auth-context';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { height } = useWindowDimensions();
  const { top } = useSafeAreaInsets();
  const avatarSize = height / 3;
  const rawUrl = user?.profile?.avatar_url;
  const avatarUrl = rawUrl?.replace('/png', '/svg');

  return (
    <View className="flex-1">
      <View className="items-center" style={{ paddingTop: top + 16 }}>
        <Image
          source={avatarUrl ? { uri: avatarUrl } : null}
          style={{ width: avatarSize, height: avatarSize }}
          contentFit="contain"
        />
      </View>
      <View className="px-4 mt-6 gap-4">
        <CTA label="Pick up where you left off" onPress={() => router.push('/tabs/journey')} />
        <CTA label="Item shop" onPress={() => router.push('/shop')} />
        <CTA label="Edit avatar" onPress={() => router.push('/avatar-editor')} />
      </View>
    </View>
  );
}
