import { Pressable, Text } from 'react-native';

type Props = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

export function OptionButton({ label, selected, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      className={`p-4 border ${selected ? 'border-black' : 'border-gray-400'}`}>
      <Text>{label}</Text>
    </Pressable>
  );
}
