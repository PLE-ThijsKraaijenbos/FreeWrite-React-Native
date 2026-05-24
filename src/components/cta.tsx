import { Pressable } from 'react-native';

import { ThemedText } from './themed-text';

type Props = {
  label: string;
  onPress?: () => void;
};

export function CTA({ label, onPress }: Props) {
  return (
    <Pressable onPress={onPress}>
      <ThemedText>{label}</ThemedText>
    </Pressable>
  );
}
