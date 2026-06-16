import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { View } from 'react-native';

import { ThemedText } from '@/components/themed-text';

import { CTAButton } from '@/components/cta';
import { Divider } from '@/components/Divider';
import { OnboardingFormLayout } from '@/components/onboarding/OnboardingFormLayout';
import { TextInput } from '@/components/TextInput';
import { AvatarSelect } from '@/components/onboarding/AvatarSelect';
import { buildAvatarUrl } from '@/lib/avatar';
import { OnboardingFormData } from '@/types/onboarding';

//shared dicebear params between male & female default options.
const SHARED: Record<string, string> = {
  hairColor: '4a312c',
  clothing: 'shirtCrewNeck',
  clothesColor: '262e33',
  eyes: 'default',
  eyebrows: 'default',
  mouth: 'default',
  skinColor: 'f8d25c',
};

const PARAMS: Record<'MALE' | 'FEMALE', Record<string, string>> = {
  MALE: { ...SHARED, top: 'shortRound' },
  FEMALE: { ...SHARED, top: 'straight01' },
};

const OPTIONS = [
  { label: 'Male', value: 'MALE' as const, uri: buildAvatarUrl(PARAMS.MALE) },
  { label: 'Female', value: 'FEMALE' as const, uri: buildAvatarUrl(PARAMS.FEMALE) },
];

export default function AvatarScreen() {
  const router = useRouter();
  const { control, setValue, trigger } = useFormContext<OnboardingFormData>();
  const [selected, setSelected] = useState<'MALE' | 'FEMALE' | null>(null);
  const [attemptedNext, setAttemptedNext] = useState(false);

  const handleSelect = (opt: (typeof OPTIONS)[number]) => {
    setSelected(opt.value);
    setValue('avatar', PARAMS[opt.value]);
  };

  const handleNext = async () => {
    setAttemptedNext(true);
    const valid = await trigger('name');
    if (valid) router.push('/onboarding/complete');
  };

  return (
    <OnboardingFormLayout
      onBack={() => router.back()}
      gap="gap-8"
      footer={<CTAButton label="Continue" onPress={handleNext} />}
    >
      <View className="gap-2">
        <ThemedText type="h1" className="text-center">Create your avatar</ThemedText>
        <ThemedText type="body" className="text-center">
          Pick one of the default avatars and give yourself a name. Throughout your journey you
          will unlock different items which you can equip on your avatar.
        </ThemedText>
      </View>
      <Divider />
      <View className="gap-4">
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, onBlur, value }, fieldState: { error, isTouched } }) => (
            <View className="gap-1">
              <TextInput
                label="Name"
                placeholder="Your name"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
              />
              {error && (isTouched || attemptedNext) && (
                <ThemedText type="body-sm" className="text-secondary-500 pt-1">{error.message}</ThemedText>
              )}
            </View>
          )}
        />
        <AvatarSelect options={OPTIONS} selected={selected} onSelect={handleSelect} />
      </View>
      <Divider />
    </OnboardingFormLayout>
  );
}
