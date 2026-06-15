import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { cssInterop } from 'nativewind';
import { Control, Controller } from 'react-hook-form';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { TextInput } from '@/components/TextInput';
import { ThemedText } from '@/components/themed-text';
import { shadows } from '@/constants/shadows';
import { AddPostFormData, MAX_TAGS, Tag } from '@/types/community';

cssInterop(LinearGradient, { className: 'style' });

const styles = StyleSheet.create({
  textShadow: {
    textShadowColor: 'rgba(0,0,0,0.50)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 2,
  },
});

type Props = {
  control: Control<AddPostFormData>;
  imageUri?: string | null;
  onPickImage: () => void;
  tags?: Tag[];
};

function TagChip({
  label,
  selected,
  disabled,
  onPress,
}: {
  label: string;
  selected: boolean;
  disabled?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} disabled={disabled}>
      <LinearGradient
        colors={selected ? ['#FCAA88', '#F47D4E'] : ['#FAFAF8', '#EBEBE6']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={shadows.drop}
        className="px-4 py-2 rounded-lg justify-center items-center overflow-hidden"
      >
        <ThemedText
          type="body-sm-bold"
          style={selected ? styles.textShadow : undefined}
          className={selected ? 'text-neutral-100' : disabled ? 'text-neutral-400' : 'text-neutral-600'}
        >
          {label}
        </ThemedText>
      </LinearGradient>
    </Pressable>
  );
}

export function CommunityForm({ control, imageUri, onPickImage, tags = [] }: Props) {
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
            render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
              <>
                <TextInput label="Title" placeholder="What’s on your mind?" value={value} onChangeText={onChange} onBlur={onBlur} />
                {error && <ThemedText type="body-sm" className="text-secondary-500 pt-1">{error.message}</ThemedText>}
              </>
            )}
          />
        </View>
        <View>
          <Controller
            control={control}
            name="body"
            render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
              <>
                <TextInput label="Message" placeholder="Share your thoughts." value={value} onChangeText={onChange} onBlur={onBlur} multiline />
                {error && <ThemedText type="body-sm" className="text-secondary-500 pt-1">{error.message}</ThemedText>}
              </>
            )}
          />
        </View>

        {tags.length > 0 && (
          <View>
            <Controller
              control={control}
              name="tag_ids"
              render={({ field: { value = [], onChange } }) => (
                <>
                  <ThemedText type="body-bold">
                    Tags{' '}
                    <ThemedText type="body-sm" themeColor="textSecondary">
                      (max {MAX_TAGS})
                    </ThemedText>
                  </ThemedText>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerClassName="gap-2 py-3 px-1"
                    className="-mx-1"
                    style={{ overflow: 'visible' }}>
                    {tags.map((tag) => {
                      const isSelected = value.includes(tag.id);
                      const atLimit = value.length >= MAX_TAGS;
                      return (
                        <TagChip
                          key={tag.id}
                          label={tag.value}
                          selected={isSelected}
                          disabled={!isSelected && atLimit}
                          onPress={() => {
                            if (isSelected) {
                              onChange(value.filter((id: string) => id !== tag.id));
                            } else if (!atLimit) {
                              onChange([...value, tag.id]);
                            }
                          }}
                        />
                      );
                    })}
                  </ScrollView>
                </>
              )}
            />
          </View>
        )}
      </View>
    </LinearGradient>
  );
}
