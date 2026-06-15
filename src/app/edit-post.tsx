import { zodResolver } from '@hookform/resolvers/zod';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CommunityForm } from '@/components/CommunityForm';
import { CTAButton } from '@/components/cta';
import { ThemedText } from '@/components/themed-text';
import { useUpdatePost } from '@/hooks/use-community';
import { useTheme } from '@/hooks/use-theme';
import { addPostSchema, AddPostFormData } from '@/types/community';

export default function EditPostScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { top, bottom } = useSafeAreaInsets();
  const { mutate: updatePost, isPending } = useUpdatePost();

  const { id, title, body, image_url } = useLocalSearchParams<{
    id: string;
    title: string;
    body: string;
    image_url?: string;
  }>();

  const [image, setImage] = useState<ImagePicker.ImagePickerAsset | null>(null);

  const {
    control,
    handleSubmit,
  } = useForm<AddPostFormData>({
    resolver: zodResolver(addPostSchema),
    defaultValues: { title, body },
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
    updatePost(
      { id: Number(id), ...data, image: image ?? undefined },
      { onSuccess: () => router.back() },
    );
  };

  const currentImageUri = image?.uri ?? image_url ?? null;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={{ paddingTop: top + 16 }} className="px-4">
        <View className="flex-row items-center justify-between">
          <ThemedText type="h2">Edit post</ThemedText>
          <Pressable onPress={() => router.back()} hitSlop={8}>
            <ThemedText themeColor="textSecondary">Cancel</ThemedText>
          </Pressable>
        </View>
      </View>

      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ padding: 16, paddingBottom: bottom + 24, gap: 24 }}>
        <CommunityForm
          control={control}
          imageUri={currentImageUri}
          onPickImage={pickImage}
        />

        <CTAButton
          label={isPending ? 'Saving...' : 'Save'}
          onPress={handleSubmit(onSubmit)}
          disabled={isPending}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
