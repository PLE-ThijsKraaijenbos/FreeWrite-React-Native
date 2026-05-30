import { zodResolver } from '@hookform/resolvers/zod';
import { Stack, useRouter } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, Pressable, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { z } from 'zod';

import { ThemedText } from '@/components/themed-text';
import { useCreatePost } from '@/hooks/use-community';
import { useTheme } from '@/hooks/use-theme';

const schema = z.object({
  title: z.string().min(1, 'Required'),
  body: z.string().min(1, 'Required'),
});

type FormData = z.infer<typeof schema>;

export default function AddPostScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { top, bottom } = useSafeAreaInsets();
  const { mutate: createPost, isPending } = useCreatePost();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { title: '', body: '' },
  });

  const onSubmit = (data: FormData) => {
    createPost(data, { onSuccess: () => router.back() });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Stack.Screen options={{ presentation: 'modal' }} />

      <View
        style={{ paddingTop: top + 16, paddingBottom: bottom + 16 }}
        className="flex-1 px-4 gap-6">
        <View className="flex-row items-center justify-between">
          <ThemedText type="subtitle">New post</ThemedText>
          <Pressable onPress={() => router.back()} hitSlop={8}>
            <ThemedText themeColor="textSecondary">Cancel</ThemedText>
          </Pressable>
        </View>

        <View className="gap-2">
          <ThemedText type="smallBold">Title</ThemedText>
          <Controller
            control={control}
            name="title"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={{ backgroundColor: theme.backgroundElement, color: theme.text }}
                className="rounded-xl p-3"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="What's on your mind?"
                placeholderTextColor={theme.textSecondary}
              />
            )}
          />
          {errors.title && (
            <ThemedText style={{ color: '#ef4444' }}>{errors.title.message}</ThemedText>
          )}
        </View>

        <View className="flex-1 gap-2">
          <ThemedText type="smallBold">Body</ThemedText>
          <Controller
            control={control}
            name="body"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={{ backgroundColor: theme.backgroundElement, color: theme.text, flex: 1 }}
                className="rounded-xl p-3"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="Share your thoughts..."
                placeholderTextColor={theme.textSecondary}
                multiline
                textAlignVertical="top"
              />
            )}
          />
          {errors.body && (
            <ThemedText style={{ color: '#ef4444' }}>{errors.body.message}</ThemedText>
          )}
        </View>

        <Pressable
          onPress={handleSubmit(onSubmit)}
          disabled={isPending}
          style={{ backgroundColor: theme.text, opacity: isPending ? 0.5 : 1 }}
          className="rounded-2xl p-4 items-center">
          <ThemedText type="smallBold" style={{ color: theme.background }}>
            {isPending ? 'Posting...' : 'Post'}
          </ThemedText>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
