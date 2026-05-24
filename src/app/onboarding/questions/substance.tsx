import { useRouter } from 'expo-router';
import { Controller, useFormContext } from 'react-hook-form';
import { Pressable, Text, View } from 'react-native';

import { OptionButton } from '@/components/onboarding/option-button';
import { ProgressBar } from '@/components/onboarding/progress-bar';
import { OnboardingFormData, SubstanceValue } from '@/types/onboarding';

const OPTIONS: { label: string; value: SubstanceValue }[] = [
  { label: 'Cocaine', value: 'COCAINE' },
  { label: '3MMC / 4MMC', value: 'CATHINONES' },
  { label: 'Amphetamine / Speed', value: 'AMPHETAMINE' },
  { label: 'MDMA / Ecstacy', value: 'MDMA' },
];

export default function SubstanceScreen() {
  const router = useRouter();
  const { control, trigger } = useFormContext<OnboardingFormData>();

  const handleNext = async () => {
    const valid = await trigger('substance');
    if (valid) router.push('/onboarding/questions/duration');
  };

  return (
    <View className="flex-1 p-6">
      <ProgressBar current={1} total={6} />
      <View className="flex-1 gap-6 justify-center">
        <View className="gap-2">
          <Text className="text-2xl font-bold">What are you struggling with?</Text>
          <Text>This helps us personalise your journey.</Text>
        </View>
        <Controller
          control={control}
          name="substance"
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
