import { LinearGradient } from 'expo-linear-gradient';
import { cssInterop } from 'nativewind';
import { Image } from 'expo-image';
import { Pressable, View } from 'react-native';

import { shadows } from '@/constants/shadows';

cssInterop(LinearGradient, { className: 'style' });

interface AvatarOption<T extends string = string> {
  label: string;
  value: T;
  uri: string;
}

interface AvatarSelectProps<T extends string = string> {
  options: AvatarOption<T>[];
  selected: T | null;
  onSelect: (option: AvatarOption<T>) => void;
}

export function AvatarSelect<T extends string = string>({
  options,
  selected,
  onSelect,
}: AvatarSelectProps<T>) {
  return (
    <View className="flex-row gap-8">
      {options.map((opt) => (
        <Pressable key={opt.value} onPress={() => onSelect(opt)} className="flex-1">
          <LinearGradient
            colors={
              selected === opt.value ? ['#FCAA88', '#F47D4E'] : ['#EBEBE6', '#EBEBE6']
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={shadows.drop}
            className="items-center gap-3 p-4 rounded-lg"
          >
            <Image source={{ uri: opt.uri }} style={{ width: 120, height: 120 }} />
          </LinearGradient>
        </Pressable>
      ))}
    </View>
  );
}
