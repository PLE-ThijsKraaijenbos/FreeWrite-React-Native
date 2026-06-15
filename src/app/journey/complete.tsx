import { useLocalSearchParams, useRouter } from 'expo-router';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import CoinIcon from '@/assets/icons/coin.svg';
import { AssignmentNode } from '@/components/AssignmentNode';
import { DoubleCTA } from '@/components/cta';
import { Divider } from '@/components/Divider';
import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';

export default function AssignmentCompleteScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { top, bottom } = useSafeAreaInsets();
  const { coins } = useLocalSearchParams<{ coins?: string }>();
  const earned = coins ?? '50';

  return (
    <View
      className="flex-1 items-center justify-center gap-8 px-4"
      style={{ backgroundColor: theme.background, paddingTop: top + 16, paddingBottom: bottom + 24 }}>
      <AssignmentNode status="COMPLETED" size={160} />

      <View className="w-full">
        <Divider />
      </View>

      <View className="items-center gap-4">
        <ThemedText type="h1" className="text-center">
          Assignment completed!
        </ThemedText>
        <View className="items-center gap-2">
          <ThemedText type="body">You have earned</ThemedText>
          <View className="flex-row items-center gap-1">
            <CoinIcon width={32} height={32} />
            <ThemedText type="body-lg-bold" className="text-secondary-400">
              {earned}
            </ThemedText>
          </View>
        </View>
      </View>

      <View className="w-full">
        <Divider />
      </View>

      <DoubleCTA
        leftLabel="Go Home"
        rightLabel="Continue"
        onPressLeft={() => router.replace('/tabs')}
        onPressRight={() => router.replace('/tabs/journey?focus=available')}
      />
    </View>
  );
}
