import { View } from 'react-native';

type Props = {
  current: number;
  total: number;
};

export function ProgressBar({ current, total }: Props) {
  return (
    <View className="flex-row gap-2">
      {Array.from({ length: total }, (_, i) => (
        <View
          key={i}
          className={`flex-1 h-1 rounded-full ${i < current ? 'bg-gray-500' : 'bg-gray-200'}`}
        />
      ))}
    </View>
  );
}
