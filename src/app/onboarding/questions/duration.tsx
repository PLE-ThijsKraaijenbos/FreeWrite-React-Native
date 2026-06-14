import { useRouter } from 'expo-router';
import { Controller, useFormContext } from 'react-hook-form';
import { View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CTAButton } from '@/components/cta';

import { SelectOption } from '@/components/SelectOption';
import { OnboardingHeader } from '@/components/onboarding/OnboardingHeader';
import { DurationValue, OnboardingFormData } from '@/types/onboarding';

const OPTIONS: { label: string; value: DurationValue }[] = [
  { label: 'Less than 6 months ago', value: '<6M' },
  { label: '6-12 months ago', value: '6-12M' },
  { label: '1-2 years ago', value: '1-2Y' },
  { label: 'More than 2 years ago', value: '>2Y' },
  { label: "I'm not sure", value: 'NOT_SURE' },
];

export default function DurationScreen() {
  const router = useRouter();
  const { control, trigger } = useFormContext<OnboardingFormData>();
  const { bottom } = useSafeAreaInsets();

  const handleNext = async () => {
    const valid = await trigger('duration');
    if (valid) router.push('/onboarding/questions/goal');
  };

  return (
    <View className="flex-1 p-6" style={{ paddingBottom: bottom + 24 }}>
      <OnboardingHeader filled={2} length={6} />
      <View className="flex-1 gap-6 justify-center">
        <View className="gap-2">
          <ThemedText type="h2" className="text-center">When did it start to feel like a problem?</ThemedText>
          <ThemedText type="body" className="text-center">This helps us personalise your journey.</ThemedText>
        </View>
        <Controller
          control={control}
          name="duration"
          render={({ field: { onChange, value } }) => (
            <View className="gap-2">
              {OPTIONS.map((opt) => (
                <SelectOption
                  key={opt.value}
                  label={opt.label}
                  selected={value === opt.value}
                  onPress={() => onChange(opt.value)}
                />
              ))}
            </View>
          )}
        />
      </View>
      <CTAButton label="Continue" onPress={handleNext} />
    </View>
  );
}
