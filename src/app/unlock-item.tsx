import { useLocalSearchParams, useRouter } from 'expo-router';
import { Alert, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAvatarItems, useEquipAvatarItem, useUnlockAvatarItem } from '@/api/avatar-items';
import { patchAvatarUrlApi } from '@/api/auth';
import { AvatarDisplay } from '@/components/AvatarDisplay';
import { BackButton } from '@/components/BackButton';
import CoinIcon from '@/assets/icons/coin.svg';
import { DoubleCTA } from '@/components/cta';
import { Divider } from '@/components/Divider';
import { ThemedText } from '@/components/themed-text';
import { applyItem, buildAvatarUrl, parseAvatarParams, previewItemUrl } from '@/lib/avatar';
import { useTheme } from '@/hooks/use-theme';
import { useAuth } from '@/lib/auth-context';

export default function UnlockItemScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { top, bottom } = useSafeAreaInsets();
  const { user, updateUser } = useAuth();
  const { itemId } = useLocalSearchParams<{ itemId: string }>();
  const { data: items = [] } = useAvatarItems();
  const { mutateAsync: unlock } = useUnlockAvatarItem();
  const { mutateAsync: equip } = useEquipAvatarItem();

  const item = items.find((i) => i.id === itemId);
  const baseUrl = user?.profile?.avatar_url;

  if (!item) return null;

  async function handleUnlock() {
    try {
      await unlock(item!.id);
      await equip(item!.id);
      const params = applyItem(parseAvatarParams(baseUrl ?? ''), item!);
      updateUser(await patchAvatarUrlApi(buildAvatarUrl(params)));
      router.back();
    } catch {
      Alert.alert('Purchase failed', "You don't have enough coins.");
    }
  }

  return (
    <View className="flex-1" style={{ backgroundColor: theme.background }}>
      <AvatarDisplay uri={previewItemUrl(baseUrl, item)} size="large" />

      <View className="absolute left-4 z-10" style={{ top: top + 4 }}>
        <BackButton onPress={() => router.back()} />
      </View>

      <View className="flex-1 px-4" style={{ paddingBottom: bottom + 16 }}>
        <View className="items-center">
          <ThemedText type="body-lg" className="mt-6 text-center max-w-[340px] text-neutral-600">
            Do you want to unlock <ThemedText type="body-lg-bold" className="text-neutral-600">{item.name}</ThemedText> for
          </ThemedText>
          <View className="mt-1 flex-row items-center gap-1">
            {item.price > 0 && <CoinIcon width={32} height={32} />}
            <ThemedText type="body-lg-bold" className="text-secondary-400">
              {item.price > 0 ? item.price : 'FREE'}
            </ThemedText>
          </View>

          <View className="my-6 w-full">
            <Divider />
          </View>

          <DoubleCTA
            leftLabel="Cancel"
            rightLabel="Unlock Item"
            onPressLeft={() => router.back()}
            onPressRight={handleUnlock}
          />
        </View>
      </View>
    </View>
  );
}
