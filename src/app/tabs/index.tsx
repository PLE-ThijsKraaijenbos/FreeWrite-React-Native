import { Image } from 'expo-image';
import { View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuth } from '@/lib/auth-context';

export default function HomeScreen() {
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
    </View>
  );
}
