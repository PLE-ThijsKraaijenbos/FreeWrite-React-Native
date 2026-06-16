import { useRouter } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCallback, useMemo, useRef, useState } from 'react';

import { useAvatarItems, useEquipAvatarItem, useUnequipAvatarItem } from '@/api/avatar-items';
import { getProfileApi } from '@/api/auth';
import { useUpdateProfile } from '@/api/user';
import { AvatarDisplay } from '@/components/AvatarDisplay';
import { AvatarItemGrid, GridCard, GridSection } from '@/components/AvatarItemGrid';
import { BackButton } from '@/components/BackButton';
import { CoinBalance } from '@/components/CoinBalance';
import { CTAButton } from '@/components/cta';
import { Divider } from '@/components/Divider';
import { TextInput } from '@/components/TextInput';
import { ThemedText } from '@/components/themed-text';
import {
  applyItem,
  buildAvatarUrl,
  DISPLAY_CATEGORIES,
  prerequisiteHint,
  previewItemUrl,
  PROBABILITY_PARAM,
} from '@/lib/avatar';
import { useAuth } from '@/lib/auth-context';
import { useTheme } from '@/hooks/use-theme';
import { AvatarItem } from '@/types/user';

// Categories that support an explicit "None" tile to fully unequip, mapped to
// the dependent colour that should also be cleared when None is selected.
const NONE_CATEGORIES: Record<string, string> = {
  accessories: 'accessoriesColor',
  facialHair: 'facialHairColor',
};

const NONE_PREFIX = 'none:';
const isNoneItem = (item: AvatarItem) => item.id.startsWith(NONE_PREFIX);

// A synthetic, non-DB tile that clears its category when selected.
const noneItem = (key: string): AvatarItem => ({
  id: `${NONE_PREFIX}${key}`,
  name: 'None',
  param_key: key,
  param_value: '',
  price: 0,
  is_unlocked: true,
  is_equipped: false,
});

// Removes a category (its value, probability gate, and dependent colour) from params.
function stripCategory(params: Record<string, string>, key: string): Record<string, string> {
  const next = { ...params };
  delete next[key];
  const probKey = PROBABILITY_PARAM[key];
  if (probKey) delete next[probKey];
  const colorKey = NONE_CATEGORIES[key];
  if (colorKey) delete next[colorKey];
  return next;
}

// Restores each key to its saved value, or deletes it if it had none.
function revertKeys(
  params: Record<string, string>,
  original: Record<string, string>,
  keys: string[]
): Record<string, string> {
  const next = { ...params };
  for (const k of keys) {
    if (original[k] !== undefined) next[k] = original[k];
    else delete next[k];
  }
  return next;
}

export default function AvatarEditorScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { top, bottom } = useSafeAreaInsets();
  const { user, updateUser } = useAuth();
  const { data: items = [], isLoading, refetch, isRefetching } = useAvatarItems();
  const { mutateAsync: equip } = useEquipAvatarItem();
  const { mutateAsync: unequip } = useUnequipAvatarItem();
  const { mutateAsync: updateProfile } = useUpdateProfile();

  // The saved avatar (equipped items), captured once — base for previews and the
  // fallback when an item is deselected.
  const baseParams = useRef(user?.profile?.avatar ?? {}).current;

  const [params, setParams] = useState<Record<string, string>>(() => baseParams);
  const [name, setName] = useState(user?.profile?.name ?? '');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [attemptedSave, setAttemptedSave] = useState(false);
  const [nameTouched, setNameTouched] = useState(false);

  const unlockedItems = useMemo(() => items.filter((i) => i.is_unlocked), [items]);

  const sections = useMemo<GridSection[]>(
    () =>
      DISPLAY_CATEGORIES.map((cat) => {
        const real = unlockedItems.filter(cat.match);
        // Offer a "None" tile (first) for clearable categories that have items.
        const catItems =
          cat.id in NONE_CATEGORIES && real.length > 0 ? [noneItem(cat.id), ...real] : real;
        const cards: GridCard[] = catItems.map((item) => {
          if (isNoneItem(item)) {
            // None is active when the category is off; preview the avatar without it.
            const active = params[item.param_key] === undefined;
            return {
              item,
              uri: buildAvatarUrl(stripCategory(baseParams, item.param_key), { png: true, size: 128 }),
              hint: null,
              variant: active ? 'equipped' : 'unequipped',
              disabled: false,
            };
          }
          const active = params[item.param_key] === item.param_value;
          const hint = prerequisiteHint(item.param_key, params);
          return {
            item,
            uri: previewItemUrl(baseParams, item, { png: true, size: 128 }),
            hint: active ? null : hint,
            variant: active ? 'equipped' : 'unequipped',
            disabled: !active && !!hint,
          };
        });
        return { key: cat.id, title: cat.title, cards };
      }).filter((s) => s.cards.length > 0),
    [unlockedItems, params, baseParams]
  );

  const toggle = useCallback(
    (item: AvatarItem) => {
      if (isNoneItem(item)) {
        setParams((prev) => stripCategory(prev, item.param_key));
        return;
      }
      setParams((prev) => {
        if (prev[item.param_key] === item.param_value) {
          // Deselect: revert this key (and its probability gate) to the saved look.
          const probKey = PROBABILITY_PARAM[item.param_key];
          return revertKeys(prev, baseParams, [item.param_key, probKey].filter(Boolean) as string[]);
        }
        // Select: set value and force probability to 100 so DiceBear always renders it.
        return applyItem(prev, item);
      });
    },
    [baseParams]
  );

  async function handleSave() {
    setAttemptedSave(true);
    const trimmedName = name.trim();
    if (!trimmedName) return;

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

      const trimmedName = name.trim();
      if (trimmedName && trimmedName !== (user?.profile?.name ?? '')) {
        await updateProfile(trimmedName);
      }

      // Equipped items are the source of truth now — refresh the profile so the
      // derived avatar (home screen etc.) reflects the change.
      updateUser(await getProfileApi());
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
          <AvatarItemGrid
            sections={sections}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            onPressItem={toggle}
            baseParams={baseParams}
            refreshing={isRefetching}
            onRefresh={refetch}
            header={
              <>
                <View className="px-4">
                  <TextInput
                    label="Name"
                    placeholder="Your name"
                    value={name}
                    onChangeText={setName}
                    onBlur={() => setNameTouched(true)}
                  />
                  {!name.trim() && (nameTouched || attemptedSave) && (
                    <ThemedText type="body-sm" className="text-secondary-500 pt-1">
                      Please enter a name.
                    </ThemedText>
                  )}
                </View>
                <View className="px-4">
                  <Divider />
                </View>
              </>
            }
          />
        )}
      </View>

      <View className="px-4 pt-2 bg-neutral-100 border-t-2 border-neutral-200" style={{ paddingBottom: bottom + 16 }}>
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
