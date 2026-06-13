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


function AvatarItemCardComponent({ item, baseUrl, variant = 'shop', hint, disabled, onPress }: Props) {
  const equipped = variant === 'equipped';
  const showPrice = variant === 'shop' && item.price > 0;

  return (
    <Pressable
      onPress={() => onPress(item)}
      disabled={disabled}
      className="w-1/2 p-2"
      style={{ opacity: disabled ? 0.4 : 1 }}>
      <View className="rounded-lg" style={[shadows.drop, disabled && { elevation: 0, shadowOpacity: 0 }]}>
        <View className="overflow-hidden rounded-lg">
          {/* Card surface: top→bottom light→dark gradient — secondary when
              equipped, neutral otherwise. */}
          <LinearGradient
            colors={equipped ? ['#FCAA88', '#F47D4E'] : ['#FAFAF8', '#EBEBE6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <View className="gap-0.5 px-2 pt-1">
            <ThemedText
              type="smallBold"
              className={equipped ? 'text-neutral-100' : 'text-neutral-500'}
              style={equipped ? labelShadow.white : undefined}>
              {item.name}
            </ThemedText>
            {showPrice && (
              <View className="h-6 flex-row items-center gap-0.5">
                <CoinIcon width={24} height={24} />
                <ThemedText type="smallBold" className="text-secondary-400">
                  {item.price}
                </ThemedText>
              </View>
            )}
            {hint && (
              <ThemedText type="small" className="text-neutral-400">
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
