import { useEffect, useRef } from 'react';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import MarkerIcon from '@/assets/icons/marker.svg';

type Point = { x: number; y: number };

const GLIDE = { duration: 340, easing: Easing.inOut(Easing.cubic) };
const BOB = { duration: 1100, easing: Easing.inOut(Easing.quad) };

type JourneyMarkerProps = {
  /** Top-left target for the marker, or null to hide it. */
  target: Point | null;
  width: number;
  height: number;
  /** Peak-to-peak vertical bob distance. */
  bob?: number;
};

// A single marker that glides to `target` when it changes, jumps into place the
// first time it appears, bobs gently while visible, and despawns instantly when
// `target` becomes null.
export function JourneyMarker({ target, width, height, bob = 0 }: JourneyMarkerProps) {
  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const opacity = useSharedValue(0);
  const bobValue = useSharedValue(0);
  const wasShown = useRef(false);

  useEffect(() => {
    if (!target) {
      opacity.value = 0; // instant despawn
      wasShown.current = false;
      return;
    }
    if (wasShown.current) {
      x.value = withTiming(target.x, GLIDE);
      y.value = withTiming(target.y, GLIDE);
    } else {
      // First appearance: jump into place rather than gliding in from afar.
      x.value = target.x;
      y.value = target.y;
    }
    opacity.value = 1;
    wasShown.current = true;
  }, [target]);

  const isVisible = !!target;
  useEffect(() => {
    if (isVisible) {
      bobValue.value = withRepeat(withTiming(1, BOB), -1, true);
    } else {
      cancelAnimation(bobValue);
      bobValue.value = 0;
    }
  }, [isVisible]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateX: x.value },
      { translateY: y.value + (bobValue.value - 0.5) * bob },
    ],
  }));

  return (
    <Animated.View pointerEvents="none" className="absolute left-0 top-0" style={style}>
      <MarkerIcon width={width} height={height} />
    </Animated.View>
  );
}
