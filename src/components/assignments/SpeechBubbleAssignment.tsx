import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, View, useWindowDimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CTAButton } from '@/components/cta';
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

const SWIPE_THRESHOLD = 80;
const CARD_HEIGHT = 280;

function SwipeCard({
  text,
  onSwipe,
  theme,
}: {
  text: string;
  onSwipe: (attr: Attribution) => void;
  theme: ReturnType<typeof useTheme>;
}) {
  const { width: screenWidth } = useWindowDimensions();
  const tx = useSharedValue(0);
  const ty = useSharedValue(0);

  const gesture = Gesture.Pan()
    .onUpdate((e) => {
      tx.value = e.translationX;
      ty.value = e.translationY * 0.1;
    })
    .onEnd((e) => {
      const committed = Math.abs(e.translationX) > SWIPE_THRESHOLD || Math.abs(e.velocityX) > 600;
      if (committed) {
        const isRight = e.translationX > 0;
        tx.value = withTiming(
          isRight ? screenWidth * 1.5 : -screenWidth * 1.5,
          { duration: 250 },
          (finished) => {
            if (finished) runOnJS(onSwipe)(isRight ? 'self' : 'addiction');
          },
        );
      } else {
        tx.value = withSpring(0);
        ty.value = withSpring(0);
      }
    });

  const cardStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: tx.value },
      { translateY: ty.value },
      { rotate: `${interpolate(tx.value, [-screenWidth / 2, screenWidth / 2], [-15, 15])}deg` },
    ],
  }));

  const meOpacity = useAnimatedStyle(() => ({
    opacity: interpolate(tx.value, [20, SWIPE_THRESHOLD], [0, 1], 'clamp'),
  }));

  const addictionOpacity = useAnimatedStyle(() => ({
    opacity: interpolate(tx.value, [-SWIPE_THRESHOLD, -20], [1, 0], 'clamp'),
  }));

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        style={[cardStyle, { position: 'absolute', width: '100%', height: CARD_HEIGHT, zIndex: 10 }]}>
        <View
          className="flex-1 rounded-3xl p-6"
          style={{ backgroundColor: theme.backgroundElement }}>
          <Animated.View
            style={[
              meOpacity,
              {
                position: 'absolute',
                top: 20,
                left: 20,
                backgroundColor: '#3c87f7',
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 8,
              },
            ]}>
            <ThemedText className="text-white font-bold text-base">ME</ThemedText>
          </Animated.View>

          <Animated.View
            style={[
              addictionOpacity,
              {
                position: 'absolute',
                top: 20,
                right: 20,
                backgroundColor: '#F59E0B',
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 8,
              },
            ]}>
            <ThemedText className="text-white font-bold text-base">
              ADDICTION
            </ThemedText>
          </Animated.View>

          <ThemedText className="text-lg leading-7 mt-14">{text}</ThemedText>
        </View>
      </Animated.View>
    </GestureDetector>
  );
}

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
        <Pressable onPress={() => router.back()}>
          <ThemedText themeColor="textSecondary">← Back</ThemedText>
        </Pressable>
      </View>

      {isReadOnly ? (
        <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 32 }}>
          <ThemedText type="subtitle" className="mb-6">
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
                <ThemedText className="text-white text-xs font-semibold">
                  {item.attribution === 'self' ? 'Me' : 'Addiction'}
                </ThemedText>
              </View>
            </View>
          ))}
        </ScrollView>
      ) : (
        <>
          <View className="px-4 mb-4">
            <ThemedText type="subtitle">{content.title_text}</ThemedText>
            <ThemedText themeColor="textSecondary" className="mt-1">
              {isDone ? 'All done!' : `${currentIndex + 1} of ${total}`}
            </ThemedText>
          </View>

          <View className="flex-1 px-4 justify-center">
            {isDone ? null : (
              <View style={{ height: CARD_HEIGHT + 32, position: 'relative' }}>
                {([2, 1] as const).map((offset) => {
                  if (currentIndex + offset >= total) return null;
                  return (
                    <View
                      key={currentIndex + offset}
                      className="absolute w-full rounded-3xl"
                      style={{
                        height: CARD_HEIGHT,
                        backgroundColor: theme.backgroundElement,
                        zIndex: offset === 1 ? 5 : 1,
                        transform: [
                          { scale: offset === 1 ? 0.94 : 0.88 },
                          { translateY: offset === 1 ? 10 : 20 },
                        ],
                      }}
                    />
                  );
                })}
                <SwipeCard
                  key={currentIndex}
                  text={bubbles[currentIndex].text}
                  onSwipe={handleSwipe}
                  theme={theme}
                />
              </View>
            )}
          </View>

          {!isDone && (
            <ThemedText
              themeColor="textSecondary"
              className="text-center text-[13px] mb-3">
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
                  <ThemedText className="text-white font-semibold">Addiction</ThemedText>
                </Pressable>
                <Pressable
                  onPress={() => handleSwipe('self')}
                  className="flex-1 items-center py-4 rounded-xl bg-primary">
                  <ThemedText className="text-white font-semibold">Me</ThemedText>
                </Pressable>
              </>
            )}
          </View>
        </>
      )}
    </View>
  );
}
