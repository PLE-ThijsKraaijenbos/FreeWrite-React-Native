import { LinearGradient } from 'expo-linear-gradient';
import { cssInterop } from 'nativewind';
import { Pressable, ScrollView, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { shadows } from '@/constants/shadows';

cssInterop(LinearGradient, { className: 'style' });

const TOP_BOTTOM = { start: { x: 0, y: 0 }, end: { x: 0, y: 1 } };

const styles = StyleSheet.create({
  textShadow: {
    textShadowColor: 'rgba(0,0,0,0.50)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 2,
  },
});

type Category = {
  id: string;
  label: string;
};

type Props = {
  categories?: Category[];
  selectedId?: string | null;
  onSelect?: (id: string | null) => void;
};

function Tag({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress}>
      <LinearGradient
        colors={selected ? ['#FCAA88', '#F47D4E'] : ['#FAFAF8', '#EBEBE6']}
        {...TOP_BOTTOM}
        style={shadows.drop}
        className="px-4 py-2 rounded-lg justify-center items-center overflow-hidden"
      >
        <ThemedText
          numberOfLines={1}
          type="body-sm-bold"
          style={selected ? styles.textShadow : undefined}
          className={selected ? 'text-neutral-100' : 'text-neutral-600'}
        >
          {label}
        </ThemedText>
      </LinearGradient>
    </Pressable>
  );
}

export function CategorySelect({ categories = [], selectedId = null, onSelect }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="grow-0 shrink-0"
      contentContainerClassName="flex-row items-center gap-2 px-4 py-2"
    >
      <Tag label="All" selected={selectedId === null} onPress={() => onSelect?.(null)} />
      {categories.map((category) => (
        <Tag
          key={category.id}
          label={category.label}
          selected={selectedId === category.id}
          onPress={() => onSelect?.(category.id)}
        />
      ))}
    </ScrollView>
  );
}
