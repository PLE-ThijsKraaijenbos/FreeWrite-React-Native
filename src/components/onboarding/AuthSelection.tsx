import { Pressable, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { shadows } from '@/constants/shadows';

interface AuthSelectionProps {
  selected: 'register' | 'login';
  onSelectRegister: () => void;
  onSelectLogin: () => void;
}

export function AuthSelection({ selected, onSelectRegister, onSelectLogin }: AuthSelectionProps) {
  return (
    <View style={shadows.drop} className="w-full rounded-lg bg-neutral-200 flex-row overflow-hidden">
        <Pressable
          onPress={onSelectRegister}
          className={`flex-1 items-center justify-center py-4 ${selected === 'register' ? 'bg-secondary-400' : ''}`}
        >
          <ThemedText type="body-lg-bold" className={`text-center ${selected === 'register' ? 'text-neutral-100' : 'text-neutral-600'}`}>
            Create account
          </ThemedText>
        </Pressable>

        <View className="w-px bg-neutral-400" />

        <Pressable
          onPress={onSelectLogin}
          className={`flex-1 items-center justify-center py-4 ${selected === 'login' ? 'bg-secondary-400' : ''}`}
        >
          <ThemedText type="body-lg-bold" className={`text-center ${selected === 'login' ? 'text-neutral-100' : 'text-neutral-600'}`}>
            Log in
          </ThemedText>
        </Pressable>
      </View>
  );
}
