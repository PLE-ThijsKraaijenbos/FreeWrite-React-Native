import { useRouter } from 'expo-router';
import { Controller, useFormContext } from 'react-hook-form';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CTAButton } from '@/components/cta';

import { SelectOption } from '@/components/SelectOption';
import { FormProgress } from '@/components/onboarding/FormProgress';
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
  const { bottom } = useSafeAreaInsets();

  const handleNext = async () => {
    const valid = await trigger('trigger');
    if (valid) router.push('/onboarding/questions/frequency');
  };

  return (
    <View className="flex-1 p-6" style={{ paddingBottom: bottom + 24 }}>
      <FormProgress filled={4} length={6} />
      <View className="flex-1 gap-6 justify-center">
        <Text className="text-2xl font-bold">When do you usually use?</Text>
        <Controller
          control={control}
          name="trigger"
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
