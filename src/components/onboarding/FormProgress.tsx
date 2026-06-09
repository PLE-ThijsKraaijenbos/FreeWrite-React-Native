import { View } from 'react-native';

type Props = {
  length: number;
  filled: number;
};

export function FormProgress({ length, filled }: Props) {
  return (
    <View className="flex-row gap-2">
      {Array.from({ length }, (_, i) => (
        <View
          key={i}
          className={`flex-1 h-1.5 rounded-sm ${i < filled ? 'bg-neutral-300' : 'bg-neutral-200'}`}
        />
      ))}
    </View>
  );
}
