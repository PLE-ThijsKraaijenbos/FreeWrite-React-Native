import { Pressable } from 'react-native';

import ChevronLeftIcon from '@/assets/icons/chevron-left.svg';
import { ThemedText } from '@/components/themed-text';

type Props = {
  onPress: () => void;
  // 'default' shows the "Go back" label and is used across the app;
  // 'onboarding' is the icon-only variant that sits next to the progress bar.
  variant?: 'default' | 'onboarding';
};

export function BackButton({ onPress, variant = 'default' }: Props) {
  if (variant === 'onboarding') {
    return (
      <Pressable onPress={onPress} hitSlop={8} className="p-2 -ml-2">
        <ChevronLeftIcon width={36} height={36} color="#CCCBC4" />
      </Pressable>
    );
  }

  return (
    <Pressable onPress={onPress} hitSlop={8} className="flex-row items-center gap-2">
      <ChevronLeftIcon width={24} height={24} color="#2A2924" />
      <ThemedText type="h3">Go back</ThemedText>
    </Pressable>
  );
}
