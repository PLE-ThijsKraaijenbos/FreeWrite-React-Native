import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { cssInterop } from 'nativewind';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import ChatBubbleIcon from '@/assets/icons/chat-bubble-outline.svg';
import HeartIcon from '@/assets/icons/heart.svg';
import HeartOutlineIcon from '@/assets/icons/heart-outline.svg';
import PencilIcon from '@/assets/icons/pencil.svg';
import { shadows } from '@/constants/shadows';
import { ThemedText } from '@/components/themed-text';
import { useDeletePost, useLikePost } from '@/hooks/use-community';
import { Post } from '@/types/community';

cssInterop(LinearGradient, { className: 'style' });

const styles = StyleSheet.create({
  textShadow: {
    textShadowColor: 'rgba(0,0,0,0.50)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 2,
  },
});

type Props = {
  post: Post;
};

export function CommunityPost({ post }: Props) {
  const router = useRouter();
  const { mutate: toggleLike, isPending } = useLikePost();
  const { mutate: deletePost } = useDeletePost();

  const openDetail = () => router.push({ pathname: '/community/[id]', params: { id: post.id } });

  const handleEdit = () => {
    router.push({
      pathname: '/edit-post',
      params: { id: post.id, title: post.title, body: post.body, image_url: post.image_url ?? '' },
    });
  };

  const confirmDelete = () => {
    Alert.alert('Delete post', 'Are you sure you want to delete this post?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deletePost(post.id) },
    ]);
  };

  return (
    <Pressable onPress={openDetail} style={shadows.drop} className="rounded-lg overflow-hidden bg-neutral-100">
      {post.image_url && (
        <Image source={{ uri: post.image_url }} style={{ width: '100%', aspectRatio: 5 / 2 }} contentFit="cover" />
      )}
      <LinearGradient
        colors={['#FAFAF8', '#EBEBE6']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        className="px-4 py-3 gap-1">
        <View className="flex-row items-start justify-between gap-2">
          <ThemedText type="h3" className="flex-1">{post.title}</ThemedText>
          {post.is_own_post && (
            <Pressable onPress={handleEdit} onLongPress={confirmDelete} hitSlop={8}>
              <PencilIcon width={20} height={20} color="#2A2924" />
            </Pressable>
          )}
        </View>
        <ThemedText type="body-sm" className="text-neutral-400" numberOfLines={1}>
          {post.body}
        </ThemedText>
        {post.tags.length > 0 && (
          <View className="flex-row flex-wrap gap-2 mt-2">
            {post.tags.map((tag) => (
              <LinearGradient
                key={tag.id}
                colors={['#FFF3EE', '#FDD4BE']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={shadows.drop}
                className="px-3 py-1 rounded-lg overflow-hidden">
                <ThemedText type="body-sm-bold" className="text-neutral-600">{tag.value}</ThemedText>
              </LinearGradient>
            ))}
          </View>
        )}
        <View className="flex-row items-center gap-4 mt-2">
          <Pressable
            className="flex-row items-center gap-0.5"
            onPress={() => toggleLike({ postId: post.id, liked: post.is_liked_by_user })}
            disabled={isPending}
            hitSlop={8}>
            {post.is_liked_by_user ? (
              <HeartIcon width={24} height={24} color="#F47D4E" />
            ) : (
              <HeartOutlineIcon width={24} height={24} color="#2A2924" />
            )}
            <ThemedText type="body-sm" className="text-neutral-600">{post.likes_count}</ThemedText>
          </Pressable>
          <View className="flex-row items-center gap-0.5">
            <ChatBubbleIcon width={24} height={24} color="#2A2924" />
            <ThemedText type="body-sm" className="text-neutral-600">{post.comments_count}</ThemedText>
          </View>
        </View>
      </LinearGradient>
    </Pressable>
  );
}
