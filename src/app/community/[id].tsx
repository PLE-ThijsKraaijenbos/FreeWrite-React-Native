import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { cssInterop } from 'nativewind';
import { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import ChatBubbleIcon from '@/assets/icons/chat-bubble-outline.svg';
import HeartIcon from '@/assets/icons/heart.svg';
import HeartOutlineIcon from '@/assets/icons/heart-outline.svg';
import { BackButton } from '@/components/BackButton';
import { CTAButton } from '@/components/cta';
import { Divider } from '@/components/Divider';
import { TextInput } from '@/components/TextInput';
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
      <Text className="font-body text-body-sm text-neutral-500">{comment.body}</Text>
      <View className="flex-row items-center gap-0.5">
        <HeartOutlineIcon width={24} height={24} color="#2A2924" />
        <Text className="font-body text-body-sm text-neutral-600">{comment.likes_count}</Text>
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
        <Text className="font-body text-body text-neutral-500">Post not found.</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-neutral-100"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={{ paddingTop: top + 16 }} className="px-4 pb-3">
        <BackButton onPress={() => router.back()} />
      </View>

      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: 24 }}>
        {post.image_url && (
          <Image source={{ uri: post.image_url }} style={{ width: '100%', aspectRatio: 3 / 2 }} contentFit="cover" />
        )}

        <View className="px-4 pt-4 gap-3">
          <Text className="font-heading-bold text-h2 text-neutral-600">{post.title}</Text>
          <Text className="font-body text-body-sm text-neutral-500">{post.body}</Text>

          <View className="flex-row items-center gap-4">
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
              <Text className="font-body text-body-sm text-neutral-600">{post.likes_count}</Text>
            </Pressable>
            <View className="flex-row items-center gap-0.5">
              <ChatBubbleIcon width={24} height={24} color="#2A2924" />
              <Text className="font-body text-body-sm text-neutral-600">{DUMMY_COMMENTS.length}</Text>
            </View>
          </View>

          <Divider />

          <View className="gap-2">
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

          <Text className="font-heading-bold text-h2 text-neutral-600">Comments</Text>
          <View className="gap-3">
            {DUMMY_COMMENTS.map((c) => (
              <CommentCard key={c.id} comment={c} />
            ))}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
