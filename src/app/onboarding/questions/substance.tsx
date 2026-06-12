import { useRouter } from 'expo-router';
import { Controller, useFormContext } from 'react-hook-form';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CTAButton } from '@/components/cta';

import { SelectOption } from '@/components/SelectOption';
import { FormProgress } from '@/components/onboarding/FormProgress';
import { OnboardingFormData, SubstanceValue } from '@/types/onboarding';

const OPTIONS: { label: string; subtitle: string; value: SubstanceValue }[] = [
  { label: 'Cocaine', subtitle: 'Lines, bumps, or powder', value: 'COCAINE' },
  { label: '3MMC / 4MMC', subtitle: 'Meow, miauw, or other cathinone compounds', value: 'CATHINONES' },
  { label: 'Amphetamine / Speed', subtitle: 'Speed, whizz, or prescription amphetamines', value: 'AMPHETAMINE' },
  { label: 'MDMA / Ecstacy', subtitle: 'Pills, powder, or crystals', value: 'MDMA' },
];

export default function SubstanceScreen() {
  const router = useRouter();
  const { control, trigger } = useFormContext<OnboardingFormData>();
  const { bottom } = useSafeAreaInsets();

  const handleNext = async () => {
    const valid = await trigger('substance');
    if (valid) router.push('/onboarding/questions/duration');
  };

  return (
    <View className="flex-1 p-6" style={{ paddingBottom: bottom + 24 }}>
      <FormProgress filled={1} length={6} />
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
      </View>
      <CTAButton label="Continue" onPress={handleNext} />
    </View>
  );
}
