import { Image } from 'expo-image';
import { cssInterop } from 'nativewind';
import { StyleSheet, View } from 'react-native';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';

// expo-image isn't NativeWind-interop'd by default, so className would be
// ignored (and the image would render at zero size). Wire it up once here.
cssInterop(Image, { className: 'style' });

type Props = {
  uri?: string | null;
  // `small` is the default head-and-shoulders hero used on the home, editor and
  // shop screens; `large` is the taller bust framing for the buy confirmation.
  size?: 'small' | 'large';
  // Card chrome = the green background, bottom border and radial glow. Off for the
  // small shop thumbnails: they sit bare on their own card surface, and dropping
  // the per-card Svg glow also keeps the grid scrolling smoothly.
  chrome?: boolean;
  className?: string;
};

export function AvatarDisplay({ uri, size = 'small', chrome = true, className }: Props) {
  const large = size === 'large';
  // The bare card thumbnail: scale the avatar up and use a shorter frame so the
  // head sits right under the label instead of floating with a gap above it.
  const thumb = !large && !chrome;

  return (
    // The avatar is clipped at the bottom so only the head and shoulders show,
    // matching the Figma frame.
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
