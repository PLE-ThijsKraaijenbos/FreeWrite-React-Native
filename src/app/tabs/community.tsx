import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { RefreshControl, ScrollView, View } from 'react-native';

import { CategorySelect } from '@/components/CategorySelect';
import { CommunityPost } from '@/components/CommunityPost';
import { CTAButton } from '@/components/cta';
import { PageHeader } from '@/components/PageHeader';
import { ThemedText } from '@/components/themed-text';
import { usePosts, useTags } from '@/hooks/use-community';
import { useTheme } from '@/hooks/use-theme';

export default function CommunityScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { data: posts = [], isLoading, isError, refetch, isRefetching } = usePosts();
  const { data: tags = [] } = useTags();
  const [selectedTagId, setSelectedTagId] = useState<string | null>(null);

  const categories = useMemo(() => {
    return tags.map((t) => ({ id: t.id, label: t.value }));
  }, [tags]);

  const filteredPosts = useMemo(() => {
    if (!selectedTagId) return posts;
    return posts.filter((post) => post.tags.some((t) => t.id === selectedTagId));
  }, [posts, selectedTagId]);

  return (
    <View className="flex-1" style={{ backgroundColor: theme.background }}>
      <PageHeader subtitle="A supportive" title="Community" />

      <CategorySelect
        categories={categories}
        selectedId={selectedTagId}
        onSelect={setSelectedTagId}
      />

      <View className="flex-1 overflow-hidden">
        {isLoading ? (
          <ThemedText className="text-center mt-12" themeColor="textSecondary">
            Loading...
          </ThemedText>
        ) : isError ? (
          <ThemedText className="text-center mt-12" themeColor="textSecondary">
            Failed to load posts. Please try again.
          </ThemedText>
        ) : filteredPosts.length === 0 ? (
          <ThemedText className="text-center mt-12" themeColor="textSecondary">
            {selectedTagId ? 'No posts with this tag yet.' : 'No posts yet.'}
          </ThemedText>
        ) : (
          <ScrollView
            className="flex-1"
            contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 16, gap: 16 }}
            refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}>
            {filteredPosts.map((post) => (
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
