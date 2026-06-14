import { LinearGradient } from 'expo-linear-gradient';
import { cssInterop } from 'nativewind';
import { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import CoinIcon from '@/assets/icons/coin.svg';
import { AvatarDisplay } from '@/components/AvatarDisplay';
import { ThemedText } from '@/components/themed-text';
import { shadows } from '@/constants/shadows';
import { previewItemUrl } from '@/lib/avatar';
import { AvatarItem } from '@/types/user';

cssInterop(LinearGradient, { className: 'style' });

const THUMB_SIZE = 128;

export type AvatarItemCardVariant = 'shop' | 'unequipped' | 'equipped';

type Props = {
  item: AvatarItem;
  baseUrl?: string;
  uri?: string;
  variant?: AvatarItemCardVariant;
  hint?: string | null;
  disabled?: boolean;
  onPress: (item: AvatarItem) => void;
};

const labelShadow = StyleSheet.create({
  white: {
    textShadowColor: 'rgba(0,0,0,0.50)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 2,
  },
});


function AvatarItemCardComponent({ item, baseUrl, uri: propUri, variant = 'shop', hint, disabled, onPress }: Props) {
  const equipped = variant === 'equipped';
  const isShop = variant === 'shop';
  const isOwned = isShop && item.is_unlocked;
  const showPrice = isShop && !isOwned;
  // Dim the card if it's disabled (missing prerequisite) OR if it's already owned in the shop
  const isDimmed = (disabled && !isOwned) || isOwned;

  const uri = propUri ?? previewItemUrl(baseUrl, item, { png: true, size: THUMB_SIZE });

  return (
    <Pressable
      onPress={() => onPress(item)}
      disabled={disabled}
      className="w-1/2 p-2">
      <View className="rounded-lg" style={[shadows.drop, disabled && { elevation: 0, shadowOpacity: 0 }]}>
        <View className="overflow-hidden rounded-lg pt-12" style={{ opacity: isDimmed ? 0.4 : 1 }}>
          {/* Card surface: top→bottom light→dark gradient — secondary when
              equipped, neutral otherwise. */}
          <LinearGradient
            colors={equipped ? ['#FCAA88', '#F47D4E'] : ['#FAFAF8', '#EBEBE6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <AvatarDisplay uri={uri} chrome={false} />
          <View className="absolute top-0 left-0 right-0 gap-0.5 px-2 pt-2">
            <ThemedText
              type="body-sm-bold"
              className={equipped ? 'text-neutral-100' : 'text-neutral-500'}
              style={equipped ? labelShadow.white : undefined}>
              {item.name}
            </ThemedText>
            {showPrice && (
              <View className="h-6 flex-row items-center gap-0.5">
                {item.price > 0 && <CoinIcon width={24} height={24} />}
                <ThemedText type="body-sm-bold" className="text-secondary-400">
                  {item.price > 0 ? item.price : 'FREE'}
                </ThemedText>
              </View>
            )}
          </View>
        </View>
        {(hint || isOwned) && (
          <View className="absolute inset-0 items-center justify-center p-4">
            <View
              className="bg-neutral-100 px-3 py-2 rounded-xl border border-neutral-200"
              style={shadows.drop}>
              <ThemedText
                type="body-sm-bold"
                className="text-center text-neutral-600">
                {isOwned ? 'Already Unlocked' : hint}
              </ThemedText>
            </View>
          </View>
        )}
      </View>
    </Pressable>
  );
}

export const AvatarItemCard = memo(AvatarItemCardComponent);
