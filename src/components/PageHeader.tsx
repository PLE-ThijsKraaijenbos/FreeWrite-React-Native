import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
      <Text className="font-body text-body text-neutral-500">{subtitle}</Text>
      <Text className="font-heading-medium text-h2 text-neutral-600">{title}</Text>
    </View>
  );
}
