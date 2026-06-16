import { useState } from 'react';

import { AssignmentLayout } from '@/components/assignments/AssignmentLayout';
import { CTAButton } from '@/components/cta';
import { Divider } from '@/components/Divider';
import { SliderInput } from '@/components/SliderInput';
import { ThemedText } from '@/components/themed-text';
import { ScaleContent } from '@/types/journey';

type Props = {
  content: ScaleContent;
  responseData?: unknown;
  onComplete: (responseData: unknown) => void;
};

export function ScaleAssignment({ content, responseData, onComplete }: Props) {
  const [value, setValue] = useState<number>(5);

  const saved = responseData as { value?: number } | undefined;
  const savedValue = saved?.value ?? null;
  const displayValue = savedValue ?? value;
  const isReadOnly = savedValue != null;

  return (
    <AssignmentLayout title={content.title_text}>
      <ThemedText type="body">Move the slider to the point that feels most true for you.</ThemedText>

      <SliderInput
        value={displayValue}
        minimumValue={1}
        maximumValue={10}
        step={1}
        disabled={isReadOnly}
        onValueChange={setValue}
        leftLabel={content.left_label}
        rightLabel={content.right_label}
      />

      {!isReadOnly && (
        <>
          <Divider />
          <CTAButton label="Save" onPress={() => onComplete({ value })} />
        </>
      )}
    </AssignmentLayout>
  );
}
