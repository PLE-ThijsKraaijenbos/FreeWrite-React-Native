import { ReactNode } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BackButton } from '@/components/BackButton';
import {
  OnboardingHeader,
  PROGRESS_ROW_HEIGHT,
  PROGRESS_ROW_LEFT,
  PROGRESS_ROW_TOP,
} from '@/components/onboarding/OnboardingHeader';

type Props = {
  onBack: () => void;
  progress?: { filled: number; length: number };
  gap: string;
  footer: ReactNode;
  children: ReactNode;
};

export function OnboardingFormLayout({
  onBack,
  progress,
  gap,
  footer,
  children,
}: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1">
      {progress && (
        <OnboardingHeader
          filled={progress.filled}
          length={progress.length}
          onBack={onBack}
        />
      )}
      <View
        className={`flex-1 px-6 ${gap}`}
        style={{
          // gap-8 (32) below the header's progress-bar row on progress screens;
          // on the back-button-only screens the title sits just below the
          // back-button row so it stays close to the top of the screen.
          paddingTop: progress ? 32 : insets.top + 54,
          paddingBottom: insets.bottom + 96,
        }}
      >
        {children}
      </View>
      {/* Back button shares the canonical position used by every onboarding
          screen: vertically centred on the progress-bar row. Rendered after the
          content so it stays on top and tappable. */}
      {!progress && (
        <View
          className="absolute justify-center"
          style={{ top: insets.top + PROGRESS_ROW_TOP, height: PROGRESS_ROW_HEIGHT, left: PROGRESS_ROW_LEFT }}
        >
          <BackButton variant="onboarding" onPress={onBack} />
        </View>
      )}
      <View
        className="absolute left-6 right-6"
        style={{ bottom: insets.bottom + 24 }}
      >
        {footer}
      </View>
    </View>
  );
}
