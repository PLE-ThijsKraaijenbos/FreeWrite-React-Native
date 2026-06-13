import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BackButton } from '@/components/BackButton';
import { CTAButton } from '@/components/cta';
import { SliderInput } from '@/components/SliderInput';
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
        <BackButton onPress={() => router.back()} />
      </View>

      <View className="flex-1 justify-center px-6">
        <ThemedText type="subtitle" className="mb-12">
          {content.title_text}
        </ThemedText>

        <SliderInput
          value={displayValue}
          minimumValue={1}
          maximumValue={10}
          step={1}
          disabled={isReadOnly}
          onValueChange={setValue}
          leftLabel={content.left_label}
          rightLabel={content.right_label}
        />
      </View>

      {!isReadOnly && (
        <View className="px-4" style={{ paddingBottom: bottom + 24 }}>
          <CTAButton label="Submit" onPress={() => onComplete({ value })} />
        </View>
      )}
    </View>
  );
}
