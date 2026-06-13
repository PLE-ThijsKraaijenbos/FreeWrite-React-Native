import { useRouter } from 'expo-router';
import { RefreshControl, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CategorySelect } from '@/components/CategorySelect';
import { CommunityPost } from '@/components/CommunityPost';
import { CTAButton } from '@/components/cta';
import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';
import { usePosts } from '@/hooks/use-community';

export default function CommunityScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { top } = useSafeAreaInsets();
  const { data: posts = [], isLoading, isError, refetch, isRefetching } = usePosts();

  return (
    <View className="flex-1" style={{ backgroundColor: theme.background }}>
      <View className="px-4 pb-3" style={{ paddingTop: top + 16 }}>
        <ThemedText type="subtitle">Community</ThemedText>
      </View>

      <CategorySelect />

      <View className="flex-1 overflow-hidden">
        {isLoading ? (
          <ThemedText className="text-center mt-12" themeColor="textSecondary">
            Loading...
          </ThemedText>
        ) : isError ? (
          <ThemedText className="text-center mt-12" themeColor="textSecondary">
            Failed to load posts. Please try again.
          </ThemedText>
        ) : posts.length === 0 ? (
          <ThemedText className="text-center mt-12" themeColor="textSecondary">
            No posts yet.
          </ThemedText>
        ) : (
          <ScrollView
            className="flex-1"
            contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 16, gap: 16 }}
            refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}>
            {posts.map((post) => (
              <CommunityPost key={post.id} post={post} />
            ))}
          </ScrollView>
        )}
      </View>

      <View className="px-4 pt-3 pb-4">
        <CTAButton label="New post" onPress={() => router.push('/add-post')} />
      </View>
    </View>
  );
}
