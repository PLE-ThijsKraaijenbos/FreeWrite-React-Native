import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AssignmentLayout } from '@/components/assignments/AssignmentLayout';
import { Bubbles } from '@/components/Bubbles';
import { CTAButton } from '@/components/cta';
import { Divider } from '@/components/Divider';
import { ThemedText } from '@/components/themed-text';
import { BubblePopContent } from '@/types/journey';

type Props = {
  content: BubblePopContent;
  responseData?: unknown;
  onComplete: (responseData: unknown) => void;
};

export function BubblePopAssignment({ content, responseData, onComplete }: Props) {
  const [poppedAll, setPoppedAll] = useState(false);

  const saved = responseData as { popped_all?: boolean } | undefined;
  const isReadOnly = saved?.popped_all === true;
  const done = isReadOnly || poppedAll;

  return (
    <AssignmentLayout title={content.title_text}>
      {done ? (
        <View className="flex-1 justify-center">
          <ThemedText type="body" className="text-center">
            All negative thought bubbles have been popped!
          </ThemedText>
        </View>
      ) : (
        <View className="flex-1">
          <Bubbles onAllPopped={() => setPoppedAll(true)}>
            {content.thoughts.map((thought, index) => (
              <ThemedText
                key={index}
                type="body-sm-bold"
                style={styles.bubbleText}
                className="max-w-[99px] text-center text-neutral-100">
                {thought.text}
              </ThemedText>
            ))}
          </Bubbles>
        </View>
      )}

      <Divider />

      {done && !isReadOnly && (
        <CTAButton label="Continue" onPress={() => onComplete({ popped_all: true })} />
      )}
    </AssignmentLayout>
  );
}

const styles = StyleSheet.create({
  bubbleText: {
    textShadowColor: 'rgba(0,0,0,0.50)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 2,
  },
});
