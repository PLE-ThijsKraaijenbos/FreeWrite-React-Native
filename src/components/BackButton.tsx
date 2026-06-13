import { Pressable, Text } from 'react-native';

import ChevronLeftIcon from '@/assets/icons/chevron-left.svg';

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
        <ChevronLeftIcon width={28} height={28} color="#CCCBC4" />
      </Pressable>
    );
  }

  return (
    <Pressable onPress={onPress} hitSlop={8} className="flex-row items-center gap-2">
      <ChevronLeftIcon width={24} height={24} color="#2A2924" />
      <Text className="font-heading-bold text-h3 text-neutral-600">Go back</Text>
    </Pressable>
  );
}
