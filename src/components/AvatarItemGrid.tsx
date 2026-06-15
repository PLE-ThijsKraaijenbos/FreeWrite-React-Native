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

type GridRow =
  | { type: 'header'; key: string; title: string }
  | { type: 'items'; key: string; cards: GridCard[] };

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
};

export function AvatarItemGrid({
  sections,
  selectedCategory,
  onSelectCategory,
  onPressItem,
  baseParams,
  refreshing,
  onRefresh,
}: Props) {
  const rows = useMemo<GridRow[]>(() => {
    const visible = selectedCategory ? sections.filter((s) => s.key === selectedCategory) : sections;
    const result: GridRow[] = [];
    for (const section of visible) {
      result.push({ type: 'header', key: `h:${section.key}`, title: section.title });
      chunk(section.cards, 2).forEach((cards, i) => {
        result.push({ type: 'items', key: `r:${section.key}:${i}`, cards });
      });
    }
    return result;
  }, [sections, selectedCategory]);

  const renderRow = useCallback(
    ({ item: row }: { item: GridRow }) => {
      if (row.type === 'header') {
        return (
          <ThemedText type="h3" className="px-4 mt-6 mb-2">
            {row.title.toUpperCase()}
          </ThemedText>
        );
      }
      return (
        <View className="flex-row w-full">
          {row.cards.map(({ item, uri, hint, variant, disabled }) => (
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
          {row.cards.length === 1 && <View className="w-1/2" />}
        </View>
      );
    },
    [baseParams, onPressItem]
  );

  return (
    <>
      <CategorySelect
        categories={sections.map((s) => ({ id: s.key, label: s.title }))}
        selectedId={selectedCategory}
        onSelect={(id) => onSelectCategory(id === selectedCategory ? null : id)}
      />
      <FlatList
        style={{ flex: 1 }}
        data={rows}
        keyExtractor={(row) => row.key}
        renderItem={renderRow}
        contentContainerStyle={{ paddingBottom: 32 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        removeClippedSubviews
        initialNumToRender={6}
        maxToRenderPerBatch={6}
        windowSize={7}
      />
    </>
  );
}
