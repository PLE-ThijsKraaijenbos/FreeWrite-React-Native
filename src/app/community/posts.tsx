import { RefreshControl, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';
import { usePosts } from '@/hooks/use-community';
import { Post } from '@/types/community';

function PostCard({ post }: { post: Post }) {
  return (
    <View className="rounded-2xl p-4 gap-1" style={{ backgroundColor: '#F3F4F6' }}>
      <ThemedText type="smallBold">{post.title}</ThemedText>
      <ThemedText themeColor="textSecondary">{post.body}</ThemedText>
    </View>
  );
}

export default function PostsScreen() {
  const theme = useTheme();
  const { top } = useSafeAreaInsets();
  const { data: posts = [], isLoading, isError, refetch, isRefetching } = usePosts();

  return (
    <View className="flex-1" style={{ backgroundColor: theme.background }}>
      <View className="px-4 pb-3" style={{ paddingTop: top + 16 }}>
        <ThemedText type="subtitle">Community</ThemedText>
      </View>

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
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32, gap: 16 }}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}>
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </ScrollView>
      )}
    </View>
  );
}
