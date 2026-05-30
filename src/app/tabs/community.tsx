import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Pressable, RefreshControl, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';
import { useLikePost, usePosts } from '@/hooks/use-community';
import { Post } from '@/types/community';

function PostCard({ post }: { post: Post }) {
  const theme = useTheme();
  const { mutate: toggleLike, isPending } = useLikePost();

  return (
    <View className="rounded-2xl overflow-hidden" style={{ backgroundColor: theme.backgroundElement }}>
      {post.image_url && (
        <Image
          source={{ uri: post.image_url }}
          style={{ width: '100%', aspectRatio: 16 / 9 }}
          contentFit="cover"
        />
      )}
      <View className="p-4 gap-1">
        <ThemedText type="smallBold">{post.title}</ThemedText>
        <ThemedText themeColor="textSecondary">{post.body}</ThemedText>
        <View className="flex-row items-center gap-1 mt-1">
          <Pressable
            onPress={() => toggleLike({ postId: post.id, liked: post.is_liked_by_user })}
            disabled={isPending}
            hitSlop={8}>
            <Ionicons
              name={post.is_liked_by_user ? 'heart' : 'heart-outline'}
              size={20}
              color={post.is_liked_by_user ? '#ef4444' : theme.textSecondary}
            />
          </Pressable>
          <ThemedText themeColor="textSecondary">{post.likes_count}</ThemedText>
        </View>
      </View>
    </View>
  );
}

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
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 96, gap: 16 }}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}>
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </ScrollView>
      )}

      <Pressable
        onPress={() => router.push('/add-post')}
        style={{ backgroundColor: theme.text, bottom: 16 }}
        className="absolute left-4 right-4 rounded-2xl p-4 items-center flex-row justify-center gap-2">
        <Ionicons name="add" size={20} color={theme.background} />
        <ThemedText type="smallBold" style={{ color: theme.background }}>New post</ThemedText>
      </Pressable>
    </View>
  );
}
