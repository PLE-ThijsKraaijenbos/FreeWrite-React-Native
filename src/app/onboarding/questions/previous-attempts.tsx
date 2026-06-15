import { useRouter } from 'expo-router';
import { Controller, useFormContext } from 'react-hook-form';
import { ScrollView, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';

import { CTAButton } from '@/components/cta';
import { Divider } from '@/components/Divider';
import { OnboardingFormLayout } from '@/components/onboarding/OnboardingFormLayout';
import { SelectOption } from '@/components/SelectOption';
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
    <OnboardingFormLayout
      onBack={() => router.back()}
      progress={{ filled: 6, length: 6 }}
      gap="gap-6"
      footer={<CTAButton label="Continue" onPress={handleNext} />}
    >
      <View className="gap-2">
        <ThemedText type="h2" className="text-center">Have you tried to cut back or quit before?</ThemedText>
        <ThemedText type="body" className="text-center">This helps us personalise your journey.</ThemedText>
      </View>
      <Divider />
      <ScrollView
        className="flex-1"
        style={{ marginHorizontal: -8 }}
        contentContainerStyle={{ paddingHorizontal: 8, paddingTop: 8, paddingBottom: 16 }}
        persistentScrollbar
      >
        <Controller
          control={control}
          name="previousAttempts"
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
      </ScrollView>
      <Divider />
    </OnboardingFormLayout>
  );
}
