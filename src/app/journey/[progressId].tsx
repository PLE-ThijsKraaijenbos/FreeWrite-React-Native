import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ActivityIndicator, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { useJourney, useStartStep } from '@/hooks/use-journey';
import { useTheme } from '@/hooks/use-theme';

export default function JourneyStepScreen() {
  const { progressId } = useLocalSearchParams<{ progressId: string }>();
  const router = useRouter();
  const theme = useTheme();
  const { top, bottom } = useSafeAreaInsets();
  const { data, isLoading } = useJourney();
  const { mutate: startStep, isPending: isStarting, isError: isStartError } = useStartStep();

  const progress = data?.step_progresses.find((p) => p.id === progressId);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center" style={{ backgroundColor: theme.background }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!progress) {
    return (
      <View className="flex-1 items-center justify-center" style={{ backgroundColor: theme.background }}>
        <ThemedText>Step not found.</ThemedText>
      </View>
    );
  }

  const { step, status } = progress;

  function handleStart() {
    startStep(progressId, {
      onSuccess: () => router.push(`/journey/assignment?progressId=${progressId}`),
    });
  }

  return (
    <View className="flex-1" style={{ backgroundColor: theme.background }}>
      <View style={{ paddingTop: top + 16 }} className="px-4 pb-3">
        <Pressable onPress={() => router.back()}>
          <ThemedText themeColor="textSecondary">← Back</ThemedText>
        </Pressable>
      </View>

      <Image
        source={{ uri: step.banner_url }}
        style={{ width: '100%', height: 200 }}
        contentFit="cover"
      />

      <View className="flex-1 px-4 pt-6">
        <ThemedText type="subtitle">{step.title}</ThemedText>
        <ThemedText themeColor="textSecondary" className="mt-3">
          {step.description}
        </ThemedText>
      </View>

      <View className="px-4" style={{ paddingBottom: bottom + 24 }}>
        {status === 'AVAILABLE' && (
          <Pressable
            onPress={handleStart}
            disabled={isStarting}
            className="items-center justify-center py-4 rounded-xl bg-primary">
            {isStarting ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <ThemedText className="text-white font-bold">Start</ThemedText>
            )}
          </Pressable>
        )}

        {status === 'IN_PROGRESS' && (
          <Pressable
            onPress={() => router.push(`/journey/assignment?progressId=${progressId}`)}
            className="items-center justify-center py-4 rounded-xl bg-amber-500">
            <ThemedText className="text-white font-bold">Continue</ThemedText>
          </Pressable>
        )}

        {status === 'COMPLETED' && (
          <Pressable
            onPress={() => router.push(`/journey/assignment?progressId=${progressId}`)}
            className="items-center justify-center py-4 rounded-xl"
            style={{ backgroundColor: theme.backgroundElement }}>
            <ThemedText>View again</ThemedText>
          </Pressable>
        )}

        {status === 'UNAVAILABLE' && (
          <View className="items-center py-4">
            <ThemedText themeColor="textSecondary">Not yet available</ThemedText>
          </View>
        )}

        {isStartError && (
          <ThemedText themeColor="textSecondary" className="text-center mt-2">
            Failed to start. Please try again.
          </ThemedText>
        )}
      </View>
    </View>
  );
}
