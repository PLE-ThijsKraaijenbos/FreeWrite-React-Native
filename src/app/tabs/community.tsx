import { useRouter } from 'expo-router';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';

export default function CommunityScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { top } = useSafeAreaInsets();

  return (
    <View className="flex-1" style={{ backgroundColor: theme.background }}>
      <View className="px-4 pb-3" style={{ paddingTop: top + 16 }}>
        <ThemedText type="subtitle">Community</ThemedText>
      </View>

      <View className="px-4 gap-3">
        <Pressable
          onPress={() => router.push('/community/posts')}
          className="rounded-2xl p-4"
          style={{ backgroundColor: '#F3F4F6' }}>
          <ThemedText type="smallBold">Posts</ThemedText>
          <ThemedText themeColor="textSecondary">Browse community posts</ThemedText>
        </Pressable>
      </View>
    </View>
  );
}
