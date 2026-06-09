import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import QuillIcon from '@/assets/icons/quill.svg';
import ShopIcon from '@/assets/icons/shop.svg';
import UserEditIcon from '@/assets/icons/user-edit.svg';
import { CTALarge } from '@/components/cta';
import { ThemedText } from '@/components/themed-text';
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
        <ThemedText type="smallBold">{user?.profile?.coins ?? 0} coins</ThemedText>
        <CTALarge label="Pick up where you left off" gradient={1} icon={<QuillIcon color="#FAFAF8" width="100%" height="100%" />} onPress={() => router.push('/tabs/journey')} />
        <CTALarge label="Item shop" gradient={2} icon={<ShopIcon color="#FAFAF8" width="100%" height="100%" />} onPress={() => router.push('/shop')} />
        <CTALarge label="Edit avatar" gradient={3} icon={<UserEditIcon color="#FAFAF8" width="100%" height="100%" />} onPress={() => router.push('/avatar-editor')} />
      </View>
    </View>
  );
}
