import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Image, Pressable, Text, TextInput, View } from 'react-native';

import { OnboardingFormData } from '@/types/onboarding';

const BASE = 'https://api.dicebear.com/9.x/avataaars/png';
const SHARED_PARAMS =
  'hairColor=4a312c&clothing=shirtCrewNeck&clothesColor=262e33' +
  '&eyes=default&eyebrows=default&mouth=default&skinColor=f8d25c';

const OPTIONS = [
  {
    label: 'Male',
    value: 'MALE' as const,
    uri: `${BASE}?top=shortRound&${SHARED_PARAMS}`,
  },
  {
    label: 'Female',
    value: 'FEMALE' as const,
    uri: `${BASE}?top=straight01&${SHARED_PARAMS}`,
  },
];

export default function AvatarScreen() {
  const router = useRouter();
  const { control, setValue, trigger } = useFormContext<OnboardingFormData>();
  const [selected, setSelected] = useState<'MALE' | 'FEMALE' | null>(null);

  const handleSelect = (opt: (typeof OPTIONS)[number]) => {
    setSelected(opt.value);
    setValue('avatar_url', opt.uri);
  };

  const handleNext = async () => {
    const valid = await trigger('name');
    if (valid) router.push('/onboarding/complete');
  };

  return (
    <View className="flex-1 p-6">
      <View className="flex-1 gap-6 justify-center">
        <View className="gap-2">
          <Text className="text-2xl font-bold">Choose your character</Text>
          <Text>Pick one of the default avatars and give yourself a name. Throughout your journey you will unlock different items which you can equip on your avatar.</Text>
        </View>
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Your name"
              className="p-4 border border-gray-400"
            />
          )}
        />
        <View className="flex-row gap-4">
          {OPTIONS.map((opt) => (
            <Pressable
              key={opt.value}
              onPress={() => handleSelect(opt)}
              className={`flex-1 items-center p-4 gap-3 border-2 ${
                selected === opt.value ? 'border-black' : 'border-gray-200'
              }`}>
              <Image source={{ uri: opt.uri }} style={{ width: 120, height: 120 }} />
              <Text className="font-medium">{opt.label}</Text>
            </Pressable>
          ))}
        </View>
      </View>
      <Pressable onPress={handleNext} className="p-4 border items-center">
        <Text>Next</Text>
      </Pressable>
    </View>
  );
}
