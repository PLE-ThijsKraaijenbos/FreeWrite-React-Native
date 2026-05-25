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
import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';
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
    Alert.alert(`Unlock ${item.name}?`, 'This item is free.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Unlock', onPress: () => unlock(item.id) },
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

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ flexGrow: 0, flexShrink: 0, height: 44 }}
        contentContainerStyle={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, columnGap: 8, paddingBottom: 8 }}>
        <CategoryChip
          label="All"
          selected={selectedCategory === null}
          onPress={() => setSelectedCategory(null)}
        />
        {allSections.map((s) => (
          <CategoryChip
            key={s.key}
            label={s.title}
            selected={selectedCategory === s.key}
            onPress={() => setSelectedCategory(selectedCategory === s.key ? null : s.key)}
          />
        ))}
      </ScrollView>

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

function CategoryChip({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  const theme = useTheme();
  return (
    <Pressable
      onPress={onPress}
      className="py-1.5 px-3.5 rounded-full"
      style={{ backgroundColor: selected ? theme.backgroundSelected : theme.backgroundElement }}>
      <ThemedText type="small">{label}</ThemedText>
    </Pressable>
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
    </Pressable>
  );
}
