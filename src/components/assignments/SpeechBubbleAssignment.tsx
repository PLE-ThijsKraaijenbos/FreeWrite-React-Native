import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BackButton } from '@/components/BackButton';
import { CTAButton } from '@/components/cta';
import { SwipeOption } from '@/components/SwipeOption';
import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';
import { SpeechBubbleContent } from '@/types/journey';

type Attribution = 'self' | 'addiction';
type Classification = { bubble: string; attribution: Attribution };

type Props = {
  content: SpeechBubbleContent;
  responseData?: unknown;
  onComplete: (responseData: unknown) => void;
};

export function SpeechBubbleAssignment({ content, responseData, onComplete }: Props) {
  const router = useRouter();
  const theme = useTheme();
  const { top, bottom } = useSafeAreaInsets();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selections, setSelections] = useState<Record<number, Attribution>>({});

  const saved = responseData as { classifications?: Classification[] } | undefined;
  const isReadOnly = saved?.classifications != null;

  const bubbles = content.bubbles;
  const total = bubbles.length;
  const isDone = currentIndex >= total;

  function handleSwipe(attribution: Attribution) {
    setSelections((prev) => ({ ...prev, [currentIndex]: attribution }));
    setCurrentIndex((prev) => prev + 1);
  }

  function handleSubmit() {
    onComplete({
      classifications: bubbles.map((bubble, i) => ({
        bubble: bubble.text,
        attribution: selections[i],
      })),
    });
  }

  return (
    <View className="flex-1" style={{ backgroundColor: theme.background }}>
      <View className="px-4 pb-3" style={{ paddingTop: top + 16 }}>
        <BackButton onPress={() => router.back()} />
      </View>

      {isReadOnly ? (
        <ScrollView className="flex-1 px-4" contentContainerClassName="pb-8">
          <ThemedText type="h2" className="mb-6">
            {content.title_text}
          </ThemedText>
          {saved!.classifications!.map((item, index) => (
            <View
              key={index}
              className="mb-4 p-4 rounded-2xl"
              style={{ backgroundColor: theme.backgroundElement }}>
              <ThemedText className="mb-2">{item.bubble}</ThemedText>
              <View
                className={`self-start px-3 py-1 rounded-full ${item.attribution === 'self' ? 'bg-primary' : 'bg-amber-500'}`}>
                <ThemedText type="body-sm-bold" className="text-white">
                  {item.attribution === 'self' ? 'Me' : 'Addiction'}
                </ThemedText>
              </View>
            </View>
          ))}
        </ScrollView>
      ) : (
        <>
          <View className="px-4 mb-4">
            <ThemedText type="h2">{content.title_text}</ThemedText>
            <ThemedText themeColor="textSecondary" className="mt-1">
              {isDone ? 'All done!' : `${currentIndex + 1} of ${total}`}
            </ThemedText>
          </View>

          <View className="flex-1 px-4 justify-center">
            {isDone ? null : (
              <View className="relative h-[280px]">
                <SwipeOption
                  key={currentIndex}
                  text={bubbles[currentIndex].text}
                  onSwipeLeft={() => handleSwipe('addiction')}
                  onSwipeRight={() => handleSwipe('self')}
                />
              </View>
            )}
          </View>

          {!isDone && (
            <ThemedText
              themeColor="textSecondary"
              className="text-center text-body-sm mb-3">
              ← addiction · me →
            </ThemedText>
          )}

          <View className="px-4 flex-row gap-3" style={{ paddingBottom: bottom + 24 }}>
            {isDone ? (
              <CTAButton label="Submit" onPress={handleSubmit} />
            ) : (
              <>
                <Pressable
                  onPress={() => handleSwipe('addiction')}
                  className="flex-1 items-center py-4 rounded-xl bg-amber-500">
                  <ThemedText type="body-bold" className="text-white">Addiction</ThemedText>
                </Pressable>
                <Pressable
                  onPress={() => handleSwipe('self')}
                  className="flex-1 items-center py-4 rounded-xl bg-primary">
                  <ThemedText type="body-bold" className="text-white">Me</ThemedText>
                </Pressable>
              </>
            )}
          </View>
        </>
      )}
    </View>
  );
}
