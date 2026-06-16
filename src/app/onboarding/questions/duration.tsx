import { useRouter } from 'expo-router';
import { Controller, useFormContext } from 'react-hook-form';
import { View } from 'react-native';

import { ThemedText } from '@/components/themed-text';

import { CTAButton } from '@/components/cta';
import { DividerScrollArea } from '@/components/DividerScrollArea';
import { OnboardingFormLayout } from '@/components/onboarding/OnboardingFormLayout';
import { SelectOption } from '@/components/SelectOption';
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

  const handleNext = async () => {
    const valid = await trigger('duration');
    if (valid) router.push('/onboarding/questions/goal');
  };

  return (
    <OnboardingFormLayout
      onBack={() => router.back()}
      progress={{ filled: 2, length: 6 }}
      gap="gap-6"
      footer={<CTAButton label="Continue" onPress={handleNext} />}
    >
      <View className="gap-2">
        <ThemedText type="h2" className="text-center">When did it start to feel like a problem?</ThemedText>
        <ThemedText type="body" className="text-center">This helps us personalise your journey.</ThemedText>
      </View>
      <DividerScrollArea
        style={{ marginHorizontal: -8 }}
        contentContainerStyle={{ paddingHorizontal: 8, paddingTop: 8, paddingBottom: 16 }}
        persistentScrollbar
      >
        <Controller
          control={control}
          name="duration"
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
