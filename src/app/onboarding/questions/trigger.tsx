import { useRouter } from 'expo-router';
import { Controller, useFormContext } from 'react-hook-form';
import { Text, View } from 'react-native';

import { CTAButton } from '@/components/cta';

import { OptionButton } from '@/components/onboarding/option-button';
import { FormProgress } from '@/components/onboarding/FormProgress';
import { OnboardingFormData, TriggerValue } from '@/types/onboarding';

const OPTIONS: { label: string; value: TriggerValue }[] = [
  { label: "When I'm at a party", value: 'AT_A_PARTY' },
  { label: "When I'm bored", value: 'WHEN_BORED' },
  { label: "When I'm stressed or anxious", value: 'WHEN_STRESSED' },
  { label: "When I'm feeling down", value: 'WHEN_DOWN' },
];

export default function TriggerScreen() {
  const router = useRouter();
  const { control, trigger } = useFormContext<OnboardingFormData>();

  const handleNext = async () => {
    const valid = await trigger('trigger');
    if (valid) router.push('/onboarding/questions/frequency');
  };

  return (
    <View className="flex-1 p-6">
      <FormProgress filled={4} length={6} />
      <View className="flex-1 gap-6 justify-center">
        <Text className="text-2xl font-bold">When do you usually use?</Text>
        <Controller
          control={control}
          name="trigger"
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
      <CTAButton label="Next" onPress={handleNext} />
    </View>
  );
}
