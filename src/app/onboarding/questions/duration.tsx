import { useRouter } from 'expo-router';
import { Controller, useFormContext } from 'react-hook-form';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CTAButton } from '@/components/cta';

import { SelectOption } from '@/components/SelectOption';
import { FormProgress } from '@/components/onboarding/FormProgress';
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
