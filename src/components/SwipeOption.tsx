import { useEffect } from 'react';
import { View, useWindowDimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { shadows } from '@/constants/shadows';

const SWIPE_THRESHOLD = 80;

type Props = {
  text: string;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
};

export function SwipeOption({ text, onSwipeLeft, onSwipeRight }: Props) {
  const { width } = useWindowDimensions();
  const tx = useSharedValue(0);
  const scale = useSharedValue(0.9);

  useEffect(() => {
    scale.value = withSequence(
      withTiming(1.1, { duration: 150, easing: Easing.out(Easing.cubic) }),
      withTiming(1, { duration: 150, easing: Easing.out(Easing.cubic) }),
    );
  }, []);

  const pan = Gesture.Pan()
    .onUpdate((e) => {
      tx.value = e.translationX;
    })
    .onEnd((e) => {
      if (Math.abs(e.translationX) < SWIPE_THRESHOLD) {
        tx.value = withSpring(0);
        return;
      }
      const swipedRight = e.translationX > 0;
      tx.value = withTiming(
        swipedRight ? width : -width,
        { duration: 250, easing: Easing.out(Easing.cubic) },
        (finished) => {
          if (finished) runOnJS(swipedRight ? onSwipeRight : onSwipeLeft)();
        },
      );
    });

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateX: tx.value }],
  }));

  return (
    <GestureDetector gesture={pan}>
      <Animated.View
        style={cardStyle}
        className="absolute inset-0 z-10 flex-row items-center justify-center">
        <View style={shadows.drop} className="flex-1 items-center justify-center self-stretch rounded-lg bg-neutral-100 p-8">
          <ThemedText type="h2" className="max-w-[210px] text-center">
            {text}
          </ThemedText>
        </View>
      </Animated.View>
    </GestureDetector>
  );
}
