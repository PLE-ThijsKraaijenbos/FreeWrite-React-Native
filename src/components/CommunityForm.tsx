import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { cssInterop } from 'nativewind';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import { Pressable, View } from 'react-native';

import { TextInput } from '@/components/TextInput';
import { ThemedText } from '@/components/themed-text';
import { shadows } from '@/constants/shadows';
import { AddPostFormData } from '@/types/community';

cssInterop(LinearGradient, { className: 'style' });

type Props = {
  control: Control<AddPostFormData>;
  errors: FieldErrors<AddPostFormData>;
  imageUri?: string | null;
  onPickImage: () => void;
};

export function CommunityForm({ control, errors, imageUri, onPickImage }: Props) {
  return (
    <LinearGradient
      colors={['#FAFAF8', '#EBEBE6']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={shadows.drop}
      className="rounded-lg overflow-hidden">
      <Pressable onPress={onPickImage} className="bg-neutral-200 items-center justify-center overflow-hidden">
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={{ width: '100%', aspectRatio: 16 / 9 }} contentFit="cover" />
        ) : (
          <View className="px-4 py-10 items-center justify-center">
            <ThemedText type="body" className="text-neutral-500">Click to add an image</ThemedText>
          </View>
        )}
      </Pressable>
      <View className="p-4 gap-4">
        <View>
          <Controller
            control={control}
            name="title"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput label="Title" placeholder="What’s on your mind?" value={value} onChangeText={onChange} onBlur={onBlur} />
            )}
          />
          {errors.title && <ThemedText type="body-sm" className="text-secondary-500 pt-1">{errors.title.message}</ThemedText>}
        </View>
        <View>
          <Controller
            control={control}
            name="body"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput label="Message" placeholder="Share your thoughts." value={value} onChangeText={onChange} onBlur={onBlur} multiline />
            )}
          />
          {errors.body && <ThemedText type="body-sm" className="text-secondary-500 pt-1">{errors.body.message}</ThemedText>}
        </View>
      </View>
    </LinearGradient>
  );
}
