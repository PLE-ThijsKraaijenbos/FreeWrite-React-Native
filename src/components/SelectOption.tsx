import { LinearGradient } from 'expo-linear-gradient';
import { cssInterop } from 'nativewind';
import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { shadows } from '@/constants/shadows';

cssInterop(LinearGradient, { className: 'style' });

const TOP_BOTTOM = { start: { x: 0, y: 0 }, end: { x: 0, y: 1 } };

const shadow = StyleSheet.create({
  text: {
    textShadowColor: 'rgba(0,0,0,0.50)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 2,
  },
  // Give the drop shadow room at the bottom of the frame so it isn't clipped,
  // then pull the next line back up by the same amount. Net-zero layout: no
  // extra spacing between the lines and no shift when toggling the shadow.
  room: { paddingBottom: 4, marginBottom: -4 },
});

type Props = {
  label: string;
  subtitle?: string;
  size?: 'default' | 'small';
  selected?: boolean;
  onPress?: () => void;
};

export function SelectOption({ label, subtitle, size = 'default', selected = false, onPress }: Props) {
  const small = size === 'small';

  return (
    <Pressable onPress={onPress} className="w-full">
      <LinearGradient
        colors={selected ? ['#FCAA88', '#F47D4E'] : ['#FAFAF8', '#EBEBE6']}
        {...TOP_BOTTOM}
        style={shadows.drop}
        className="min-h-[70px] px-4 py-3 rounded-lg justify-center items-center gap-1"
      >
        <ThemedText
          type={small ? 'body-bold' : 'body-lg-bold'}
          style={[shadow.room, selected && shadow.text]}
          className={`self-stretch text-center ${selected ? 'text-neutral-100' : 'text-neutral-600'}`}
        >
          {label}
        </ThemedText>
        {subtitle && (
          <ThemedText
            type="body-sm"
            style={[shadow.room, selected && shadow.text]}
            className={`self-stretch text-center ${selected ? 'text-neutral-200' : 'text-neutral-500'}`}
          >
            {subtitle}
          </ThemedText>
        )}
      </LinearGradient>
    </Pressable>
  );
}
