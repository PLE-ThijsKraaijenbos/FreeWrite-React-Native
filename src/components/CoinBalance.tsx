import { Pressable, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import CoinIcon from '@/assets/icons/coin.svg';
import { shadows } from '@/constants/shadows';

type Props = {
  coins: number;
  onPress?: () => void;
};

export function CoinBalance({ coins, onPress }: Props) {
  const { top } = useSafeAreaInsets();

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      hitSlop={8}
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={onPress ? `${coins} coins, open shop` : `${coins} coins`}
      className="absolute right-4 z-10 flex-row items-center gap-1 rounded-full bg-neutral-100 pl-1.5 pr-3 py-1"
      style={{ top: top + 4, ...shadows.drop }}>
      <CoinIcon width={32} height={32} />
      <Text
        className="font-body-bold text-body-lg text-secondary-400"
        style={{
          fontVariant: ['tabular-nums'],
          textShadowColor: 'rgba(0, 0, 0, 0.25)',
          textShadowOffset: { width: 0, height: 1 },
          textShadowRadius: 2,
        }}>
        {coins}
      </Text>
    </Pressable>
  );
}
