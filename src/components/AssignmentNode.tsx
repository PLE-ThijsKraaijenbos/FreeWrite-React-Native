import { View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { colors } from '@/constants/tokens';
import { StepStatus } from '@/types/journey';

import CheckIcon from '@/assets/icons/check.svg';
import LockOutlineIcon from '@/assets/icons/lock-outline.svg';

type NodeVariant = 'available' | 'completed' | 'locked' | 'selected';

const NODE_PALETTE: Record<NodeVariant, { fill: string; stroke: string; shadow: string }> = {
  available: {
    fill: colors.neutral[200],
    stroke: colors.neutral[300],
    shadow: colors.neutral[400],
  },
  completed: {
    fill: colors.primary[400],
    stroke: colors.primary[500],
    shadow: colors.primary[600],
  },
  locked: {
    fill: colors.neutral[400],
    stroke: colors.neutral[500],
    shadow: colors.neutral[600],
  },
  selected: {
    fill: colors.secondary[300],
    stroke: colors.secondary[400],
    shadow: colors.secondary[500],
  },
};

function variantForStatus(status: StepStatus): NodeVariant {
  switch (status) {
    case 'COMPLETED':
      return 'completed';
    case 'UNAVAILABLE':
      return 'locked';
    default:
      return 'available';
  }
}

const ART_WIDTH = 75;
const ART_HEIGHT = 79;
const CHECK_COLOR = colors.primary[100];
const LOCK_COLOR = colors.neutral[600];

interface AssignmentNodeProps {
  status: StepStatus;
  selected?: boolean;
  size?: number;
}

export function AssignmentNode({ status, selected = false, size = 56 }: AssignmentNodeProps) {
  const colorVariant = selected ? 'selected' : variantForStatus(status);
  const { fill, stroke, shadow } = NODE_PALETTE[colorVariant];

  const width = size;
  const height = (size * ART_HEIGHT) / ART_WIDTH;
  const iconSize = size * 0.7;
  const iconOffset = (size * 4) / ART_WIDTH;

  return (
    <View style={{ width, height }}>
      <Svg width={width} height={height} viewBox={`0 0 ${ART_WIDTH} ${ART_HEIGHT}`}>
        <Circle cx={37.5} cy={41.5} r={37.5} fill={shadow} />
        <Circle cx={37.5} cy={37.5} r={37.5} fill={fill} />
        <Circle cx={37.5} cy={37.5} r={35.5} fill="none" stroke={stroke} strokeWidth={4} />
      </Svg>

      {(status === 'COMPLETED' || status === 'UNAVAILABLE') && (
        <View
          className="absolute inset-0 items-center justify-center"
          style={{ marginBottom: iconOffset }}
        >
          {status === 'COMPLETED' ? (
            <CheckIcon width={iconSize} height={iconSize} color={CHECK_COLOR} />
          ) : (
            <LockOutlineIcon width={iconSize} height={iconSize} color={LOCK_COLOR} />
          )}
        </View>
      )}
    </View>
  );
}
