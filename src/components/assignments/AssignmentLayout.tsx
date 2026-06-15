import { useRouter } from 'expo-router';
import { ReactNode } from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BackButton } from '@/components/BackButton';
import { Divider } from '@/components/Divider';
import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';

type Props = {
  title: string;
  children: ReactNode;
  // Use scroll for text-heavy assignments (letter, journal, choice story).
  // The interactive ones (slider, bubble pop, speech bubble) stay fixed so
  // their play area can fill the remaining height.
  scroll?: boolean;
};

// Shared chrome for every assignment screen: back button, title and a divider,
// followed by the content-type-specific body. Everything is laid out as direct
// children of a single gap-6 column so the spacing is uniform across the page.
export function AssignmentLayout({ title, children, scroll = false }: Props) {
  const router = useRouter();
  const theme = useTheme();
  const { top, bottom } = useSafeAreaInsets();

  const header = (
    <>
      <BackButton onPress={() => router.back()} />
      <ThemedText type="h2">{title}</ThemedText>
      <Divider />
    </>
  );

  if (scroll) {
    return (
      <View className="flex-1" style={{ backgroundColor: theme.background, paddingTop: top + 16 }}>
        <ScrollView
          className="flex-1"
          contentContainerClassName="gap-6 px-4"
          contentContainerStyle={{ paddingBottom: bottom + 24 }}
          keyboardShouldPersistTaps="handled">
          {header}
          {children}
        </ScrollView>
      </View>
    );
  }

  return (
    <View
      className="flex-1 gap-6 px-4"
      style={{ backgroundColor: theme.background, paddingTop: top + 16, paddingBottom: bottom + 24 }}>
      {header}
      {children}
    </View>
  );
}
