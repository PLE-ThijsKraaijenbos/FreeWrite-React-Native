import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { cssInterop } from 'nativewind';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import { Pressable, Text, View } from 'react-native';

import { TextInput } from '@/components/TextInput';
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
      colors={['#EBEBE6', '#FAFAF8']}
      start={{ x: 1, y: 0 }}
      end={{ x: 0, y: 0 }}
      className="rounded-lg shadow-[0px_3px_3px_0px_rgba(0,0,0,0.25)] overflow-hidden">
      <Pressable onPress={onPickImage} className="bg-neutral-200 items-center justify-center overflow-hidden">
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={{ width: '100%', aspectRatio: 16 / 9 }} contentFit="cover" />
        ) : (
          <View className="px-4 py-10 items-center justify-center">
            <Text className="text-h3 font-body text-neutral-500">Click to add an image</Text>
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
          {errors.title && <Text className="text-body-sm font-body text-secondary-500 pt-1">{errors.title.message}</Text>}
        </View>
        <View>
          <Controller
            control={control}
            name="body"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput label="Message" placeholder="Share your thoughts." value={value} onChangeText={onChange} onBlur={onBlur} multiline />
            )}
          />
          {errors.body && <Text className="text-body-sm font-body text-secondary-500 pt-1">{errors.body.message}</Text>}
        </View>
      </View>
    </LinearGradient>
  );
}
