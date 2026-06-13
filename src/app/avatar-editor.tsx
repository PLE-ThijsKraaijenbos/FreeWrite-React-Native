import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRef, useState } from 'react';

import { useAvatarItems, useEquipAvatarItem, useUnequipAvatarItem } from '@/api/avatar-items';
import { patchAvatarUrlApi } from '@/api/auth';
import { CategorySelect } from '@/components/CategorySelect';
import { ThemedText } from '@/components/themed-text';
import { useAuth } from '@/lib/auth-context';
import { useTheme } from '@/hooks/use-theme';
import { AvatarItem } from '@/types/user';

const DICEBEAR_BASE = 'https://api.dicebear.com/9.x/avataaars/svg';

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
  top: 'Hair & Hats',
  hairColor: 'Hair Colors',
  hatColor: 'Hat Colors',
  skinColor: 'Skin Colors',
};

// Handles both "key[]=value" and legacy "key=value" DiceBear formats.
function parseAvatarParams(url: string): Record<string, string> {
  const qs = url.split('?')[1] ?? '';
  return Object.fromEntries(
    [...new URLSearchParams(qs)].map(([k, v]) => [k.replace('[]', ''), v])
  );
}

// DiceBear probability params are plain integers, not arrays — no [] suffix.
const PLAIN_PARAMS = new Set(['facialHairProbability', 'accessoriesProbability']);

// Selecting these param_keys requires forcing the paired probability to 100
// so DiceBear actually renders the item (defaults are 10%).
const PROBABILITY_COMPANION: Record<string, string> = {
  facialHair: 'facialHairProbability',
  accessories: 'accessoriesProbability',
};

function buildAvatarUrl(params: Record<string, string>): string {
  const qs = Object.entries(params)
    .map(([k, v]) =>
      PLAIN_PARAMS.has(k) ? `${k}=${encodeURIComponent(v)}` : `${k}[]=${encodeURIComponent(v)}`
    )
    .join('&');
  return qs ? `${DICEBEAR_BASE}?${qs}` : DICEBEAR_BASE;
}

function chunk<T>(arr: T[], size: number): T[][] {
  const rows: T[][] = [];
  for (let i = 0; i < arr.length; i += size) rows.push(arr.slice(i, i + size));
  return rows;
}

export default function AvatarEditorScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { top } = useSafeAreaInsets();
  const { user, updateUser } = useAuth();
  const { data: items = [], isLoading, refetch, isRefetching } = useAvatarItems();
  const { mutateAsync: equip } = useEquipAvatarItem();
  const { mutateAsync: unequip } = useUnequipAvatarItem();

  // Parsed once from avatar_url and never changes — used as the fallback
  // when an item is deselected, so the avatar reverts to its original look.
  const originalParams = useRef(parseAvatarParams(user?.profile?.avatar_url ?? ''));

  const [params, setParams] = useState<Record<string, string>>(
    () => originalParams.current
  );
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const unlockedItems = items.filter((i) => i.is_unlocked);

  const allSections = Object.entries(CATEGORY_LABELS)
    .map(([key, title]) => ({
      key,
      title,
      items: unlockedItems.filter((i) => i.param_key === key),
    }))
    .filter((s) => s.items.length > 0);

  const sections = selectedCategory
    ? allSections.filter((s) => s.key === selectedCategory)
    : allSections;

  // An item is "active" when its value is currently in the params map,
  // regardless of whether it came from onboarding or a previous equip.
  const isActive = (item: AvatarItem) => params[item.param_key] === item.param_value;

  function toggle(item: AvatarItem) {
    setParams((prev) => {
      const probKey = PROBABILITY_COMPANION[item.param_key];

      if (prev[item.param_key] === item.param_value) {
        const next = { ...prev };
        const fallback = originalParams.current[item.param_key];
        if (fallback !== undefined) {
          next[item.param_key] = fallback;
          if (probKey) {
            const origProb = originalParams.current[probKey];
            if (origProb !== undefined) {
              next[probKey] = origProb;
            } else {
              delete next[probKey];
            }
          }
        } else {
          delete next[item.param_key];
          if (probKey) delete next[probKey];
        }
        return next;
      }

      // Select: set value and force probability to 100 so DiceBear always renders it
      const next = { ...prev, [item.param_key]: item.param_value };
      if (probKey) next[probKey] = '100';
      return next;
    });
  }

  async function handleSave() {
    setSaving(true);
    setSaveError(null);
    try {
      const serverEquipped = items.filter((i) => i.is_equipped);

      await Promise.all(
        serverEquipped
          .filter((item) => params[item.param_key] !== item.param_value)
          .map((item) => unequip(item.id))
      );

      await Promise.all(
        unlockedItems
          .filter((item) => params[item.param_key] === item.param_value && !item.is_equipped)
          .map((item) => equip(item.id))
      );

      const updatedUser = await patchAvatarUrlApi(buildAvatarUrl(params));
      updateUser(updatedUser);
      router.back();
    } catch {
      setSaveError('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <View className="flex-1" style={{ backgroundColor: theme.background }}>
      <View
        className="flex-row items-center justify-between px-4 pb-3"
        style={{ paddingTop: top + 16 }}>
        <Pressable onPress={() => router.back()}>
          <ThemedText themeColor="textSecondary">← Back</ThemedText>
        </Pressable>
        <ThemedText type="subtitle">Edit Avatar</ThemedText>
        <Pressable
          onPress={handleSave}
          disabled={saving}
          className="py-1 px-3 rounded-lg"
          style={{ backgroundColor: theme.backgroundElement }}>
          {saving ? (
            <ActivityIndicator size="small" />
          ) : (
            <ThemedText type="small">Save</ThemedText>
          )}
        </Pressable>
      </View>

      {saveError && (
        <ThemedText className="text-center px-4 pb-2" themeColor="textSecondary">
          {saveError}
        </ThemedText>
      )}

      <View className="items-center py-6">
        <Image
          source={{ uri: buildAvatarUrl(params) }}
          style={{ width: 160, height: 160 }}
          contentFit="contain"
        />
      </View>

      {isLoading ? (
        <ActivityIndicator className="mt-12" />
      ) : unlockedItems.length === 0 ? (
        <ThemedText className="text-center mt-12" themeColor="textSecondary">
          No items unlocked yet. Visit the shop!
        </ThemedText>
      ) : (
        <>
          <CategorySelect
            categories={allSections.map((s) => ({ id: s.key, label: s.title }))}
            selectedId={selectedCategory}
            onSelect={(id) => setSelectedCategory(id === selectedCategory ? null : id)}
          />

          <ScrollView
            contentContainerStyle={{ paddingBottom: 32 }}
            refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}>
            {sections.map((section) => (
              <View key={section.key}>
                <ThemedText
                  type="smallBold"
                  themeColor="textSecondary"
                  className="px-4 mt-6 mb-2">
                  {section.title.toUpperCase()}
                </ThemedText>
                {chunk(section.items, 2).map((row, i) => (
                  <View key={i} className="flex-row w-full">
                    {row.map((item) => (
                      <EditorItem
                        key={item.id}
                        item={item}
                        active={isActive(item)}
                        onPress={() => toggle(item)}
                      />
                    ))}
                    {row.length === 1 && <View className="w-1/2" />}
                  </View>
                ))}
              </View>
            ))}
          </ScrollView>
        </>
      )}
    </View>
  );
}


function EditorItem({
  item,
  active,
  onPress,
}: {
  item: AvatarItem;
  active: boolean;
  onPress: () => void;
}) {
  const theme = useTheme();
  return (
    <Pressable
      onPress={onPress}
      className="w-1/2 aspect-square items-center justify-center p-2"
      style={({ pressed }) => ({
        backgroundColor:
          active || pressed ? theme.backgroundSelected : theme.backgroundElement,
        borderWidth: 1,
        borderColor: active ? theme.text : theme.backgroundSelected,
      })}>
      <ThemedText type="small" className="text-center">
        {item.name}
      </ThemedText>
    </Pressable>
  );
}
