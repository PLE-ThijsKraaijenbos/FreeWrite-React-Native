import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BackButton } from '@/components/BackButton';
import { CTAButton } from '@/components/cta';
import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';
import { ChoiceStoryContent } from '@/types/journey';

type PathEntry = { nodeId: string; choiceLabel: string };
type SavedData = { path?: PathEntry[]; ending?: string };

type Props = {
  content: ChoiceStoryContent;
  responseData?: unknown;
  onComplete: (responseData: unknown) => void;
};

export function ChoiceStoryAssignment({ content, responseData, onComplete }: Props) {
  const router = useRouter();
  const theme = useTheme();
  const { top, bottom } = useSafeAreaInsets();
  const [currentNodeId, setCurrentNodeId] = useState('start');
  const [path, setPath] = useState<PathEntry[]>([]);

  const saved = responseData as SavedData | undefined;
  const isReadOnly = saved?.path != null;

  const currentNode = content.story_content[currentNodeId];
  const isTerminal = !isReadOnly && currentNode?.choices.length === 0;

  function handleChoice(choiceLabel: string, nextNodeId: string) {
    setPath((prev) => [...prev, { nodeId: currentNodeId, choiceLabel }]);
    setCurrentNodeId(nextNodeId);
  }

  function handleFinish() {
    onComplete({ path, ending: currentNode?.ending });
  }

  if (!isReadOnly && !currentNode) {
    return (
      <View className="flex-1 items-center justify-center" style={{ backgroundColor: theme.background }}>
        <ThemedText>Story node not found.</ThemedText>
      </View>
    );
  }

  const savedPath = saved?.path ?? [];
  const lastEntry = savedPath[savedPath.length - 1];
  const lastChoice = lastEntry
    ? content.story_content[lastEntry.nodeId]?.choices.find((c) => c.label === lastEntry.choiceLabel)
    : undefined;
  const terminalNode = lastChoice ? content.story_content[lastChoice.next] : null;

  return (
    <View className="flex-1" style={{ backgroundColor: theme.background }}>
      <View className="px-4 pb-3" style={{ paddingTop: top + 16 }}>
        <BackButton onPress={() => router.back()} />
      </View>

      <ScrollView className="flex-1 px-4">
        <ThemedText type="h2" className="mb-6">
          {content.title_text}
        </ThemedText>

        {isReadOnly ? (
          <View className="gap-4">
            {savedPath.map((entry, index) => {
              const node = content.story_content[entry.nodeId];
              return (
                <View key={index}>
                  <View className="p-4 rounded-2xl mb-2" style={{ backgroundColor: theme.backgroundElement }}>
                    <ThemedText>{node?.text}</ThemedText>
                  </View>
                  <View className="self-end px-3.5 py-2 rounded-full bg-primary">
                    <ThemedText type="body-bold" className="text-white">
                      {entry.choiceLabel}
                    </ThemedText>
                  </View>
                </View>
              );
            })}
            {terminalNode && (
              <View className="p-4 rounded-2xl" style={{ backgroundColor: theme.backgroundElement }}>
                <ThemedText>{terminalNode.text}</ThemedText>
              </View>
            )}
          </View>
        ) : (
          <View>
            <View className="p-4 rounded-2xl mb-6" style={{ backgroundColor: theme.backgroundElement }}>
              <ThemedText>{currentNode.text}</ThemedText>
            </View>

            {!isTerminal && (
              <View className="gap-3">
                {currentNode.choices.map((choice, index) => (
                  <Pressable
                    key={index}
                    onPress={() => handleChoice(choice.label, choice.next)}
                    className="py-4 px-4 rounded-xl"
                    style={{ backgroundColor: theme.backgroundElement }}>
                    <ThemedText type="body-bold">{choice.label}</ThemedText>
                  </Pressable>
                ))}
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {!isReadOnly && isTerminal && (
        <View className="px-4" style={{ paddingBottom: bottom + 24 }}>
          <CTAButton label="Finish" onPress={handleFinish} />
        </View>
      )}
    </View>
  );
}
