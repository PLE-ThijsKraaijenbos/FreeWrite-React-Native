import { Image } from 'expo-image';
import { ReactNode } from 'react';
import { useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BackButton } from '@/components/BackButton';
import {
  PROGRESS_ROW_HEIGHT,
  PROGRESS_ROW_LEFT,
  PROGRESS_ROW_TOP,
} from '@/components/onboarding/OnboardingHeader';

type Props = {
  image: any;
  aspectRatio: number;
  // When set, the image is capped to this fraction of the window height and
  // center-cropped (contentFit="cover") instead of sized by its aspect ratio.
  heightRatio?: number;
  onBack?: () => void;
  // When provided, the footer is pinned absolutely at the bottom (used by the
  // slides). When omitted, lay the bottom controls out as the last flow item in
  // children instead — the content area becomes a flex-1 column so a divider can
  // sit directly above them without the absolute footer clipping it.
  footer?: ReactNode;
  gap?: string;
  children: ReactNode;
};

export function OnboardingImageLayout({
  image,
  aspectRatio,
  heightRatio,
  onBack,
  footer,
  gap = 'gap-6',
  children,
}: Props) {
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();

  return (
    <View className="flex-1">
      <Image
        source={image}
        style={
          heightRatio
            ? { width: '100%', height: height * heightRatio }
            : { width: '100%', aspectRatio }
        }
        contentFit="cover"
      />
      {onBack && (
        <View
          className="absolute justify-center"
          style={{ top: insets.top + PROGRESS_ROW_TOP, height: PROGRESS_ROW_HEIGHT, left: PROGRESS_ROW_LEFT }}
        >
          <BackButton variant="onboarding" onPress={onBack} />
        </View>
      )}
      <View
        className={`flex-1 px-6 pt-6 ${gap}`}
        style={{ paddingBottom: insets.bottom + (footer ? 96 : 24) }}
      >
        {children}
      </View>
      {footer && (
        <View
          className="absolute left-6 right-6"
          style={{ bottom: insets.bottom + 24 }}
        >
          {footer}
        </View>
      )}
    </View>
  );
}
