import { Stack, useRouter } from 'expo-router';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BackButton } from '@/components/BackButton';
import { FormProgress } from '@/components/onboarding/FormProgress';

// Shared so every onboarding screen can place its back button on exactly the same
// row as the question screens' progress bar — vertically centred on the bar via
// flexbox, so alignment never depends on the icon's measured height.
export const PROGRESS_ROW_TOP = 24; // offset added to insets.top for the bar row
export const PROGRESS_ROW_HEIGHT = 6; // FormProgress bar height (h-1.5)
export const PROGRESS_ROW_LEFT = 16; // back-button container left inset (px)

type Props = {
  length: number;
  filled: number;
  // Defaults to router.back(); override for screens that step within a single route.
  onBack?: () => void;
};

// Replaces the native Stack header on the question screens so the back button can
// sit on the same row as the progress bar. The bar is centered via symmetric
// horizontal padding; the button is absolutely positioned over the bar's row and
// vertically centred on it, so it never shifts the bar.
export function OnboardingHeader({ length, filled, onBack }: Props) {
  const router = useRouter();
  const { top } = useSafeAreaInsets();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View className="relative" style={{ paddingTop: top + PROGRESS_ROW_TOP }}>
        <View className="px-16">
          <FormProgress length={length} filled={filled} />
        </View>
        <View
          className="absolute justify-center"
          style={{ top: top + PROGRESS_ROW_TOP, height: PROGRESS_ROW_HEIGHT, left: PROGRESS_ROW_LEFT }}
        >
          <BackButton variant="onboarding" onPress={onBack ?? (() => router.back())} />
        </View>
      </View>
    </>
  );
}
