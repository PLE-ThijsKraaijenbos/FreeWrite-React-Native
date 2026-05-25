import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';
import { BubblePopContent } from '@/types/journey';

type Props = {
  content: BubblePopContent;
  responseData?: unknown;
  onComplete: (responseData: unknown) => void;
};

function Bubble({ text, onPop }: { text: string; onPop: () => void }) {
  const theme = useTheme();
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  function handlePress() {
    scale.value = withTiming(0, { duration: 300 });
    opacity.value = withTiming(0, { duration: 300 }, (finished) => {
      if (finished) runOnJS(onPop)();
    });
  }

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={handlePress}
        className="rounded-3xl px-4 py-2.5 m-1"
        style={{ backgroundColor: theme.backgroundElement }}>
        <ThemedText type="small">{text}</ThemedText>
      </Pressable>
    </Animated.View>
  );
}

export function BubblePopAssignment({ content, responseData, onComplete }: Props) {
  const router = useRouter();
  const theme = useTheme();
  const { top, bottom } = useSafeAreaInsets();
  const [poppedCount, setPoppedCount] = useState(0);

  const saved = responseData as { popped_all?: boolean } | undefined;
  const isReadOnly = saved?.popped_all === true;
  const total = content.thoughts.length;
  const allPopped = isReadOnly || poppedCount >= total;

  return (
    <View className="flex-1" style={{ backgroundColor: theme.background }}>
      <View className="px-4 pb-3" style={{ paddingTop: top + 16 }}>
        <Pressable onPress={() => router.back()}>
          <ThemedText themeColor="textSecondary">← Back</ThemedText>
        </Pressable>
      </View>

      <ScrollView className="flex-1 px-4">
        <ThemedText type="subtitle" className="mb-6">
          {content.title_text}
        </ThemedText>

        {isReadOnly ? (
          <View className="p-4 rounded-2xl" style={{ backgroundColor: theme.backgroundElement }}>
            <ThemedText themeColor="textSecondary">
              You popped all {total} thought{total !== 1 ? 's' : ''}.
            </ThemedText>
          </View>
        ) : (
          <View className="flex-row flex-wrap">
            {content.thoughts.map((thought, index) => (
              <Bubble
                key={index}
                text={thought.text}
                onPop={() => setPoppedCount((c) => c + 1)}
              />
            ))}
          </View>
        )}
      </ScrollView>

      {!isReadOnly && allPopped && (
        <View className="px-4" style={{ paddingBottom: bottom + 24 }}>
          <Pressable
            onPress={() => onComplete({ popped_all: true })}
            className="items-center justify-center py-4 rounded-xl bg-green-500">
            <ThemedText className="text-white font-bold">Done</ThemedText>
          </Pressable>
        </View>
      )}
    </View>
  );
}
