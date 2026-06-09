import Slider from '@react-native-community/slider';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CTAButton } from '@/components/cta';
import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';
import { ScaleContent } from '@/types/journey';

type Props = {
  content: ScaleContent;
  responseData?: unknown;
  onComplete: (responseData: unknown) => void;
};

export function ScaleAssignment({ content, responseData, onComplete }: Props) {
  const router = useRouter();
  const theme = useTheme();
  const { top, bottom } = useSafeAreaInsets();
  const [value, setValue] = useState<number>(5);

  const saved = responseData as { value?: number } | undefined;
  const savedValue = saved?.value ?? null;
  const displayValue = savedValue ?? value;
  const isReadOnly = savedValue != null;

  return (
    <View className="flex-1" style={{ backgroundColor: theme.background }}>
      <View className="px-4 pb-3" style={{ paddingTop: top + 16 }}>
        <Pressable onPress={() => router.back()}>
          <ThemedText themeColor="textSecondary">← Back</ThemedText>
        </Pressable>
      </View>

      <View className="flex-1 justify-center px-6">
        <ThemedText type="subtitle" className="mb-12">
          {content.title_text}
        </ThemedText>

        <View className="items-center mb-8">
          <ThemedText className="text-primary text-[64px] font-bold leading-[72px]">
            {displayValue}
          </ThemedText>
        </View>

        <Slider
          value={displayValue}
          minimumValue={1}
          maximumValue={10}
          step={1}
          disabled={isReadOnly}
          onValueChange={setValue}
          minimumTrackTintColor="#3c87f7"
          maximumTrackTintColor={theme.backgroundElement}
          thumbTintColor="#3c87f7"
          style={{ width: '100%' }}
        />

        <View className="flex-row justify-between mt-2">
          <ThemedText themeColor="textSecondary" type="small">
            {content.left_label}
          </ThemedText>
          <ThemedText themeColor="textSecondary" type="small">
            {content.right_label}
          </ThemedText>
        </View>
      </View>

      {!isReadOnly && (
        <View className="px-4" style={{ paddingBottom: bottom + 24 }}>
          <CTAButton label="Submit" onPress={() => onComplete({ value })} />
        </View>
      )}
    </View>
  );
}
