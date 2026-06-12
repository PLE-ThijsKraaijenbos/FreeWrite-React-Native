import { useRouter } from 'expo-router';
import { Controller, useFormContext } from 'react-hook-form';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CTAButton } from '@/components/cta';

import { SelectOption } from '@/components/SelectOption';
import { FormProgress } from '@/components/onboarding/FormProgress';
import { isProfessionalHelpRecommended } from '@/lib/recommend-professional-help';
import { OnboardingFormData, PreviousAttemptsValue } from '@/types/onboarding';

const OPTIONS: { label: string; subtitle: string; value: PreviousAttemptsValue }[] = [
  { label: 'Yes, and it went well', subtitle: "It went better than I would've expected", value: 'WENT_WELL' },
  { label: 'Yes, once. But it was difficult', subtitle: 'It was hard to keep up', value: 'ONCE_HARD' },
  { label: 'Yes, multiple times', subtitle: 'I unfortunately keep falling back', value: 'MULTIPLE_RELAPSED' },
  { label: "I've thought about it", subtitle: "Thought about it, but haven't tried yet", value: 'THOUGHT_ABOUT_IT' },
  { label: 'No, this is my first time', subtitle: "I'm just getting started.", value: 'NEVER' },
];

export default function PreviousAttemptsScreen() {
  const router = useRouter();
  const { control, trigger, getValues } = useFormContext<OnboardingFormData>();
  const { bottom } = useSafeAreaInsets();

  const handleNext = async () => {
    const valid = await trigger('previousAttempts');
    if (!valid) return;
    const { frequency, duration, previousAttempts } = getValues();
    if (isProfessionalHelpRecommended({ frequency, duration, previousAttempts })) {
      router.push('/onboarding/professional-help');
    } else {
      router.push('/onboarding/avatar');
    }
  };

  return (
    <View className="flex-1 p-6" style={{ paddingBottom: bottom + 24 }}>
      <FormProgress filled={6} length={6} />
      <View className="flex-1 gap-6 justify-center">
        <Text className="text-2xl font-bold">Have you tried to cut back or quit before?</Text>
        <Controller
          control={control}
          name="previousAttempts"
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
