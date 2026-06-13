import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ActivityIndicator, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BackButton } from '@/components/BackButton';
import { CTAButton } from '@/components/cta';
import { ThemedText } from '@/components/themed-text';
import { useBookmarkStep, useJourney, useStartStep } from '@/hooks/use-journey';
import { useTheme } from '@/hooks/use-theme';

export default function JourneyStepScreen() {
  const { progressId } = useLocalSearchParams<{ progressId: string }>();
  const router = useRouter();
  const theme = useTheme();
  const { top, bottom } = useSafeAreaInsets();
  const { data, isLoading } = useJourney();
  const { mutate: startStep, isPending: isStarting, isError: isStartError } = useStartStep();
  const { mutate: toggleBookmark, isPending: isBookmarking } = useBookmarkStep();

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
      <View style={{ paddingTop: top + 16 }} className="px-4 pb-3 flex-row items-center justify-between">
        <BackButton onPress={() => router.back()} />
        <Pressable onPress={() => toggleBookmark(progressId)} disabled={isBookmarking}>
          <ThemedText className="text-2xl">{progress.bookmarked ? '★' : '☆'}</ThemedText>
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
          <CTAButton label={isStarting ? '…' : 'Start'} disabled={isStarting} onPress={handleStart} />
        )}

        {status === 'IN_PROGRESS' && (
          <CTAButton label="Continue" onPress={() => router.push(`/journey/assignment?progressId=${progressId}`)} />
        )}

        {status === 'COMPLETED' && (
          <CTAButton label="View again" onPress={() => router.push(`/journey/assignment?progressId=${progressId}`)} />
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
