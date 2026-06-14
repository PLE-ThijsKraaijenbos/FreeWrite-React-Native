import { useState } from 'react';
import { useWindowDimensions, View } from 'react-native';

import { colors } from '@/constants/tokens';

import JourneyBgShape from '@/assets/images/journey-bg-shape.svg';

const SHAPE_RATIO = 219 / 402;
const TOP_OFFSET_RATIO = 0.15;
const SHADES = [
  colors.primary[200],
  colors.primary[300],
  colors.primary[400],
  colors.primary[500],
];

type JourneyBackgroundProps = {
  topInset?: number;
};

export function JourneyBackground({ topInset = 0 }: JourneyBackgroundProps) {
  const { width, height: windowHeight } = useWindowDimensions();
  const [areaHeight, setAreaHeight] = useState(0);

  const height = areaHeight || windowHeight;
  const shapeHeight = width * SHAPE_RATIO;
  const top = topInset + shapeHeight * TOP_OFFSET_RATIO;
  // Divide into SHADES.length + 1 bands: the top hills are spaced by `spacing`
  // and the front (bottom) hill gets the extra band, so it has the same kind of
  // breathing room below its crest as the others do above the next hill.
  const spacing = (height - top) / (SHADES.length + 1);

  return (
    <View
      pointerEvents="none"
      className="absolute inset-0"
      onLayout={(e) => setAreaHeight(e.nativeEvent.layout.height)}>
      {SHADES.map((color, i) => (
        <View
          key={color}
          style={{ position: 'absolute', left: 0, right: 0, top: top + i * spacing, bottom: 0 }}>
          <JourneyBgShape color={color} width={width} height={shapeHeight} />
          <View style={{ flex: 1, backgroundColor: color }} />
        </View>
      ))}
    </View>
  );
}
