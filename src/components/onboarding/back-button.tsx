import { Ionicons } from '@expo/vector-icons';
import { Pressable } from 'react-native';

type Props = {
  onPress: () => void;
};

export function BackButton({ onPress }: Props) {
  return (
    <Pressable onPress={onPress} className="p-2 -ml-2">
      <Ionicons name="chevron-back" size={24} color="black" />
    </Pressable>
  );
}
