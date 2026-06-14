import { useMemo } from 'react';
import Svg, { Path } from 'react-native-svg';

import { colors } from '@/constants/tokens';

export type Point = { x: number; y: number };


const CURVINESS = 0.5;

const dist = (a: Point, b: Point) => Math.hypot(b.x - a.x, b.y - a.y);
const dir = (from: Point, to: Point): Point => {
  const m = Math.hypot(to.x - from.x, to.y - from.y) || 1;
  return { x: (to.x - from.x) / m, y: (to.y - from.y) / m };
};

export function buildSmoothPath(points: Point[]): string {
  if (points.length < 2) return '';
  const d = [`M ${points[0].x} ${points[0].y}`];
  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];
    const p0 = points[i - 1] ?? p1;
    const p3 = points[i + 2] ?? p2;
    const len = dist(p1, p2) * CURVINESS;
    const t1 = dir(p0, p2);
    const t2 = dir(p1, p3);
    const cp1x = p1.x + t1.x * len;
    const cp1y = p1.y + t1.y * len;
    const cp2x = p2.x - t2.x * len;
    const cp2y = p2.y - t2.y * len;
    d.push(`C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${p2.x} ${p2.y}`);
  }
  return d.join(' ');
}

type JourneyPathProps = {
  points: Point[];
  width: number;
  height: number;
};

// Dashed curved connector drawn behind the nodes. Sized to the full content so
// path coordinates map 1:1 to node positions.
export function JourneyPath({ points, width, height }: JourneyPathProps) {
  const d = useMemo(() => buildSmoothPath(points), [points]);

  if (!width || points.length < 2) return null;

  return (
    <Svg
      pointerEvents="none"
      width={width}
      height={height}
      style={{ position: 'absolute', left: 0, top: 0 }}>
      <Path
        d={d}
        stroke={colors.primary[100]}
        strokeWidth={8}
        strokeDasharray={[40]}
        strokeLinecap="square"
        fill="none"
      />
    </Svg>
  );
}
