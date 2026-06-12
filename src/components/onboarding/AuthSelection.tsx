import { Pressable, Text, View } from 'react-native';

interface AuthSelectionProps {
  selected: 'register' | 'login';
  onSelectRegister: () => void;
  onSelectLogin: () => void;
}

export function AuthSelection({ selected, onSelectRegister, onSelectLogin }: AuthSelectionProps) {
  return (
    <View className="mb-6">
      <View className="w-full rounded-lg bg-neutral-200 flex-row overflow-hidden shadow-sm">
        <Pressable
          onPress={onSelectRegister}
          className={`flex-1 items-center justify-center py-4 ${selected === 'register' ? 'bg-secondary-400' : ''}`}
        >
          <Text className={`text-body-lg font-body-bold text-center ${selected === 'register' ? 'text-neutral-100' : 'text-neutral-600'}`}>
            Create account
          </Text>
        </Pressable>

        <View className="w-px bg-neutral-400" />

        <Pressable
          onPress={onSelectLogin}
          className={`flex-1 items-center justify-center py-4 ${selected === 'login' ? 'bg-secondary-400' : ''}`}
        >
          <Text className={`text-body-lg font-body-bold text-center ${selected === 'login' ? 'text-neutral-100' : 'text-neutral-600'}`}>
            Log in
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
