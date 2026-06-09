import { zodResolver } from '@hookform/resolvers/zod';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TextInput } from '@/components/TextInput';
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
    formState: { errors },
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
      <Stack.Screen options={{ presentation: 'modal' }} />

      <View style={{ paddingTop: top + 16 }} className="px-4">
        <View className="flex-row items-center justify-between">
          <ThemedText type="subtitle">Edit post</ThemedText>
          <Pressable onPress={() => router.back()} hitSlop={8}>
            <ThemedText themeColor="textSecondary">Cancel</ThemedText>
          </Pressable>
        </View>
      </View>

      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ padding: 16, paddingBottom: bottom + 24, gap: 24 }}>
        <View className="gap-2">
          <ThemedText type="smallBold">Title</ThemedText>
          <Controller
            control={control}
            name="title"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="What's on your mind?"
              />
            )}
          />
          {errors.title && (
            <ThemedText style={{ color: '#ef4444' }}>{errors.title.message}</ThemedText>
          )}
        </View>

        <View className="gap-2">
          <ThemedText type="smallBold">Body</ThemedText>
          <Controller
            control={control}
            name="body"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="Share your thoughts..."
                multiline
                textAlignVertical="top"
                style={{ minHeight: 120 }}
              />
            )}
          />
          {errors.body && (
            <ThemedText style={{ color: '#ef4444' }}>{errors.body.message}</ThemedText>
          )}
        </View>

        <Pressable
          onPress={pickImage}
          style={{ backgroundColor: theme.backgroundElement }}
          className="rounded-xl overflow-hidden">
          {currentImageUri ? (
            <Image
              source={{ uri: currentImageUri }}
              style={{ width: '100%', aspectRatio: 16 / 9 }}
              contentFit="cover"
            />
          ) : (
            <View className="items-center justify-center p-4">
              <ThemedText themeColor="textSecondary">Tap to add a photo</ThemedText>
            </View>
          )}
        </Pressable>

        <Pressable
          onPress={handleSubmit(onSubmit)}
          disabled={isPending}
          style={{ backgroundColor: theme.text, opacity: isPending ? 0.5 : 1 }}
          className="rounded-2xl p-4 items-center">
          <ThemedText type="smallBold" style={{ color: theme.background }}>
            {isPending ? 'Saving...' : 'Save'}
          </ThemedText>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
