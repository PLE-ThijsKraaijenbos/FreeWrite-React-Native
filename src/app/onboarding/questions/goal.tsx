import { useRouter } from 'expo-router';
import { Controller, useFormContext } from 'react-hook-form';
import { Pressable, Text, View } from 'react-native';

import { OptionButton } from '@/components/onboarding/option-button';
import { ProgressBar } from '@/components/onboarding/progress-bar';
import { GoalValue, OnboardingFormData } from '@/types/onboarding';

const OPTIONS: { label: string; value: GoalValue }[] = [
  { label: 'I want to use less', value: 'USE_LESS' },
  { label: 'I want to quit completely', value: 'QUIT' },
  { label: "I'm not sure yet", value: 'NOT_SURE' },
];

export default function GoalScreen() {
  const router = useRouter();
  const { control, trigger } = useFormContext<OnboardingFormData>();

  const handleNext = async () => {
    const valid = await trigger('goal');
    if (valid) router.push('/onboarding/questions/trigger');
  };

  return (
    <View className="flex-1 p-6">
      <ProgressBar current={3} total={6} />
      <View className="flex-1 gap-6 justify-center">
        <Text className="text-2xl font-bold">What is your goal for this journey?</Text>
        <Controller
          control={control}
          name="goal"
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
