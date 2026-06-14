import { useRouter } from 'expo-router';
import { Controller, useFormContext } from 'react-hook-form';
import { View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CTAButton } from '@/components/cta';

import { SelectOption } from '@/components/SelectOption';
import { OnboardingHeader } from '@/components/onboarding/OnboardingHeader';
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
  const { bottom } = useSafeAreaInsets();

  const handleNext = async () => {
    const valid = await trigger('frequency');
    if (valid) router.push('/onboarding/questions/previous-attempts');
  };

  return (
    <View className="flex-1 p-6" style={{ paddingBottom: bottom + 24 }}>
      <OnboardingHeader filled={5} length={6} />
      <View className="flex-1 gap-6 justify-center">
        <View className="gap-2">
          <ThemedText type="h2" className="text-center">How often do you use?</ThemedText>
          <ThemedText type="body" className="text-center">This helps us personalise your journey.</ThemedText>
        </View>
        <Controller
          control={control}
          name="frequency"
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
