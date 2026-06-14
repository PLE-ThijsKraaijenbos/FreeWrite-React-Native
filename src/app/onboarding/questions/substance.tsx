import { useRouter } from 'expo-router';
import { Controller, useFormContext } from 'react-hook-form';
import { View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CTAButton } from '@/components/cta';

import { SelectOption } from '@/components/SelectOption';
import { OnboardingHeader } from '@/components/onboarding/OnboardingHeader';
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
      <OnboardingHeader filled={1} length={6} />
      <View className="flex-1 gap-6 justify-center">
        <View className="gap-2">
          <ThemedText type="h2" className="text-center">What are you struggling with?</ThemedText>
          <ThemedText type="body" className="text-center">This helps us personalise your journey.</ThemedText>
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
