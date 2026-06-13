import { Stack, useRouter } from 'expo-router';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BackButton } from '@/components/BackButton';
import { FormProgress } from '@/components/onboarding/FormProgress';

type Props = {
  length: number;
  filled: number;
  // Defaults to router.back(); override for screens that step within a single route.
  onBack?: () => void;
};

// Replaces the native Stack header on the question screens so the back button can
// sit on the same row as the progress bar. The bar is centered via symmetric
// horizontal padding; the button is absolutely positioned so it never shifts it.
export function OnboardingHeader({ length, filled, onBack }: Props) {
  const router = useRouter();
  const { top } = useSafeAreaInsets();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View className="relative justify-center" style={{ paddingTop: top }}>
        <View className="px-16">
          <FormProgress length={length} filled={filled} />
        </View>
        <View className="absolute bottom-0 left-0 justify-center" style={{ top }}>
          <BackButton variant="onboarding" onPress={onBack ?? (() => router.back())} />
        </View>
      </View>
    </>
  );
}
