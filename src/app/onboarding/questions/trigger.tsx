import { useRouter } from 'expo-router';
import { Controller, useFormContext } from 'react-hook-form';
import { View } from 'react-native';

import { ThemedText } from '@/components/themed-text';

import { CTAButton } from '@/components/cta';
import { DividerScrollArea } from '@/components/DividerScrollArea';
import { OnboardingFormLayout } from '@/components/onboarding/OnboardingFormLayout';
import { SelectOption } from '@/components/SelectOption';
import { OnboardingFormData, TriggerValue } from '@/types/onboarding';

const OPTIONS: { label: string; subtitle: string; value: TriggerValue }[] = [
  { label: "When I'm at a party", subtitle: 'Social settings, festivals, or nightlife', value: 'AT_A_PARTY' },
  { label: "When I'm bored", subtitle: 'To escape routine or restlessness', value: 'WHEN_BORED' },
  { label: "When I'm stressed or anxious", subtitle: 'To cope with pressure or overwhelm', value: 'WHEN_STRESSED' },
  { label: "When I'm feeling down", subtitle: 'To numb difficult emotions', value: 'WHEN_DOWN' },
];

export default function TriggerScreen() {
  const router = useRouter();
  const { control, trigger } = useFormContext<OnboardingFormData>();

  const handleNext = async () => {
    const valid = await trigger('trigger');
    if (valid) router.push('/onboarding/questions/frequency');
  };

  return (
    <OnboardingFormLayout
      onBack={() => router.back()}
      progress={{ filled: 4, length: 6 }}
      gap="gap-6"
      footer={<CTAButton label="Continue" onPress={handleNext} />}
    >
      <View className="gap-2">
        <ThemedText type="h2" className="text-center">When do you usually use?</ThemedText>
        <ThemedText type="body" className="text-center">This helps us personalise your journey.</ThemedText>
      </View>
      <DividerScrollArea
        style={{ marginHorizontal: -8 }}
        contentContainerStyle={{ paddingHorizontal: 8, paddingTop: 8, paddingBottom: 16 }}
        persistentScrollbar
      >
        <Controller
          control={control}
          name="trigger"
          render={({ field: { onChange, value } }) => (
            <View className="gap-4">
              {OPTIONS.map((opt) => (
                <SelectOption
                  key={opt.value}
                  label={opt.label}
                  subtitle={opt.subtitle}
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
