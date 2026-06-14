import { LinearGradient } from 'expo-linear-gradient';
import { cssInterop } from 'nativewind';
import { Children, useEffect, useMemo, useState } from 'react';
import { LayoutRectangle, Pressable, View } from 'react-native';
import Animated, {
  Easing,
  runOnJS,
  type SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

cssInterop(LinearGradient, { className: 'style' });

const BUBBLE_SIZE = 120;
const FLOAT_RADIUS = 5;
const FLOAT_SPEED = 5;

type BubblesProps = {
  children: React.ReactNode;
  onAllPopped?: () => void;
};

export function Bubbles({ children, onAllPopped }: BubblesProps) {
  const items = Children.toArray(children);
  const [area, setArea] = useState<LayoutRectangle | null>(null);
  const [popped, setPopped] = useState<Set<number>>(new Set());
  const [offsets] = useState(() =>
    items.map(() => ({ x: Math.random() * 2 - 1, y: Math.random() * 2 - 1 })),
  );

  const positions = useMemo(
    () => (area ? placeBubbles(area, offsets) : []),
    [area, offsets],
  );

  useEffect(() => {
    if (items.length > 0 && popped.size >= items.length) onAllPopped?.();
  }, [popped, items.length, onAllPopped]);

  function handlePop(index: number) {
    setPopped((prev) => new Set(prev).add(index));
  }

  return (
    <View className="flex-1" onLayout={(e) => setArea(e.nativeEvent.layout)}>
      {positions.map((pos, index) =>
        popped.has(index) ? null : (
          <Bubble key={index} x={pos.x} y={pos.y} onPop={() => handlePop(index)}>
            {items[index]}
          </Bubble>
        ),
      )}
    </View>
  );
}

type BubbleProps = {
  x: number;
  y: number;
  onPop: () => void;
  children: React.ReactNode;
};

function Bubble({ x, y, onPop, children }: BubbleProps) {
  const scale = useSharedValue(1);
  const tx = useSharedValue(0);
  const ty = useSharedValue(0);

  useEffect(() => {
    // Drive each axis on its own random-waypoint chain. Because x and y turn at
    // different moments, the combined motion never stalls at a corner — it
    // keeps a steady pace while still easing smoothly into each new direction.
    const drive = (value: SharedValue<number>) => {
      let current = (Math.random() * 2 - 1) * FLOAT_RADIUS;
      value.value = current;

      function step() {
        let next = (Math.random() * 2 - 1) * FLOAT_RADIUS;
        for (let i = 0; i < 5 && Math.abs(next - current) < FLOAT_RADIUS; i++) {
          next = (Math.random() * 2 - 1) * FLOAT_RADIUS;
        }

        const duration = Math.max(1, (Math.abs(next - current) / FLOAT_SPEED) * 1000);
        current = next;

        value.value = withTiming(next, { duration, easing: Easing.inOut(Easing.sin) }, (finished) => {
          if (finished) runOnJS(step)();
        });
      }

      step();
    };

    drive(tx);
    drive(ty);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: tx.value },
      { translateY: ty.value },
      { scale: scale.value },
    ],
  }));

  function handlePress() {
    scale.value = withTiming(0, { duration: 250 }, (finished) => {
      if (finished) runOnJS(onPop)();
    });
  }

  return (
    <Animated.View style={[{ position: 'absolute', left: x, top: y }, animatedStyle]}>
      <Pressable onPress={handlePress}>
        <LinearGradient
          colors={['#FCAA88', '#F47D4E']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          className="h-[120px] w-[120px] items-center justify-center rounded-full p-2">
          {children}
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
}

const ROWS = [2, 1, 2];

type Offset = { x: number; y: number };

function placeBubbles(area: LayoutRectangle, offsets: Offset[]) {
  const jitterX = area.width * 0.04;
  const jitterY = area.height * 0.025;
  const half = BUBBLE_SIZE / 2;
  const clamp = (value: number, max: number) => Math.min(Math.max(0, value), Math.max(0, max));

  const positions: { x: number; y: number }[] = [];
  let index = 0;

  ROWS.forEach((cols, row) => {
    const baseY = (area.height * (row + 0.5)) / ROWS.length - half;

    for (let col = 0; col < cols; col++) {
      const baseX = (area.width * (col + 0.5)) / cols - half;
      const offset = offsets[index] ?? { x: 0, y: 0 };
      positions.push({
        x: clamp(baseX + offset.x * jitterX, area.width - BUBBLE_SIZE),
        y: clamp(baseY + offset.y * jitterY, area.height - BUBBLE_SIZE),
      });
      index++;
    }
  });

  return positions;
}
