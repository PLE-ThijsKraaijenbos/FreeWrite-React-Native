import { useRouter } from 'expo-router';
import { View } from 'react-native';

import QuillIcon from '@/assets/icons/quill.svg';
import ShopIcon from '@/assets/icons/shop.svg';
import UserEditIcon from '@/assets/icons/user-edit.svg';
import { AvatarDisplay } from '@/components/AvatarDisplay';
import { CTALarge } from '@/components/cta';
import { ThemedText } from '@/components/themed-text';
import { toSvgUrl } from '@/lib/avatar';
import { useAuth } from '@/lib/auth-context';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();

  return (
    <View className="flex-1">
      <AvatarDisplay uri={toSvgUrl(user?.profile?.avatar_url)} />
      <View className="px-4 mt-6 gap-4">
        <ThemedText type="smallBold">{user?.profile?.coins ?? 0} coins</ThemedText>
        <CTALarge label="Pick up where you left off" gradient={1} icon={<QuillIcon color="#FAFAF8" width="100%" height="100%" />} onPress={() => router.push('/tabs/journey')} />
        <CTALarge label="Item shop" gradient={2} icon={<ShopIcon color="#FAFAF8" width="100%" height="100%" />} onPress={() => router.push('/shop')} />
        <CTALarge label="Edit avatar" gradient={3} icon={<UserEditIcon color="#FAFAF8" width="100%" height="100%" />} onPress={() => router.push('/avatar-editor')} />
      </View>
    </View>
  );
}
