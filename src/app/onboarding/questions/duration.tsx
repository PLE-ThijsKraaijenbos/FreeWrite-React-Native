import { useRouter } from 'expo-router';
import { Controller, useFormContext } from 'react-hook-form';
import { Pressable, Text, View } from 'react-native';

import { OptionButton } from '@/components/onboarding/option-button';
import { FormProgress } from '@/components/onboarding/FormProgress';
import { DurationValue, OnboardingFormData } from '@/types/onboarding';

const OPTIONS: { label: string; value: DurationValue }[] = [
  { label: 'Less than 6 months', value: '<6M' },
  { label: '6–12 months', value: '6-12M' },
  { label: '1–2 years', value: '1-2Y' },
  { label: '2+ years', value: '>2Y' },
  { label: "I'm not sure", value: 'NOT_SURE' },
];

export default function DurationScreen() {
  const router = useRouter();
  const { control, trigger } = useFormContext<OnboardingFormData>();

  const handleNext = async () => {
    const valid = await trigger('duration');
    if (valid) router.push('/onboarding/questions/goal');
  };

  return (
    <View className="flex-1 p-6">
      <FormProgress filled={2} length={6} />
      <View className="flex-1 gap-6 justify-center">
        <View className="gap-2">
          <Text className="text-2xl font-bold">When did it start to feel like a problem?</Text>
          <Text>This helps us personalise your journey.</Text>
        </View>
        <Controller
          control={control}
          name="duration"
          render={({ field: { onChange, value } }) => (
            <View className="gap-2">
              {OPTIONS.map((opt) => (
                <OptionButton
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
      <Pressable onPress={handleNext} className="p-4 border items-center">
        <Text>Next</Text>
      </Pressable>
    </View>
  );
}
