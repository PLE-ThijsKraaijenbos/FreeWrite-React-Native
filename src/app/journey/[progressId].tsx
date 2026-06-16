import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ActivityIndicator, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import BookmarkIcon from '@/assets/icons/bookmark.svg';
import BookmarkOutlineIcon from '@/assets/icons/bookmark-outline.svg';
import { BackButton } from '@/components/BackButton';
import { CTAButton } from '@/components/cta';
import { Divider } from '@/components/Divider';
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

  function goToAssignment() {
    router.push(`/journey/assignment?progressId=${progressId}`);
  }

  return (
    <View className="flex-1" style={{ backgroundColor: theme.background }}>
      <View className="flex-1 gap-6" style={{ paddingBottom: bottom + 24 }}>
        {/* Banner with the back button floating over it */}
        <View>
          <Image
            source={{ uri: step.banner_url }}
            style={{ width: '100%', height: 200 }}
            contentFit="cover"
          />
          <View className="absolute left-4 z-10" style={{ top: top + 8 }}>
            <BackButton onPress={() => router.back()} />
          </View>
        </View>

        {/* Title + description */}
        <View className="px-4 gap-2">
          <ThemedText type="h2">{step.title}</ThemedText>
          <ThemedText themeColor="textSecondary">{step.description}</ThemedText>
        </View>

        <View className="px-4">
          <Divider />
        </View>

        <View className="px-4 flex-row items-center gap-8">
          <Pressable onPress={() => toggleBookmark(progressId)} disabled={isBookmarking} hitSlop={8}>
            {progress.bookmarked ? (
              <BookmarkIcon width={40} height={40} color="#F47D4E" />
            ) : (
              <BookmarkOutlineIcon width={40} height={40} color="#2A2924" />
            )}
          </Pressable>

          <View className="flex-1">
            {status === 'AVAILABLE' && (
              <CTAButton label={isStarting ? '…' : "Let's do it"} disabled={isStarting} onPress={handleStart} />
            )}
            {status === 'IN_PROGRESS' && <CTAButton label="Continue" onPress={goToAssignment} />}
            {status === 'COMPLETED' && <CTAButton label="View again" onPress={goToAssignment} />}
            {status === 'UNAVAILABLE' && <CTAButton label="Not yet available" disabled />}
          </View>
        </View>

        {isStartError && (
          <ThemedText themeColor="textSecondary" className="text-center px-4">
            Failed to start. Please try again.
          </ThemedText>
        )}
      </View>
    </View>
  );
}
