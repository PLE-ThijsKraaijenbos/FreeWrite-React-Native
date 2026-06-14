import { useRouter } from 'expo-router';
import { Controller, useFormContext } from 'react-hook-form';
import { View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CTAButton } from '@/components/cta';

import { SelectOption } from '@/components/SelectOption';
import { OnboardingHeader } from '@/components/onboarding/OnboardingHeader';
import { GoalValue, OnboardingFormData } from '@/types/onboarding';

const OPTIONS: { label: string; value: GoalValue }[] = [
  { label: 'I want to use less', value: 'USE_LESS' },
  { label: 'I want to quit completely', value: 'QUIT' },
  { label: "I'm not sure yet", value: 'NOT_SURE' },
];

export default function GoalScreen() {
  const router = useRouter();
  const { control, trigger } = useFormContext<OnboardingFormData>();
  const { bottom } = useSafeAreaInsets();

  const handleNext = async () => {
    const valid = await trigger('goal');
    if (valid) router.push('/onboarding/questions/trigger');
  };

  return (
    <View className="flex-1 p-6" style={{ paddingBottom: bottom + 24 }}>
      <OnboardingHeader filled={3} length={6} />
      <View className="flex-1 gap-6 justify-center">
        <View className="gap-2">
          <ThemedText type="h2" className="text-center">What is your goal for this journey?</ThemedText>
          <ThemedText type="body" className="text-center">This helps us personalise your journey.</ThemedText>
        </View>
        <Controller
          control={control}
          name="goal"
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
