import { ReactNode } from 'react';
import { FlatList, RefreshControl, View } from 'react-native';
import { useCallback, useMemo } from 'react';

import { AvatarItemCard, AvatarItemCardVariant } from '@/components/AvatarItemCard';
import { CategorySelect } from '@/components/CategorySelect';
import { ThemedText } from '@/components/themed-text';
import { AvatarItem } from '@/types/user';

export type GridCard = {
  item: AvatarItem;
  uri: string;
  hint: string | null;
  variant: AvatarItemCardVariant;
  disabled: boolean;
};

export type GridSection = { key: string; title: string; cards: GridCard[] };

function chunk<T>(arr: T[], size: number): T[][] {
  const rows: T[][] = [];
  for (let i = 0; i < arr.length; i += size) rows.push(arr.slice(i, i + size));
  return rows;
}

type Props = {
  sections: GridSection[];
  selectedCategory: string | null;
  onSelectCategory: (id: string | null) => void;
  onPressItem: (item: AvatarItem) => void;
  baseParams?: Record<string, string>;
  refreshing: boolean;
  onRefresh: () => void;
  /** Optional content rendered above CategorySelect, inside the gap-6 scroll flow. */
  header?: ReactNode;
};

export function AvatarItemGrid({
  sections,
  selectedCategory,
  onSelectCategory,
  onPressItem,
  baseParams,
  refreshing,
  onRefresh,
  header,
}: Props) {
  const visibleSections = useMemo(
    () => (selectedCategory ? sections.filter((s) => s.key === selectedCategory) : sections),
    [sections, selectedCategory]
  );

  // Each category is one list item: a gap-2 group of its title + its 2-column grid.
  const renderSection = useCallback(
    ({ item: section }: { item: GridSection }) => (
      <View className="gap-2">
        <ThemedText type="h3" className="px-4">
          {section.title.toUpperCase()}
        </ThemedText>
        <View>
          {chunk(section.cards, 2).map((cards, i) => (
            <View key={i} className="flex-row w-full">
              {cards.map(({ item, uri, hint, variant, disabled }) => (
                <AvatarItemCard
                  key={item.id}
                  item={item}
                  uri={uri}
                  variant={variant}
                  hint={hint}
                  disabled={disabled}
                  baseParams={baseParams}
                  onPress={onPressItem}
                />
              ))}
              {cards.length === 1 && <View className="w-1/2" />}
            </View>
          ))}
        </View>
      </View>
    ),
    [baseParams, onPressItem]
  );

  return (
    <FlatList
      style={{ flex: 1 }}
      data={visibleSections}
      keyExtractor={(section) => section.key}
      renderItem={renderSection}
      ListHeaderComponent={
        <View className="gap-6">
          {header}
          <CategorySelect
            categories={sections.map((s) => ({ id: s.key, label: s.title }))}
            selectedId={selectedCategory}
            onSelect={(id) => onSelectCategory(id === selectedCategory ? null : id)}
          />
        </View>
      }
      contentContainerStyle={{ gap: 24, paddingTop: 24, paddingBottom: 32 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      removeClippedSubviews
      initialNumToRender={6}
      maxToRenderPerBatch={6}
      windowSize={7}
    />
  );
}
