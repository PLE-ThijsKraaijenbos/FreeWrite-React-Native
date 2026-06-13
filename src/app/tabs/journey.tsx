import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, RefreshControl, ScrollView, View } from 'react-native';

import { PageHeader } from '@/components/PageHeader';
import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';
import { useJourney } from '@/hooks/use-journey';
import { JourneyStepProgress, StepStatus } from '@/types/journey';

function sortProgresses(progresses: JourneyStepProgress[]): JourneyStepProgress[] {
  return [...progresses].sort((a, b) => {
    if (a.step.phase.order !== b.step.phase.order) {
      return a.step.phase.order - b.step.phase.order;
    }
    return a.step.order - b.step.order;
  });
}

const STATUS_COLORS: Record<StepStatus, string> = {
  UNAVAILABLE: '#9CA3AF',
  AVAILABLE: '#3c87f7',
  IN_PROGRESS: '#F59E0B',
  COMPLETED: '#22C55E',
};

function StepCircle({
  progress,
  onPress,
}: {
  progress: JourneyStepProgress;
  onPress: () => void;
}) {
  const { status } = progress;
  const isUnavailable = status === 'UNAVAILABLE';
  const dotColor = STATUS_COLORS[status];

  let statusLabel = '';
  if (status === 'COMPLETED') statusLabel = '✓';
  else if (status === 'IN_PROGRESS') statusLabel = '…';

  return (
    <Pressable
      disabled={isUnavailable}
      onPress={onPress}
      className={isUnavailable ? 'opacity-50' : ''}>
      <View
        className="w-14 h-14 rounded-full items-center justify-center"
        style={{ backgroundColor: dotColor }}>
        <ThemedText className="text-white text-lg font-bold">
          {statusLabel || String(progress.step.order)}
        </ThemedText>
      </View>
    </Pressable>
  );
}

export default function JourneyScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { data, isLoading, isError, refetch, isRefetching } = useJourney();

  const sorted = useMemo(
    () => (data ? sortProgresses(data.step_progresses) : []),
    [data],
  );

  return (
    <View className="flex-1" style={{ backgroundColor: theme.background }}>
      <PageHeader subtitle="Write your own" title="Story" />

      {isLoading ? (
        <ThemedText className="text-center mt-12" themeColor="textSecondary">
          Loading...
        </ThemedText>
      ) : isError ? (
        <ThemedText className="text-center mt-12" themeColor="textSecondary">
          Failed to load journey. Please try again.
        </ThemedText>
      ) : (
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32, gap: 16 }}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}>
          {sorted.map((progress) => (
            <StepCircle
              key={progress.id}
              progress={progress}
              onPress={() => router.push(`/journey/${progress.id}`)}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
}
