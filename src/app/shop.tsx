import { useRouter } from 'expo-router';
import { Alert, Pressable, RefreshControl, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState } from 'react';

function chunk<T>(arr: T[], size: number): T[][] {
  const rows: T[][] = [];
  for (let i = 0; i < arr.length; i += size) rows.push(arr.slice(i, i + size));
  return rows;
}

import { useAvatarItems, useUnlockAvatarItem } from '@/api/avatar-items';
import { CategorySelect } from '@/components/CategorySelect';
import { ThemedText } from '@/components/themed-text';
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

export default function ShopScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { top } = useSafeAreaInsets();
  const { user } = useAuth();
  const { data: items = [], isLoading, refetch, isRefetching } = useAvatarItems();
  const { mutate: unlock } = useUnlockAvatarItem();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const allSections = Object.entries(CATEGORY_LABELS)
    .map(([param_key, title]) => ({
      key: param_key,
      title,
      items: items.filter((item) => item.param_key === param_key),
    }))
    .filter((s) => s.items.length > 0);

  const sections = selectedCategory
    ? allSections.filter((s) => s.key === selectedCategory)
    : allSections;

  function handlePress(item: AvatarItem) {
    if (item.is_unlocked) return;
    const message = item.price > 0
      ? `This item costs ${item.price} coins. You have ${user?.profile?.coins ?? 0} coins.`
      : 'This item is free.';
    Alert.alert(`Unlock ${item.name}?`, message, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Unlock',
        onPress: () => unlock(item.id, {
          onError: () => Alert.alert('Purchase failed', "You don't have enough coins."),
        }),
      },
    ]);
  }

  return (
    <View className="flex-1" style={{ backgroundColor: theme.background }}>
      <View className="px-4 pb-3 gap-2" style={{ paddingTop: top + 16 }}>
        <Pressable onPress={() => router.back()}>
          <ThemedText themeColor="textSecondary">← Back</ThemedText>
        </Pressable>
        <ThemedText type="subtitle">Item Shop</ThemedText>
      </View>

      <CategorySelect
        categories={allSections.map((s) => ({ id: s.key, label: s.title }))}
        selectedId={selectedCategory}
        onSelect={(id) => setSelectedCategory(id === selectedCategory ? null : id)}
      />

      {isLoading ? (
        <ThemedText className="text-center mt-12" themeColor="textSecondary">Loading...</ThemedText>
      ) : items.length === 0 ? (
        <ThemedText className="text-center mt-12" themeColor="textSecondary">No items available.</ThemedText>
      ) : (
        <ScrollView
          contentContainerStyle={{ paddingBottom: 32 }}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}>
          {sections.map((section) => (
            <View key={section.key}>
              <ThemedText type="smallBold" themeColor="textSecondary" className="px-4 mt-6 mb-2">
                {section.title.toUpperCase()}
              </ThemedText>
              {chunk(section.items, 2).map((row, i) => (
                <View key={i} className="flex-row w-full">
                  {row.map((item) => (
                    <ItemSquare key={item.id} item={item} onPress={() => handlePress(item)} />
                  ))}
                  {row.length === 1 && <View className="w-1/2" />}
                </View>
              ))}
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}


function ItemSquare({ item, onPress }: { item: AvatarItem; onPress: () => void }) {
  const theme = useTheme();
  return (
    <Pressable
      onPress={onPress}
      disabled={item.is_unlocked}
      className="w-1/2 aspect-square items-center justify-center p-2"
      style={({ pressed }) => ({
        backgroundColor: pressed ? theme.backgroundSelected : theme.backgroundElement,
        opacity: item.is_unlocked ? 0.4 : 1,
        borderWidth: 1,
        borderColor: theme.backgroundSelected,
      })}>
      <ThemedText type="small" className="text-center">{item.name}</ThemedText>
      {item.price > 0 && (
        <ThemedText type="small" themeColor="textSecondary">{item.price} coins</ThemedText>
      )}
    </Pressable>
  );
}
