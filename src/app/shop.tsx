import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCallback, useMemo, useState } from 'react';

import { useAvatarItems } from '@/api/avatar-items';
import { AvatarDisplay } from '@/components/AvatarDisplay';
import { AvatarItemGrid, GridSection } from '@/components/AvatarItemGrid';
import { BackButton } from '@/components/BackButton';
import { CoinBalance } from '@/components/CoinBalance';
import { ThemedText } from '@/components/themed-text';
import { buildAvatarUrl, DISPLAY_CATEGORIES, prerequisiteHint, previewItemUrl } from '@/lib/avatar';
import { useTheme } from '@/hooks/use-theme';
import { useAuth } from '@/lib/auth-context';
import { AvatarItem } from '@/types/user';

export default function ShopScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { top } = useSafeAreaInsets();
  const { user } = useAuth();
  const { data: items = [], isLoading, refetch, isRefetching } = useAvatarItems();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  // The last-tapped item, previewed on the avatar in the pane above the grid.
  const [previewItem, setPreviewItem] = useState<AvatarItem | null>(null);

  const baseParams = useMemo(() => user?.profile?.avatar ?? {}, [user?.profile?.avatar]);

  const sections = useMemo<GridSection[]>(
    () =>
      DISPLAY_CATEGORIES.map((cat) => ({
        key: cat.id,
        title: cat.title,
        cards: items.filter(cat.match).map((item) => {
          const hint = prerequisiteHint(item.param_key, baseParams);
          return {
            item,
            uri: previewItemUrl(baseParams, item, { png: true, size: 128 }),
            hint,
            variant: 'shop' as const,
            disabled: item.is_unlocked || !!hint,
          };
        }),
      })).filter((s) => s.cards.length > 0),
    [items, baseParams]
  );

  const handlePress = useCallback(
    (item: AvatarItem) => {
      setPreviewItem(item);
      if (item.is_unlocked) return;
      router.push(`/unlock-item?itemId=${item.id}`);
    },
    [router]
  );

  return (
    <View className="flex-1" style={{ backgroundColor: theme.background }}>
      <AvatarDisplay
        uri={previewItem ? previewItemUrl(baseParams, previewItem) : buildAvatarUrl(baseParams)}
      />

      <View className="absolute left-4 z-10" style={{ top: top + 4 }}>
        <BackButton onPress={() => router.back()} />
      </View>

      <CoinBalance coins={user?.profile?.coins ?? 0} />

      {isLoading ? (
        <ThemedText className="text-center mt-12" themeColor="textSecondary">
          Loading...
        </ThemedText>
      ) : items.length === 0 ? (
        <ThemedText className="text-center mt-12" themeColor="textSecondary">
          No items available.
        </ThemedText>
      ) : (
        <AvatarItemGrid
          sections={sections}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          onPressItem={handlePress}
          baseParams={baseParams}
          refreshing={isRefetching}
          onRefresh={refetch}
        />
      )}
    </View>
  );
}
