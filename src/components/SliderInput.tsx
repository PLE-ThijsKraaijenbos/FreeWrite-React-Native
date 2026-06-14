import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { useEffect } from 'react';
import { View } from 'react-native';

import { ThemedText } from '@/components/themed-text';

const TRACK_HEIGHT = 10;
const THUMB_SIZE = 24;

type Props = {
  value: number;
  minimumValue?: number;
  maximumValue?: number;
  step?: number;
  disabled?: boolean;
  onValueChange?: (value: number) => void;
  leftLabel?: string;
  rightLabel?: string;
};

export function SliderInput({
  value,
  minimumValue = 1,
  maximumValue = 10,
  step = 1,
  disabled = false,
  onValueChange,
  leftLabel,
  rightLabel,
}: Props) {
  const trackWidth = useSharedValue(0);
  const thumbX = useSharedValue(0);
  const startX = useSharedValue(0);

  useEffect(() => {
    if (trackWidth.value > 0) {
      thumbX.value =
        ((value - minimumValue) / (maximumValue - minimumValue)) * (trackWidth.value - THUMB_SIZE);
    }
  }, [value, minimumValue, maximumValue]);

  const pan = Gesture.Pan()
    .runOnJS(true)
    .enabled(!disabled)
    .onBegin((e) => {
      const maxX = trackWidth.value - THUMB_SIZE;
      const tapX = Math.max(0, Math.min(maxX, e.x - THUMB_SIZE / 2));
      const rawValue = minimumValue + (tapX / maxX) * (maximumValue - minimumValue);
      const steps = Math.round((rawValue - minimumValue) / step);
      const snappedValue = Math.max(minimumValue, Math.min(maximumValue, minimumValue + steps * step));
      thumbX.value = ((snappedValue - minimumValue) / (maximumValue - minimumValue)) * maxX;
      startX.value = tapX;
      onValueChange?.(snappedValue);
    })
    .onUpdate((e) => {
      const maxX = trackWidth.value - THUMB_SIZE;
      const rawX = Math.max(0, Math.min(maxX, startX.value + e.translationX));
      const rawValue = minimumValue + (rawX / maxX) * (maximumValue - minimumValue);
      const steps = Math.round((rawValue - minimumValue) / step);
      const snappedValue = Math.max(
        minimumValue,
        Math.min(maximumValue, minimumValue + steps * step),
      );
      thumbX.value = ((snappedValue - minimumValue) / (maximumValue - minimumValue)) * maxX;
      onValueChange?.(snappedValue);
    });

  const fillStyle = useAnimatedStyle(() => ({
    width: thumbX.value + THUMB_SIZE / 2,
  }));

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: thumbX.value }],
  }));

  return (
    <View>
      <GestureDetector gesture={pan}>
        <View
          className="relative justify-center"
          style={{ height: THUMB_SIZE }}
          onLayout={(e) => {
            const w = e.nativeEvent.layout.width;
            trackWidth.value = w;
            thumbX.value =
              ((value - minimumValue) / (maximumValue - minimumValue)) * (w - THUMB_SIZE);
          }}
        >
          <View
            className="absolute left-0 right-0 bg-neutral-400 rounded-full"
            style={{ height: TRACK_HEIGHT, top: (THUMB_SIZE - TRACK_HEIGHT) / 2 }}
          />
          <Animated.View
            className="absolute left-0 bg-secondary-400 rounded-full"
            style={[{ height: TRACK_HEIGHT, top: (THUMB_SIZE - TRACK_HEIGHT) / 2 }, fillStyle]}
          />
          <Animated.View
            className="absolute bg-secondary-300 rounded-full"
            style={[{ width: THUMB_SIZE, height: THUMB_SIZE }, thumbStyle]}
          />
        </View>
      </GestureDetector>

      {(leftLabel || rightLabel) && (
        <View className="flex-row justify-between mt-2">
          <ThemedText className="text-neutral-600" type="body-sm">
            {leftLabel}
          </ThemedText>
          <ThemedText className="text-neutral-600" type="body-sm">
            {rightLabel}
          </ThemedText>
        </View>
      )}
    </View>
  );
}
