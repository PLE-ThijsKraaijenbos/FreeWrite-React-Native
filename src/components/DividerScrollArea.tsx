import { ReactNode } from 'react';
import { ScrollView, ScrollViewProps, StyleSheet, View } from 'react-native';

import { Divider } from '@/components/Divider';

// The onboarding layouts place gap-6 (24px) between flow items. We split that
// into a small fixed buffer that keeps scrolled content off the divider lines
// (gap-2, 8px) plus scrollable padding for the remainder, so content can scroll
// almost to each divider while keeping the same resting position.
const EDGE = 8; // gap-2
const SCROLL_PAD = 24 - EDGE;

type Props = ScrollViewProps & {
  children: ReactNode;
};

const num = (value: unknown) => (typeof value === 'number' ? value : 0);

// A ScrollView fenced by a divider above and below. The page layout puts a fixed
// gap between every flow item, which leaves dead space between the dividers and
// the scroll content and stops the content short of the lines. We keep only a
// small fixed buffer (gap-2) between the trio and re-add the rest of that spacing
// as scrollable padding inside the ScrollView, so content can scroll up/down to
// just shy of the actual dividers while keeping the same resting position. The
// flex-1 wrapper keeps the trio filling a single slot of the parent's gap layout.
export function DividerScrollArea({ children, contentContainerStyle, ...rest }: Props) {
  const cc = StyleSheet.flatten(contentContainerStyle) ?? {};
  const { paddingTop, paddingBottom, paddingVertical, ...ccRest } = cc;

  return (
    <View className="flex-1 gap-2">
      <Divider />
      <ScrollView
        className="flex-1"
        {...rest}
        contentContainerStyle={{
          ...ccRest,
          paddingTop: SCROLL_PAD + num(paddingTop ?? paddingVertical),
          paddingBottom: SCROLL_PAD + num(paddingBottom ?? paddingVertical),
        }}>
        {children}
      </ScrollView>
      <Divider />
    </View>
  );
}
