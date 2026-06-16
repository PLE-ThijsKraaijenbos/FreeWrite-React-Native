import React from 'react';
import { Pressable } from 'react-native';

import { AssignmentNode } from '@/components/AssignmentNode';
import type { Point } from '@/components/JourneyPath';
import { JourneyStepProgress } from '@/types/journey';

type JourneyNodesProps = {
  positions: Point[];
  steps: JourneyStepProgress[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  size: number;
};

export const JourneyNodes = React.memo(({ positions, steps, selectedId, onSelect, size }: JourneyNodesProps) => {
  return (
    <>
      {positions.map((pos, i) => {
        const progress = steps[i];
        const isUnavailable = progress.status === 'UNAVAILABLE';
        return (
          <Pressable
            key={progress.id}
            disabled={isUnavailable}
            onPress={() => onSelect(progress.id)}
            style={{ position: 'absolute', left: pos.x, top: pos.y }}>
            <AssignmentNode
              status={progress.status}
              size={size}
              selected={progress.id === selectedId}
            />
          </Pressable>
        );
      })}
    </>
  );
});
