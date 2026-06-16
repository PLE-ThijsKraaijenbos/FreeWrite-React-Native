import { useRouter } from 'expo-router';
import { Controller, useFormContext } from 'react-hook-form';
import { View } from 'react-native';

import { ThemedText } from '@/components/themed-text';

import { CTAButton } from '@/components/cta';
import { DividerScrollArea } from '@/components/DividerScrollArea';
import { OnboardingFormLayout } from '@/components/onboarding/OnboardingFormLayout';
import { SelectOption } from '@/components/SelectOption';
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
    <OnboardingFormLayout
      onBack={() => router.back()}
      progress={{ filled: 5, length: 6 }}
      gap="gap-6"
      footer={<CTAButton label="Continue" onPress={handleNext} />}
    >
      <View className="gap-2">
        <ThemedText type="h2" className="text-center">How often do you use?</ThemedText>
        <ThemedText type="body" className="text-center">This helps us personalise your journey.</ThemedText>
      </View>
      <DividerScrollArea
        style={{ marginHorizontal: -8 }}
        contentContainerStyle={{ paddingHorizontal: 8, paddingTop: 8, paddingBottom: 16 }}
        persistentScrollbar
      >
        <Controller
          control={control}
          name="frequency"
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
