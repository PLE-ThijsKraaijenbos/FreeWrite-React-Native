import { useLocalSearchParams, useRouter } from 'expo-router';
import { View } from 'react-native';

import { BubblePopAssignment } from '@/components/assignments/BubblePopAssignment';
import { ChoiceStoryAssignment } from '@/components/assignments/ChoiceStoryAssignment';
import { JournalAssignment } from '@/components/assignments/JournalAssignment';
import { LetterAssignment } from '@/components/assignments/LetterAssignment';
import { ScaleAssignment } from '@/components/assignments/ScaleAssignment';
import { SpeechBubbleAssignment } from '@/components/assignments/SpeechBubbleAssignment';
import { ThemedText } from '@/components/themed-text';
import { useCompleteStep, useJourney } from '@/hooks/use-journey';
import { useTheme } from '@/hooks/use-theme';
import {
  BubblePopContent,
  ChoiceStoryContent,
  JournalContent,
  LetterContent,
  ScaleContent,
  SpeechBubbleContent,
} from '@/types/journey';

export default function AssignmentScreen() {
  const { progressId } = useLocalSearchParams<{ progressId: string }>();
  const router = useRouter();
  const theme = useTheme();
  const { data } = useJourney();
  const { mutate: completeStep, isError } = useCompleteStep();

  const progress = data?.step_progresses.find((p) => p.id === progressId);

  function handleComplete(responseData: unknown) {
    completeStep(
      { progressId, responseData },
      { onSuccess: () => router.replace('/journey/complete') },
    );
  }

  if (!progress) {
    return (
      <View
        className="flex-1 items-center justify-center"
        style={{ backgroundColor: theme.background }}>
        <ThemedText>Assignment not found.</ThemedText>
      </View>
    );
  }

  const { step, response_data } = progress;
  const { content } = step;

  if (!content) {
    return (
      <View
        className="flex-1 items-center justify-center"
        style={{ backgroundColor: theme.background }}>
        <ThemedText>No content available for this step.</ThemedText>
      </View>
    );
  }

  const sharedProps = {
    responseData: response_data ?? undefined,
    onComplete: handleComplete,
  };

  let assignment: React.ReactElement | null = null;

  switch (step.assignment_type) {
    case 'journal':
      assignment = <JournalAssignment content={content as JournalContent} {...sharedProps} />;
      break;
    case 'letter':
      assignment = <LetterAssignment content={content as LetterContent} {...sharedProps} />;
      break;
    case 'scale':
      assignment = <ScaleAssignment content={content as ScaleContent} {...sharedProps} />;
      break;
    case 'bubble_pop':
      assignment = <BubblePopAssignment content={content as BubblePopContent} {...sharedProps} />;
      break;
    case 'speech_bubble':
      assignment = <SpeechBubbleAssignment content={content as SpeechBubbleContent} {...sharedProps} />;
      break;
    case 'choice_story':
      assignment = <ChoiceStoryAssignment content={content as ChoiceStoryContent} {...sharedProps} />;
      break;
    default:
      return (
        <View
          className="flex-1 items-center justify-center"
          style={{ backgroundColor: theme.background }}>
          <ThemedText>Unknown assignment type.</ThemedText>
        </View>
      );
  }

  return (
    <View className="flex-1">
      {assignment}
      {isError && (
        <View
          className="absolute bottom-0 left-0 right-0 items-center pb-6"
          style={{ backgroundColor: theme.background }}>
          <ThemedText themeColor="textSecondary">Failed to submit. Please try again.</ThemedText>
        </View>
      )}
    </View>
  );
}
