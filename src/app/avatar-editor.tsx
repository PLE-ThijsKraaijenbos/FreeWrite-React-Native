import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRef, useState } from 'react';

import { useAvatarItems, useEquipAvatarItem, useUnequipAvatarItem } from '@/api/avatar-items';
import { patchAvatarUrlApi } from '@/api/auth';
import { AvatarDisplay } from '@/components/AvatarDisplay';
import { BackButton } from '@/components/BackButton';
import { CategorySelect } from '@/components/CategorySelect';
import { CTAButton } from '@/components/cta';
import { ThemedText } from '@/components/themed-text';
import { shadows } from '@/constants/shadows';
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

// Small PNG thumbnail (raster bitmap) for each item card.
const THUMB_SIZE = 128;

// White, shadowed label for the equipped (secondary-gradient) card — same
// treatment as the colored CTA buttons, for readability over the orange.
const itemStyles = StyleSheet.create({
  selectedLabel: {
    color: '#FAFAF8',
    textShadowColor: 'rgba(0,0,0,0.50)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 2,
  },
});

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
      return applyItem(prev, item);
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
      <AvatarDisplay uri={buildAvatarUrl(params)} />

      <View className="absolute left-4 z-10" style={{ top: top + 16 }}>
        <BackButton onPress={() => router.back()} />
      </View>

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

            <ScrollView
              className="flex-1"
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
                          hint={prerequisiteHint(item.param_key, params)}
                          baseUrl={user?.profile?.avatar_url}
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


function EditorItem({
  item,
  active,
  hint,
  baseUrl,
  onPress,
}: {
  item: AvatarItem;
  active: boolean;
  // When set, the item's prerequisite isn't equipped yet — lock it and explain.
  hint: string | null;
  // The saved avatar the item is previewed on (stable, so toggling doesn't
  // reload every thumbnail).
  baseUrl?: string;
  onPress: () => void;
}) {
  const theme = useTheme();
  // Don't lock an already-active item, so it can always be deselected.
  const locked = !!hint && !active;

  return (
    <Pressable
      onPress={onPress}
      disabled={locked}
      className="w-1/2 p-2"
      style={{ opacity: locked ? 0.4 : 1 }}>
      {/* Outer view carries the drop shadow; inner view clips to rounded corners
          (shadow + overflow-hidden on the same view is clipped on iOS). Locked
          cards drop the shadow — elevation under opacity:0.4 renders a heavy halo. */}
      <View
        className="rounded-lg"
        style={[
          shadows.drop,
          locked && { elevation: 0, shadowOpacity: 0 },
          { backgroundColor: theme.backgroundElement },
        ]}>
        <View className="overflow-hidden rounded-lg">
          {/* Equipped items get the secondary light->dark gradient instead of a border. */}
          {active && (
            <LinearGradient
              colors={['#FCAA88', '#F47D4E']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
          )}
          <View className="items-center gap-0.5 px-2 pt-2 pb-1">
            <ThemedText
              type="small"
              className="text-center"
              style={active ? itemStyles.selectedLabel : undefined}>
              {item.name}
            </ThemedText>
            {locked && (
              <ThemedText type="small" themeColor="textSecondary" className="text-center">
                {hint}
              </ThemedText>
            )}
          </View>
          <AvatarDisplay
            uri={previewItemUrl(baseUrl, item, { png: true, size: THUMB_SIZE })}
            chrome={false}
          />
        </View>
      </View>
    </Pressable>
  );
}
