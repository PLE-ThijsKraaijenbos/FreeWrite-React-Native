import { useState } from 'react';
import { View } from 'react-native';

import { AssignmentLayout } from '@/components/assignments/AssignmentLayout';
import { DoubleCTA } from '@/components/cta';
import { Divider } from '@/components/Divider';
import { SelectOption } from '@/components/SelectOption';
import { ThemedText } from '@/components/themed-text';
import { ChoiceStoryContent } from '@/types/journey';

type PathEntry = { nodeId: string; choiceLabel: string };
type SavedData = { path?: PathEntry[]; ending?: string };

type Props = {
  content: ChoiceStoryContent;
  responseData?: unknown;
  onComplete: (responseData: unknown) => void;
};

export function ChoiceStoryAssignment({ content, responseData, onComplete }: Props) {
  const [currentNodeId, setCurrentNodeId] = useState('start');
  const [path, setPath] = useState<PathEntry[]>([]);

  const saved = responseData as SavedData | undefined;
  const isReadOnly = saved?.path != null;

  // Read-only (completed): show the option that was picked and its response.
  if (isReadOnly) {
    const savedPath = saved!.path ?? [];
    const lastEntry = savedPath[savedPath.length - 1];
    const lastChoice = lastEntry
      ? content.story_content[lastEntry.nodeId]?.choices.find((c) => c.label === lastEntry.choiceLabel)
      : undefined;
    const responseNode = lastChoice ? content.story_content[lastChoice.next] : null;

    return (
      <AssignmentLayout title={content.title_text} scroll>
        {lastEntry && <SelectOption label={lastEntry.choiceLabel} selected />}
        <Divider />
        {responseNode && (
          <ThemedText type="body" className="text-neutral-600">
            {responseNode.text}
          </ThemedText>
        )}
      </AssignmentLayout>
    );
  }

  const currentNode = content.story_content[currentNodeId];

  if (!currentNode) {
    return (
      <AssignmentLayout title={content.title_text}>
        <ThemedText>Story node not found.</ThemedText>
      </AssignmentLayout>
    );
  }

  function handleChoice(choiceLabel: string, nextNodeId: string) {
    setPath((prev) => [...prev, { nodeId: currentNodeId, choiceLabel }]);
    setCurrentNodeId(nextNodeId);
  }

  function handlePickAgain() {
    setPath([]);
    setCurrentNodeId('start');
  }

  function handleDone() {
    onComplete({ path, ending: currentNode.ending ?? currentNode.text });
  }

  // Decision point: prompt + the available options.
  if (currentNode.choices.length > 0) {
    return (
      <AssignmentLayout title={content.title_text} scroll>
        <ThemedText type="body" className="text-neutral-600">
          {currentNode.text}
        </ThemedText>
        <Divider />
        <View className="gap-3">
          {currentNode.choices.map((choice, index) => (
            <SelectOption
              key={index}
              label={choice.label}
              onPress={() => handleChoice(choice.label, choice.next)}
            />
          ))}
        </View>
      </AssignmentLayout>
    );
  }

  // Terminal node: chosen option (highlighted) + its response + pick again / done.
  const lastEntry = path[path.length - 1];

  return (
    <AssignmentLayout title={content.title_text} scroll>
      {lastEntry && <SelectOption label={lastEntry.choiceLabel} selected />}
      <Divider />
      <ThemedText type="body" className="text-neutral-600">
        {currentNode.text}
      </ThemedText>
      <DoubleCTA
        leftLabel="Pick again"
        rightLabel="Done"
        onPressLeft={handlePickAgain}
        onPressRight={handleDone}
      />
    </AssignmentLayout>
  );
}
