import { useRouter } from 'expo-router';
import { ActivityIndicator, FlatList, RefreshControl, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCallback, useMemo, useRef, useState } from 'react';

import { useAvatarItems, useEquipAvatarItem, useUnequipAvatarItem } from '@/api/avatar-items';
import { patchAvatarUrlApi } from '@/api/auth';
import { AvatarDisplay } from '@/components/AvatarDisplay';
import { AvatarItemCard } from '@/components/AvatarItemCard';
import { BackButton } from '@/components/BackButton';
import { CategorySelect } from '@/components/CategorySelect';
import { CoinBalance } from '@/components/CoinBalance';
import { CTAButton } from '@/components/cta';
import { ThemedText } from '@/components/themed-text';
import {
  applyItem,
  buildAvatarUrl,
  parseAvatarParams,
  prerequisiteHint,
  previewItemUrl,
  PROBABILITY_COMPANION,
} from '@/lib/avatar';
import { useAuth } from '@/lib/auth-context';
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
  top: 'Hair & Hats',
  hairColor: 'Hair Colors',
  hatColor: 'Hat Colors',
  skinColor: 'Skin Colors',
};

function chunk<T>(arr: T[], size: number): T[][] {
  const rows: T[][] = [];
  for (let i = 0; i < arr.length; i += size) rows.push(arr.slice(i, i + size));
  return rows;
}

type EditorItem = { item: AvatarItem; hint: string | null; uri: string; active: boolean };

type EditorRow =
  | { type: 'header'; key: string; title: string }
  | { type: 'items'; key: string; items: EditorItem[] };

export default function AvatarEditorScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { top, bottom } = useSafeAreaInsets();
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

  const unlockedItems = useMemo(() => items.filter((i) => i.is_unlocked), [items]);

  const allSections = useMemo(
    () =>
      Object.entries(CATEGORY_LABELS)
        .map(([key, title]) => ({
          key,
          title,
          items: unlockedItems.filter((i) => i.param_key === key),
        }))
        .filter((s) => s.items.length > 0),
    [unlockedItems]
  );

  const baseUrl = user?.profile?.avatar_url;

  const rows = useMemo<EditorRow[]>(() => {
    const sections = selectedCategory
      ? allSections.filter((s) => s.key === selectedCategory)
      : allSections;
    const result: EditorRow[] = [];
    for (const section of sections) {
      result.push({ type: 'header', key: `h:${section.key}`, title: section.title });
      chunk(section.items, 2).forEach((rowItems, i) => {
        const itemsWithMetadata: EditorItem[] = rowItems.map((item) => {
          const active = params[item.param_key] === item.param_value;
          return {
            item,
            hint: prerequisiteHint(item.param_key, params),
            uri: previewItemUrl(baseUrl, item, { png: true, size: 128 }),
            active,
          };
        });
        result.push({ type: 'items', key: `r:${section.key}:${i}`, items: itemsWithMetadata });
      });
    }
    return result;
  }, [allSections, selectedCategory, params, baseUrl]);

  const toggle = useCallback(
    (item: AvatarItem) => {
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
        return applyItem(prev, item);
      });
    },
    []
  );

  const renderRow = useCallback(
    ({ item: row }: { item: EditorRow }) => {
      if (row.type === 'header') {
        return (
          <ThemedText type="h3" className="px-4 mt-6 mb-2">
            {row.title.toUpperCase()}
          </ThemedText>
        );
      }
      return (
        <View className="flex-row w-full">
          {row.items.map(({ item, hint, uri, active }) => (
            <AvatarItemCard
              key={item.id}
              item={item}
              uri={uri}
              variant={active ? 'equipped' : 'unequipped'}
              hint={active ? null : hint}
              disabled={!active && !!hint}
              baseUrl={baseUrl}
              onPress={toggle}
            />
          ))}
          {row.items.length === 1 && <View className="w-1/2" />}
        </View>
      );
    },
    [toggle, baseUrl]
  );

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
      <AvatarDisplay uri={buildAvatarUrl(params)} />

      <View className="absolute left-4 z-10" style={{ top: top + 4 }}>
        <BackButton onPress={() => router.back()} />
      </View>

      <CoinBalance coins={user?.profile?.coins ?? 0} onPress={() => router.push('/shop')} />

      <View className="flex-1">
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
          </>
        )}
      </View>

      <View className="px-4 pt-2" style={{ paddingBottom: bottom + 16 }}>
        {saveError && (
          <ThemedText className="text-center pb-2" themeColor="textSecondary">
            {saveError}
          </ThemedText>
        )}
        <CTAButton label={saving ? 'Saving…' : 'Save'} onPress={handleSave} disabled={saving} />
      </View>
    </View>
  );
}
