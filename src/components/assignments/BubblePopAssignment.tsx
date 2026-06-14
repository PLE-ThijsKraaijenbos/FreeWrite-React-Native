import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BackButton } from '@/components/BackButton';
import { Bubbles } from '@/components/Bubbles';
import { CTAButton } from '@/components/cta';
import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';
import { BubblePopContent } from '@/types/journey';

type Props = {
  content: BubblePopContent;
  responseData?: unknown;
  onComplete: (responseData: unknown) => void;
};

export function BubblePopAssignment({ content, responseData, onComplete }: Props) {
  const router = useRouter();
  const theme = useTheme();
  const { top, bottom } = useSafeAreaInsets();
  const [poppedAll, setPoppedAll] = useState(false);

  const saved = responseData as { popped_all?: boolean } | undefined;
  const isReadOnly = saved?.popped_all === true;
  const total = content.thoughts.length;

  return (
    <View className="flex-1" style={{ backgroundColor: theme.background }}>
      <View className="px-4 pb-3" style={{ paddingTop: top + 16 }}>
        <BackButton onPress={() => router.back()} />
      </View>

      <View className="flex-1 px-4" style={{ paddingBottom: bottom }}>
        <ThemedText type="h2" className="mb-6">
          {content.title_text}
        </ThemedText>

        {isReadOnly ? (
          <View className="p-4 rounded-2xl" style={{ backgroundColor: theme.backgroundElement }}>
            <ThemedText themeColor="textSecondary">
              You popped all {total} thought{total !== 1 ? 's' : ''}.
            </ThemedText>
          </View>
        ) : (
          <Bubbles onAllPopped={() => setPoppedAll(true)}>
            {content.thoughts.map((thought, index) => (
              <ThemedText
                key={index}
                type="body-sm-bold"
                style={styles.bubbleText}
                className="max-w-[99px] text-center text-neutral-100">
                {thought.text}
              </ThemedText>
            ))}
          </Bubbles>
        )}
      </View>

      {!isReadOnly && poppedAll && (
        <View className="px-4" style={{ paddingBottom: bottom + 24 }}>
          <CTAButton label="Done" onPress={() => onComplete({ popped_all: true })} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  bubbleText: {
    textShadowColor: 'rgba(0,0,0,0.50)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 2,
  },
});
