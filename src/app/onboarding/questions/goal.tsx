import { useRouter } from 'expo-router';
import { Controller, useFormContext } from 'react-hook-form';
import { View } from 'react-native';

import { ThemedText } from '@/components/themed-text';

import { CTAButton } from '@/components/cta';
import { DividerScrollArea } from '@/components/DividerScrollArea';
import { OnboardingFormLayout } from '@/components/onboarding/OnboardingFormLayout';
import { SelectOption } from '@/components/SelectOption';
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
    <OnboardingFormLayout
      onBack={() => router.back()}
      progress={{ filled: 3, length: 6 }}
      gap="gap-6"
      footer={<CTAButton label="Continue" onPress={handleNext} />}
    >
      <View className="gap-2">
        <ThemedText type="h2" className="text-center">What is your goal for this journey?</ThemedText>
        <ThemedText type="body" className="text-center">This helps us personalise your journey.</ThemedText>
      </View>
      <DividerScrollArea
        style={{ marginHorizontal: -8 }}
        contentContainerStyle={{ paddingHorizontal: 8, paddingTop: 8, paddingBottom: 16 }}
        persistentScrollbar
      >
        <Controller
          control={control}
          name="goal"
          render={({ field: { onChange, value } }) => (
            <View className="gap-4">
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
      </DividerScrollArea>
    </OnboardingFormLayout>
  );
}
