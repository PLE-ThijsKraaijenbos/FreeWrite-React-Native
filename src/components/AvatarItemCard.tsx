import { memo } from 'react';
import { Pressable, View } from 'react-native';

import { AvatarDisplay } from '@/components/AvatarDisplay';
import { ThemedText } from '@/components/themed-text';
import { shadows } from '@/constants/shadows';
import { useTheme } from '@/hooks/use-theme';
import { parseAvatarParams, prerequisiteHint, previewItemUrl } from '@/lib/avatar';
import { AvatarItem } from '@/types/user';

// Small PNG thumbnail (raster bitmap) instead of a parsed SVG per card.
const THUMB_SIZE = 128;

type Props = {
  item: AvatarItem;
  // The user's current avatar; the item is previewed worn on top of it.
  baseUrl?: string;
  onPress: (item: AvatarItem) => void;
};

// Single grid square in the item shop: the avatar wearing this item, with the
// name/price below. Memoised + given a stable onPress so re-rendering the shop
// (e.g. tapping another item) doesn't re-render every card. Styling is
// intentionally minimal for now — the visual pass comes later.
function AvatarItemCardComponent({ item, baseUrl, onPress }: Props) {
  const theme = useTheme();
  // When the user's current avatar lacks the prerequisite (e.g. a colour with no
  // accessory equipped), the item can't be previewed or meaningfully bought yet —
  // lock the card and explain what to equip first.
  const hint = baseUrl ? prerequisiteHint(item.param_key, parseAvatarParams(baseUrl)) : null;
  const unavailable = item.is_unlocked || !!hint;

  return (
    <Pressable
      onPress={() => onPress(item)}
      disabled={unavailable}
      className="w-1/2 p-2"
      style={{ opacity: unavailable ? 0.4 : 1 }}>
      {/* Outer view carries the drop shadow; inner view clips to rounded corners
          (shadow + overflow-hidden on the same view is clipped on iOS). Disabled
          cards drop the shadow — elevation under opacity:0.4 renders a heavy halo. */}
      <View
        className="rounded-lg"
        style={[
          shadows.drop,
          unavailable && { elevation: 0, shadowOpacity: 0 },
          { backgroundColor: theme.backgroundElement },
        ]}>
        <View className="overflow-hidden rounded-lg">
          <View className="items-center gap-0.5 px-2 pt-2 pb-1">
            <ThemedText type="small" className="text-center">
              {item.name}
            </ThemedText>
            {item.price > 0 && (
              <ThemedText type="small" themeColor="textSecondary">
                {item.price} coins
              </ThemedText>
            )}
            {hint && (
              <ThemedText type="small" themeColor="textSecondary" className="text-center">
                {hint}
              </ThemedText>
            )}
          </View>
          <AvatarDisplay uri={previewItemUrl(baseUrl, item, { png: true, size: THUMB_SIZE })} chrome={false} />
        </View>
      </View>
    </Pressable>
  );
}

export const AvatarItemCard = memo(AvatarItemCardComponent);
