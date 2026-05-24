import { useRouter } from 'expo-router';
import { Controller, useFormContext } from 'react-hook-form';
import { Pressable, Text, View } from 'react-native';

import { OptionButton } from '@/components/onboarding/option-button';
import { ProgressBar } from '@/components/onboarding/progress-bar';
import { isProfessionalHelpRecommended } from '@/lib/recommend-professional-help';
import { OnboardingFormData, PreviousAttemptsValue } from '@/types/onboarding';

const OPTIONS: { label: string; value: PreviousAttemptsValue }[] = [
  { label: 'Yes, and it went better than I expected.', value: 'WENT_WELL' },
  { label: 'Yes, once. But it was hard to keep up', value: 'ONCE_HARD' },
  { label: 'Yes, multiple times. But I keep falling back.', value: 'MULTIPLE_RELAPSED' },
  { label: "I've thought about it but haven't tried yet", value: 'THOUGHT_ABOUT_IT' },
  { label: 'No, this is the first time', value: 'NEVER' },
];

export default function PreviousAttemptsScreen() {
  const router = useRouter();
  const { control, trigger, getValues } = useFormContext<OnboardingFormData>();

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
    <View className="flex-1 p-6">
      <ProgressBar current={6} total={6} />
      <View className="flex-1 gap-6 justify-center">
        <Text className="text-2xl font-bold">Have you tried to cut back or quit before?</Text>
        <Controller
          control={control}
          name="previousAttempts"
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
