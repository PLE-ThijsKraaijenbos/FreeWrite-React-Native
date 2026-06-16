import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { cssInterop } from 'nativewind';
import { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import ChatBubbleIcon from '@/assets/icons/chat-bubble-outline.svg';
import HeartIcon from '@/assets/icons/heart.svg';
import HeartOutlineIcon from '@/assets/icons/heart-outline.svg';
import { BackButton } from '@/components/BackButton';
import { CTAButton } from '@/components/cta';
import { Divider } from '@/components/Divider';
import { TextInput } from '@/components/TextInput';
import { ThemedText } from '@/components/themed-text';
import { shadows } from '@/constants/shadows';
import { useLikePost, usePost } from '@/hooks/use-community';

cssInterop(LinearGradient, { className: 'style' });

// Comments have no backend yet — hardcoded sample so the section has shape.
type Comment = { id: number; body: string; likes_count: number };
const DUMMY_COMMENTS: Comment[] = [{ id: 1, body: 'Thanks for sharing your story!', likes_count: 2 }];

function CommentCard({ comment }: { comment: Comment }) {
  return (
    <LinearGradient
      colors={['#FAFAF8', '#EBEBE6']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={shadows.drop}
      className="rounded-lg px-4 py-3 gap-1">
      <ThemedText type="body-sm" className="text-neutral-500">{comment.body}</ThemedText>
      <View className="flex-row items-center gap-0.5">
        <HeartOutlineIcon width={24} height={24} color="#2A2924" />
        <ThemedText type="body-sm" className="text-neutral-600">{comment.likes_count}</ThemedText>
      </View>
    </LinearGradient>
  );
}

export default function CommunityPostScreen() {
  const router = useRouter();
  const { top } = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: post, isLoading } = usePost(Number(id));
  const { mutate: toggleLike, isPending } = useLikePost();
  const [comment, setComment] = useState('');

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-neutral-100">
        <ActivityIndicator />
      </View>
    );
  }

  if (!post) {
    return (
      <View className="flex-1 items-center justify-center bg-neutral-100 px-4">
        <ThemedText type="body" className="text-neutral-500">Post not found.</ThemedText>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-neutral-100"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          gap: 24,
          paddingTop: post.image_url ? 0 : top + 64,
          paddingBottom: 24,
        }}>
        {post.image_url && (
          <Image source={{ uri: post.image_url }} style={{ width: '100%', aspectRatio: 3 / 2 }} contentFit="cover" />
        )}

        {/* Title + description */}
        <View className="px-4 gap-4">
          <ThemedText type="h2">{post.title}</ThemedText>
          <ThemedText type="body-sm" className="text-neutral-500">{post.body}</ThemedText>

          {post.tags.length > 0 && (
            <View className="flex-row flex-wrap gap-2">
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
        </View>

        <Divider />

        {/* Like + comment counts */}
        <View className="px-4 flex-row items-center gap-4">
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
            <ThemedText type="body-sm" className="text-neutral-600">{DUMMY_COMMENTS.length}</ThemedText>
          </View>
        </View>

        <Divider />

        {/* Add a comment */}
        <View className="px-4 gap-3">
          <TextInput
            label="Post a comment"
            placeholder="Share your thoughts"
            value={comment}
            onChangeText={setComment}
          />
          <CTAButton
            variant="default"
            label="Save comment"
            disabled={!comment.trim()}
            onPress={() => setComment('')}
          />
        </View>

        <Divider />

        {/* Comments */}
        <View className="px-4 gap-3">
          <ThemedText type="h2">Comments</ThemedText>
          <View className="gap-3">
            {DUMMY_COMMENTS.map((c) => (
              <CommentCard key={c.id} comment={c} />
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Back button overlay */}
      <View className="absolute left-4 z-10" style={{ top: top + 8 }}>
        <BackButton onPress={() => router.back()} />
      </View>
    </KeyboardAvoidingView>
  );
}
