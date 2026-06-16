import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, Pressable, RefreshControl, StyleSheet, View } from 'react-native';
import Animated, { Easing, SlideInDown, SlideOutDown } from 'react-native-reanimated';

import { CTASmall } from '@/components/cta';
import { JourneyBackground } from '@/components/JourneyBackground';
import { JourneyMarker } from '@/components/JourneyMarker';
import { JourneyNodes } from '@/components/JourneyNodes';
import { JourneyPathTile, TILE_HEIGHT, Point } from '@/components/JourneyPath';
import { PageHeader } from '@/components/PageHeader';
import { ThemedText } from '@/components/themed-text';
import { shadows } from '@/constants/shadows';
import { useTheme } from '@/hooks/use-theme';
import { useJourney } from '@/hooks/use-journey';
import { useAuth } from '@/lib/auth-context';
import { JourneyStepProgress } from '@/types/journey';

const NODE_SIZE = 65;
const NODE_HEIGHT = (NODE_SIZE * 80) / 75;
const COLUMNS = 2;
const ROW_STEP = 200;
const TOP_PADDING = 65;
const BOTTOM_PADDING = 280;
const FOCUS_HEIGHT = 0.35;

const MARKER_WIDTH = NODE_SIZE * 0.65;
const MARKER_HEIGHT = (MARKER_WIDTH * 80) / 60;
const MARKER_BOB = NODE_SIZE * 0.15;

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

// A UUID is hex, so its letters parse fine as a base-16 number. Using the
// user id as the seed keeps their journey layout the same across app restarts.
const seedFromUuid = (uuid: string) => parseInt(uuid.replace(/-/g, '').slice(0, 12), 16) || 0;

// Deterministic jitter in [-1, 1] for both axes from a numeric seed.
const seededOffset = (seed: number) => {
  const rand = (k: number) => {
    const v = Math.sin(seed + k) * 10000;
    return (v - Math.floor(v)) * 2 - 1;
  };
  return { x: rand(0), y: rand(0.5) };
};

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

type JourneyTileProps = {
  tileIndex: number;
  width: number;
  sorted: JourneyStepProgress[];
  positions: Point[];
  pathPoints: Point[];
  contentHeight: number;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  markerTarget: Point | null;
};

const JourneyTile = React.memo(({
  tileIndex: i,
  width,
  sorted,
  positions,
  pathPoints,
  contentHeight,
  selectedId,
  onSelect,
  markerTarget,
}: JourneyTileProps) => {
  const tileTop = i * TILE_HEIGHT;
  const tileBottom = tileTop + TILE_HEIGHT;

  const { tileSteps, tilePositions } = useMemo(() => {
    const steps: JourneyStepProgress[] = [];
    const posList: Point[] = [];

    for (let j = 0; j < sorted.length; j++) {
      const pos = positions[j];
      if (!pos) continue;
      if (pos.y + NODE_HEIGHT >= tileTop && pos.y < tileBottom) {
        steps.push(sorted[j]);
        posList.push({ ...pos, y: pos.y - tileTop });
      } else if (pos.y >= tileBottom) {
        break;
      }
    }
    return { tileSteps: steps, tilePositions: posList };
  }, [sorted, positions, tileTop, tileBottom]);

  // Adjust marker target to be local to this tile
  const localMarkerTarget = useMemo(() => {
    if (!markerTarget) return null;
    return { x: markerTarget.x, y: markerTarget.y - tileTop };
  }, [markerTarget, tileTop]);

  // The last tile is clipped to the real content height so the scroll view
  // doesn't extend a full empty tile past the last node.
  const tileHeight = Math.min(TILE_HEIGHT, Math.max(0, contentHeight - tileTop));

  return (
    <View style={{ height: tileHeight, width: '100%', overflow: 'hidden' }}>
      <Pressable
        onPress={() => onSelect(null)}
        style={StyleSheet.absoluteFill}
      />
      <JourneyPathTile
        points={pathPoints}
        width={width}
        tileIndex={i}
        totalHeight={contentHeight}
      />
      <JourneyNodes
        positions={tilePositions}
        steps={tileSteps}
        selectedId={selectedId}
        onSelect={onSelect as (id: string) => void}
        size={NODE_SIZE}
      />
      <JourneyMarker
        target={localMarkerTarget}
        width={MARKER_WIDTH}
        height={MARKER_HEIGHT}
        bob={MARKER_BOB}
      />
    </View>
  );
});

export default function JourneyScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { data, isLoading, isError, refetch, isRefetching } = useJourney();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [width, setWidth] = useState(0);
  const [headerHeight, setHeaderHeight] = useState(0);

  const { user } = useAuth();
  const userSeed = user ? seedFromUuid(user.id) : 0;

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
      const offset = seededOffset(userSeed + i);
      return {
        x: clamp(baseX + offset.x * jitterX, 0, width - NODE_SIZE),
        y: baseY + offset.y * jitterY,
      };
    });
  }, [sorted, width, userSeed]);

  const contentHeight =
    sorted.length > 0
      ? TOP_PADDING + (sorted.length - 1) * ROW_STEP + NODE_HEIGHT + BOTTOM_PADDING
      : 0;

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

  const markerTarget = useMemo(() => {
    if (!selectedId) return null;
    const index = sorted.findIndex((p) => p.id === selectedId);
    const pos = index >= 0 ? positions[index] : undefined;
    return pos ? markerTargetFor(pos) : null;
  }, [selectedId, positions, sorted]);

  const scrollRef = useRef<FlatList>(null);
  const [viewportHeight, setViewportHeight] = useState(0);

  useEffect(() => {
    if (!selectedId || !viewportHeight) return;
    const index = sorted.findIndex((p) => p.id === selectedId);
    const pos = positions[index];
    if (!pos) return;
    const nodeCenter = pos.y + NODE_SIZE / 2;
    const y = Math.max(0, nodeCenter - viewportHeight * FOCUS_HEIGHT);
    scrollRef.current?.scrollToOffset({ offset: y, animated: true });
  }, [selectedId, positions, sorted, viewportHeight]);

  const params = useLocalSearchParams<{ focus?: string }>();
  useEffect(() => {
    if (params.focus !== 'available' || positions.length === 0) return;
    const available = sorted.find((p) => p.status === 'AVAILABLE');
    if (available) {
      setSelectedId(available.id);
      router.setParams({ focus: undefined });
    }
  }, [params.focus, positions, sorted, router]);

  const numTiles = Math.ceil(contentHeight / TILE_HEIGHT);
  const tileIndices = useMemo(() => Array.from({ length: numTiles }, (_, i) => i), [numTiles]);

  const handleSelect = useCallback((id: string | null) => {
    setSelectedId(id);
  }, []);

  const renderTile = useCallback(({ item: i }: { item: number }) => {
    const tileTop = i * TILE_HEIGHT;
    const tileBottom = tileTop + TILE_HEIGHT;
    const isMarkerInTile = markerTarget && markerTarget.y >= tileTop && markerTarget.y < tileBottom;

    return (
      <JourneyTile
        tileIndex={i}
        width={width}
        sorted={sorted}
        positions={positions}
        pathPoints={pathPoints}
        contentHeight={contentHeight}
        selectedId={selectedId}
        onSelect={handleSelect}
        markerTarget={isMarkerInTile ? markerTarget : null}
      />
    );
  }, [width, sorted, positions, pathPoints, contentHeight, selectedId, handleSelect, markerTarget]);

  return (
    <View className="flex-1" style={{ backgroundColor: theme.background }}>
      <JourneyBackground topInset={headerHeight} />

      <View onLayout={(e) => setHeaderHeight(e.nativeEvent.layout.height)}>
        <PageHeader subtitle="Write your own" title="Story" />
      </View>

      {isLoading ? (
        <ThemedText className="text-center mt-12" themeColor="textSecondary">
          Loading...
        </ThemedText>
      ) : isError ? (
        <ThemedText className="text-center mt-12" themeColor="textSecondary">
          Failed to load journey. Please try again.
        </ThemedText>
      ) : (
        <FlatList
          ref={scrollRef}
          data={tileIndices}
          keyExtractor={(i) => i.toString()}
          renderItem={renderTile}
          getItemLayout={(_, index) => {
            const offset = TILE_HEIGHT * index;
            return {
              length: Math.min(TILE_HEIGHT, Math.max(0, contentHeight - offset)),
              offset,
              index,
            };
          }}
          onLayout={(e) => {
            setViewportHeight(e.nativeEvent.layout.height);
            setWidth(e.nativeEvent.layout.width);
          }}
          contentContainerStyle={{ flexGrow: 1, minHeight: contentHeight }}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
          removeClippedSubviews={true}
          windowSize={3}
        />
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
