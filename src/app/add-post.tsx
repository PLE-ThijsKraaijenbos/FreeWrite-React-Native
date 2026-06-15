import { zodResolver } from '@hookform/resolvers/zod';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CommunityForm } from '@/components/CommunityForm';
import { CTAButton } from '@/components/cta';
import { ThemedText } from '@/components/themed-text';
import { useCreatePost, useTags } from '@/hooks/use-community';
import { useTheme } from '@/hooks/use-theme';
import { addPostSchema, AddPostFormData } from '@/types/community';

export default function AddPostScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { top, bottom } = useSafeAreaInsets();
  const { mutate: createPost, isPending } = useCreatePost();
  const { data: tags = [] } = useTags();
  const [image, setImage] = useState<ImagePicker.ImagePickerAsset | null>(null);

  const {
    control,
    handleSubmit,
  } = useForm<AddPostFormData>({
    resolver: zodResolver(addPostSchema),
    defaultValues: { title: '', body: '', tag_ids: [] },
  });

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
    createPost(
      { ...data, image: image ?? undefined },
      { onSuccess: () => router.back() },
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <View style={{ paddingTop: top + 16 }} className="px-4">
        <View className="flex-row items-center justify-between">
          <ThemedText type="h2">New post</ThemedText>
          <Pressable onPress={() => router.back()} hitSlop={8}>
            <ThemedText themeColor="textSecondary">Cancel</ThemedText>
          </Pressable>
        </View>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ padding: 16, gap: 24 }}>
          <CommunityForm
            control={control}
            imageUri={image?.uri}
            onPickImage={pickImage}
            tags={tags}
          />
        </ScrollView>
      </KeyboardAvoidingView>

      <View className="px-4 pt-2" style={{ paddingBottom: bottom + 16 }}>
        <CTAButton
          label={isPending ? 'Posting...' : 'Post'}
          onPress={handleSubmit(onSubmit)}
          disabled={isPending}
        />
      </View>
    </View>
  );
}
