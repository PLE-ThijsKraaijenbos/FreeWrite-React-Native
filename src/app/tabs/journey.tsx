import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, RefreshControl, ScrollView, View } from 'react-native';
import Animated, { Easing, SlideInDown, SlideOutDown } from 'react-native-reanimated';

import { CTASmall } from '@/components/cta';
import { JourneyMarker } from '@/components/JourneyMarker';
import { JourneyNodes } from '@/components/JourneyNodes';
import { JourneyPath } from '@/components/JourneyPath';
import { PageHeader } from '@/components/PageHeader';
import { ThemedText } from '@/components/themed-text';
import { shadows } from '@/constants/shadows';
import { useTheme } from '@/hooks/use-theme';
import { useJourney } from '@/hooks/use-journey';
import { JourneyStepProgress } from '@/types/journey';

const NODE_SIZE = 65;
const NODE_HEIGHT = (NODE_SIZE * 80) / 75;
const COLUMNS = 2;
const ROW_STEP = 200;
const TOP_PADDING = 65;
const BOTTOM_PADDING = 160;
const FOCUS_HEIGHT = 0.35;

const MARKER_WIDTH = NODE_SIZE * 0.65;
const MARKER_HEIGHT = (MARKER_WIDTH * 80) / 60;
const MARKER_BOB = NODE_SIZE * 0.15;

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const markerTargetFor = (pos: { x: number; y: number }) => ({
  x: pos.x + NODE_SIZE / 2 - MARKER_WIDTH / 2,
  y: pos.y + NODE_SIZE * 0.4 - MARKER_HEIGHT,
});

function sortProgresses(progresses: JourneyStepProgress[]): JourneyStepProgress[] {
  return [...progresses].sort((a, b) => {
    if (a.step.phase.order !== b.step.phase.order) {
      return a.step.phase.order - b.step.phase.order;
    }
    return a.step.order - b.step.order;
  });
}

export default function JourneyScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { data, isLoading, isError, refetch, isRefetching } = useJourney();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [width, setWidth] = useState(0);

  const offsetsRef = useRef(new Map<string, { x: number; y: number }>());
  const getOffset = (id: string) => {
    const map = offsetsRef.current;
    let offset = map.get(id);
    if (!offset) {
      offset = { x: Math.random() * 2 - 1, y: Math.random() * 2 - 1 };
      map.set(id, offset);
    }
    return offset;
  };

  const sorted = useMemo(
    () => (data ? sortProgresses(data.step_progresses) : []),
    [data],
  );

  const selected = useMemo(
    () => sorted.find((p) => p.id === selectedId) ?? null,
    [sorted, selectedId],
  );

  const positions = useMemo(() => {
    if (!width) return [];
    const jitterX = width * 0.1;
    const jitterY = ROW_STEP * 0.25;
    return sorted.map((progress, i) => {
      const col = i % COLUMNS;
      const baseX = (width * (col + 0.5)) / COLUMNS - NODE_SIZE / 2;
      const baseY = TOP_PADDING + i * ROW_STEP;
      const offset = getOffset(progress.id);
      return {
        x: clamp(baseX + offset.x * jitterX, 0, width - NODE_SIZE),
        y: baseY + offset.y * jitterY,
      };
    });
  }, [sorted, width]);

  const contentHeight =
    sorted.length > 0
      ? TOP_PADDING + (sorted.length - 1) * ROW_STEP + NODE_HEIGHT + BOTTOM_PADDING
      : 0;

  // Nodes the dashed connector links: from the first node through the current
  // available/in-progress node, stopping before the first locked node.
  const pathPoints = useMemo(() => {
    if (!width || positions.length < 2) return [];
    const firstLocked = sorted.findIndex((p) => p.status === 'UNAVAILABLE');
    const endIndex = firstLocked === -1 ? positions.length - 1 : firstLocked - 1;
    if (endIndex < 1) return [];
    return positions.slice(0, endIndex + 1).map((pos) => ({
      x: pos.x + NODE_SIZE / 2,
      y: pos.y + NODE_SIZE / 2,
    }));
  }, [positions, sorted, width]);

  // Marker target (top-left) for the selected node, or null when none selected.
  const markerTarget = useMemo(() => {
    if (!selectedId) return null;
    const index = sorted.findIndex((p) => p.id === selectedId);
    const pos = index >= 0 ? positions[index] : undefined;
    return pos ? markerTargetFor(pos) : null;
  }, [selectedId, positions, sorted]);

  // Shift the view to centre the selected node whenever the selection changes.
  const scrollRef = useRef<ScrollView>(null);
  const [viewportHeight, setViewportHeight] = useState(0);

  useEffect(() => {
    if (!selectedId || !viewportHeight) return;
    const index = sorted.findIndex((p) => p.id === selectedId);
    const pos = positions[index];
    if (!pos) return;
    const nodeCenter = pos.y + NODE_SIZE / 2;
    const y = Math.max(0, nodeCenter - viewportHeight * FOCUS_HEIGHT);
    scrollRef.current?.scrollTo({ y, animated: true });
  }, [selectedId, positions, sorted, viewportHeight]);

  // "Pick up where you left off" homescreen button button auto selecting the available node
  const params = useLocalSearchParams<{ focus?: string }>();
  useEffect(() => {
    if (params.focus !== 'available' || positions.length === 0) return;
    const available = sorted.find((p) => p.status === 'AVAILABLE');
    if (available) {
      setSelectedId(available.id);
      router.setParams({ focus: undefined });
    }
  }, [params.focus, positions, sorted, router]);

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
          ref={scrollRef}
          onLayout={(e) => setViewportHeight(e.nativeEvent.layout.height)}
          contentContainerStyle={{ flexGrow: 1 }}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}>
          {/* Tapping empty space dismisses the selection; node presses still win the
              responder (one-tap select/switch) and dragging still scrolls the list. */}
          <Pressable
            onPress={() => setSelectedId(null)}
            onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
            style={{ flexGrow: 1, minHeight: contentHeight }}>
            <JourneyPath points={pathPoints} width={width} height={contentHeight} />

            <JourneyNodes
              positions={positions}
              steps={sorted}
              selectedId={selectedId}
              onSelect={setSelectedId}
              size={NODE_SIZE}
            />

            <JourneyMarker
              target={markerTarget}
              width={MARKER_WIDTH}
              height={MARKER_HEIGHT}
              bob={MARKER_BOB}
            />
          </Pressable>
        </ScrollView>
      )}

      {selected && (
        <Animated.View
          entering={SlideInDown.duration(260).easing(Easing.out(Easing.cubic))}
          exiting={SlideOutDown.duration(200).easing(Easing.in(Easing.cubic))}
          className="absolute bottom-0 left-0 right-0 gap-6 bg-neutral-100 border-t-2 border-neutral-200"
          style={shadows.drop}>
          <View className="p-4 pb-0">
            <ThemedText type="h3" className="mb-1.5">
              {selected.step.title}
            </ThemedText>
            <ThemedText
              type="body-sm"
              themeColor="textSecondary"
              numberOfLines={3}
              ellipsizeMode="tail">
              {selected.step.description}
            </ThemedText>
          </View>
          <View className="flex-row justify-end px-4 pb-4">
            <CTASmall
              label="View more"
              variant="default"
              onPress={() => router.push(`/journey/${selected.id}`)}
            />
          </View>
        </Animated.View>
      )}
    </View>
  );
}
