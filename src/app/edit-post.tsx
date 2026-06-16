import { zodResolver } from '@hookform/resolvers/zod';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BackButton } from '@/components/BackButton';
import { CommunityForm } from '@/components/CommunityForm';
import { CTAButton } from '@/components/cta';
import { Divider } from '@/components/Divider';
import { ThemedText } from '@/components/themed-text';
import { usePost, useTags, useUpdatePost } from '@/hooks/use-community';
import { useTheme } from '@/hooks/use-theme';
import { addPostSchema, AddPostFormData } from '@/types/community';

export default function EditPostScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { top, bottom } = useSafeAreaInsets();
  const { mutate: updatePost, isPending } = useUpdatePost();

  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: post } = usePost(Number(id));
  const { data: tags = [] } = useTags();

  const [image, setImage] = useState<ImagePicker.ImagePickerAsset | null>(null);

  const {
    control,
    handleSubmit,
    reset,
  } = useForm<AddPostFormData>({
    resolver: zodResolver(addPostSchema),
    defaultValues: {
      title: post?.title ?? '',
      body: post?.body ?? '',
      tag_ids: post?.tags.map((t) => t.id) ?? [],
    },
  });

  useEffect(() => {
    if (post) {
      reset({
        title: post.title,
        body: post.body,
        tag_ids: post.tags.map((t) => t.id),
      });
    }
  }, [post, reset]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });
    if (!result.canceled) setImage(result.assets[0]);
  };

  const onSubmit = (data: AddPostFormData) => {
    updatePost(
      { id: Number(id), ...data, image: image ?? undefined },
      { onSuccess: () => router.back() },
    );
  };

  const currentImageUri = image?.uri ?? post?.image_url ?? null;

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            paddingTop: top + 64,
            paddingBottom: bottom + 16,
            gap: 32,
          }}>
          <ThemedText type="h1" className="px-4">Edit post</ThemedText>

          <Divider />

          <View className="px-4">
            <CommunityForm
              control={control}
              imageUri={currentImageUri}
              onPickImage={pickImage}
              tags={tags}
            />
          </View>

          <Divider />

          <View className="px-4">
            <CTAButton
              label={isPending ? 'Saving...' : 'Save'}
              onPress={handleSubmit(onSubmit)}
              disabled={isPending}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Fixed back button overlay */}
      <View
        className="absolute top-0 left-0 right-0 z-10 px-4 pb-3"
        style={{ paddingTop: top + 8, backgroundColor: theme.background }}>
        <BackButton onPress={() => router.back()} />
      </View>
    </View>
  );
}
