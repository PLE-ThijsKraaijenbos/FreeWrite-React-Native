import { useRouter } from 'expo-router';
import { Alert, FlatList, RefreshControl, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCallback, useMemo, useState } from 'react';

function chunk<T>(arr: T[], size: number): T[][] {
  const rows: T[][] = [];
  for (let i = 0; i < arr.length; i += size) rows.push(arr.slice(i, i + size));
  return rows;
}

import { useAvatarItems, useUnlockAvatarItem } from '@/api/avatar-items';
import { AvatarDisplay } from '@/components/AvatarDisplay';
import { AvatarItemCard } from '@/components/AvatarItemCard';
import { BackButton } from '@/components/BackButton';
import { CategorySelect } from '@/components/CategorySelect';
import { ThemedText } from '@/components/themed-text';
import { previewItemUrl, toSvgUrl } from '@/lib/avatar';
import { useTheme } from '@/hooks/use-theme';
import { useAuth } from '@/lib/auth-context';
import { AvatarItem } from '@/types/user';

const CATEGORY_LABELS: Record<string, string> = {
  accessories: 'Accessories',
  accessoriesColor: 'Accessory Colors',
  clothing: 'Clothing',
  clothesColor: 'Clothing Colors',
  clothingGraphic: 'Clothing Graphics',
  eyebrows: 'Eyebrows',
  eyes: 'Eyes',
  facialHair: 'Facial Hair',
  facialHairColor: 'Facial Hair Colors',
  mouth: 'Mouths',
  top: 'Hats',
  hairColor: 'Hair Colors',
  hatColor: 'Hat Colors',
  skinColor: 'Skin Colors',
};

// One FlatList entry: either a section header or a row of up to two item cards.
type ShopRow =
  | { type: 'header'; key: string; title: string }
  | { type: 'items'; key: string; items: AvatarItem[] };

export default function ShopScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { top } = useSafeAreaInsets();
  const { user } = useAuth();
  const { data: items = [], isLoading, refetch, isRefetching } = useAvatarItems();
  const { mutate: unlock } = useUnlockAvatarItem();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  // The last-tapped item, previewed on the avatar in the pane above the grid.
  const [previewItem, setPreviewItem] = useState<AvatarItem | null>(null);

  const baseUrl = user?.profile?.avatar_url;

  const allSections = useMemo(
    () =>
      Object.entries(CATEGORY_LABELS)
        .map(([param_key, title]) => ({
          key: param_key,
          title,
          items: items.filter((item) => item.param_key === param_key),
        }))
        .filter((s) => s.items.length > 0),
    [items]
  );

  // Flatten the (optionally filtered) sections into a single list of rows so the
  // grid can be virtualised — only rows near the viewport mount and fetch images.
  const rows = useMemo<ShopRow[]>(() => {
    const sections = selectedCategory
      ? allSections.filter((s) => s.key === selectedCategory)
      : allSections;
    const result: ShopRow[] = [];
    for (const section of sections) {
      result.push({ type: 'header', key: `h:${section.key}`, title: section.title });
      chunk(section.items, 2).forEach((rowItems, i) =>
        result.push({ type: 'items', key: `r:${section.key}:${i}`, items: rowItems })
      );
    }
    return result;
  }, [allSections, selectedCategory]);

  const handlePress = useCallback(
    (item: AvatarItem) => {
      setPreviewItem(item);
      if (item.is_unlocked) return;
      const message =
        item.price > 0
          ? `This item costs ${item.price} coins. You have ${user?.profile?.coins ?? 0} coins.`
          : 'This item is free.';
      Alert.alert(`Unlock ${item.name}?`, message, [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Unlock',
          onPress: () =>
            unlock(item.id, {
              onError: () => Alert.alert('Purchase failed', "You don't have enough coins."),
            }),
        },
      ]);
    },
    [unlock, user?.profile?.coins]
  );

  const renderRow = useCallback(
    ({ item: row }: { item: ShopRow }) => {
      if (row.type === 'header') {
        return (
          <ThemedText type="smallBold" themeColor="textSecondary" className="px-4 mt-6 mb-2">
            {row.title.toUpperCase()}
          </ThemedText>
        );
      }
      return (
        <View className="flex-row w-full">
          {row.items.map((item) => (
            <AvatarItemCard key={item.id} item={item} baseUrl={baseUrl} onPress={handlePress} />
          ))}
          {row.items.length === 1 && <View className="w-1/2" />}
        </View>
      );
    },
    [baseUrl, handlePress]
  );

  return (
    <View className="flex-1" style={{ backgroundColor: theme.background }}>
      <AvatarDisplay
        uri={previewItem ? previewItemUrl(baseUrl, previewItem) : toSvgUrl(baseUrl)}
      />

      <View className="absolute left-4 z-10" style={{ top: top + 16 }}>
        <BackButton onPress={() => router.back()} />
      </View>

      <CategorySelect
        categories={allSections.map((s) => ({ id: s.key, label: s.title }))}
        selectedId={selectedCategory}
        onSelect={(id) => setSelectedCategory(id === selectedCategory ? null : id)}
      />

      {isLoading ? (
        <ThemedText className="text-center mt-12" themeColor="textSecondary">
          Loading...
        </ThemedText>
      ) : items.length === 0 ? (
        <ThemedText className="text-center mt-12" themeColor="textSecondary">
          No items available.
        </ThemedText>
      ) : (
        <FlatList
          style={{ flex: 1 }}
          data={rows}
          keyExtractor={(row) => row.key}
          renderItem={renderRow}
          contentContainerStyle={{ paddingBottom: 32 }}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
          removeClippedSubviews
          initialNumToRender={6}
          maxToRenderPerBatch={6}
          windowSize={7}
        />
      )}
    </View>
  );
}
