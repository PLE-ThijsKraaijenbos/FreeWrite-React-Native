import { useState } from 'react';
import { View } from 'react-native';

import { AssignmentLayout } from '@/components/assignments/AssignmentLayout';
import { CTAButton, CTASmall, DoubleCTA } from '@/components/cta';
import { Divider } from '@/components/Divider';
import { SwipeOption } from '@/components/SwipeOption';
import { ThemedText } from '@/components/themed-text';
import { shadows } from '@/constants/shadows';
import { SpeechBubbleContent } from '@/types/journey';

type Attribution = 'self' | 'addiction';
type Classification = { bubble: string; attribution: Attribution };

type Props = {
  content: SpeechBubbleContent;
  responseData?: unknown;
  onComplete: (responseData: unknown) => void;
};

export function SpeechBubbleAssignment({ content, responseData, onComplete }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selections, setSelections] = useState<Record<number, Attribution>>({});

  const saved = responseData as { classifications?: Classification[] } | undefined;
  const isReadOnly = saved?.classifications != null;

  const bubbles = content.bubbles;
  const total = bubbles.length;
  const isDone = currentIndex >= total;

  function handleSwipe(attribution: Attribution) {
    setSelections((prev) => ({ ...prev, [currentIndex]: attribution }));
    setCurrentIndex((prev) => prev + 1);
  }

  function handleSubmit() {
    onComplete({
      classifications: bubbles.map((bubble, i) => ({
        bubble: bubble.text,
        attribution: selections[i],
      })),
    });
  }

  if (isReadOnly) {
    return (
      <AssignmentLayout title={content.title_text} scroll>
        <View className="gap-4">
          {saved!.classifications!.map((item, index) => (
            <View key={index} style={shadows.drop} className="gap-3 p-4 rounded-2xl bg-neutral-200">
              <ThemedText type="body" className="text-neutral-600">
                {item.bubble}
              </ThemedText>
              <View className="self-start">
                <CTASmall
                  label={item.attribution === 'self' ? 'Me' : 'Addiction'}
                  variant={item.attribution === 'self' ? 'primary' : 'secondary'}
                />
              </View>
            </View>
          ))}
        </View>
      </AssignmentLayout>
    );
  }

  return (
    <AssignmentLayout title={content.title_text}>
      {isDone ? (
        <View className="flex-1 justify-center">
          <ThemedText type="body" className="text-center">All done!</ThemedText>
        </View>
      ) : (
        <View className="flex-1 relative">
          <SwipeOption
            key={currentIndex}
            text={bubbles[currentIndex].text}
            onSwipeLeft={() => handleSwipe('addiction')}
            onSwipeRight={() => handleSwipe('self')}
          />
        </View>
      )}

      <Divider />

      {isDone ? (
        <CTAButton label="Continue" onPress={handleSubmit} />
      ) : (
        <DoubleCTA
          variant="secondary"
          leftLabel="Addiction"
          rightLabel="Me"
          onPressLeft={() => handleSwipe('addiction')}
          onPressRight={() => handleSwipe('self')}
        />
      )}
    </AssignmentLayout>
  );
}
