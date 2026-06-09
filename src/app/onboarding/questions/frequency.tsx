import { useRouter } from 'expo-router';
import { Controller, useFormContext } from 'react-hook-form';
import { Pressable, Text, View } from 'react-native';

import { OptionButton } from '@/components/onboarding/option-button';
import { FormProgress } from '@/components/onboarding/FormProgress';
import { FrequencyValue, OnboardingFormData } from '@/types/onboarding';

const OPTIONS: { label: string; value: FrequencyValue }[] = [
  { label: 'Rarely', value: 'RARELY' },
  { label: 'At least once a month', value: 'MONTHLY' },
  { label: 'At least once a week', value: 'WEEKLY' },
  { label: 'Every day', value: 'DAILY' },
];

export default function FrequencyScreen() {
  const router = useRouter();
  const { control, trigger } = useFormContext<OnboardingFormData>();

  const handleNext = async () => {
    const valid = await trigger('frequency');
    if (valid) router.push('/onboarding/questions/previous-attempts');
  };

  return (
    <View className="flex-1 p-6">
      <FormProgress filled={5} length={6} />
      <View className="flex-1 gap-6 justify-center">
        <Text className="text-2xl font-bold">How often do you use?</Text>
        <Controller
          control={control}
          name="frequency"
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
