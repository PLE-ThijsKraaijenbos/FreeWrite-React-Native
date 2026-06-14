import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';

type Props = {
  subtitle: string;
  title: string;
  absolute?: boolean;
};

export function PageHeader({ subtitle, title, absolute }: Props) {
  const { top } = useSafeAreaInsets();

  return (
    <View
      className={`px-4 pb-3 gap-0.5 ${absolute ? 'absolute top-0 left-0 right-0 z-10' : ''}`}
      style={{ paddingTop: top + 4 }}>
      <ThemedText type="body">{subtitle}</ThemedText>
      <ThemedText type="h2">{title}</ThemedText>
    </View>
  );
}
