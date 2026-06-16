import { Image } from 'expo-image';
import { cssInterop } from 'nativewind';
import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';

cssInterop(Image, { className: 'style' });

type Props = {
  uri?: string | null;
  size?: 'small' | 'large';
  chrome?: boolean;
  className?: string;
};

function AvatarDisplayComponent({ uri, size = 'small', chrome = true, className }: Props) {
  const large = size === 'large';
  const thumb = !large && !chrome;

  return (
    <View
      className={`w-full items-center justify-end overflow-hidden ${chrome ? 'bg-primary-200 border-b-2 border-neutral-200' : ''} ${large ? 'aspect-square' : thumb ? 'aspect-[1.5]' : 'aspect-[1.4]'} ${className ?? ''}`}>
      {/* Soft white glow behind the avatar (radial fade to transparent). */}
      {chrome && (
        <View pointerEvents="none" style={StyleSheet.absoluteFill}>
          <Svg width="100%" height="100%">
            <Defs>
              <RadialGradient id="avatarGlow" cx="50%" cy="50%" r="55%">
                <Stop offset="0" stopColor="#FFFFFF" stopOpacity={1} />
                <Stop offset="1" stopColor="#FFFFFF" stopOpacity={0} />
              </RadialGradient>
            </Defs>
            <Rect x="0" y="0" width="100%" height="100%" fill="url(#avatarGlow)" />
          </Svg>
        </View>
      )}

      <Image
        source={uri ? { uri } : null}
        contentFit="contain"
        className={large ? 'w-[72%] aspect-square' : thumb ? 'w-[64%] aspect-square' : 'w-[55%] aspect-square'}
      />
    </View>
  );
}

export const AvatarDisplay = memo(AvatarDisplayComponent);
