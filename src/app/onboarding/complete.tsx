import { isAxiosError } from 'axios';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { ScrollView, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';

import { CTAButton } from '@/components/cta';
import { Divider } from '@/components/Divider';
import { OnboardingImageLayout } from '@/components/onboarding/OnboardingImageLayout';
import { useCompleteProfile } from '@/api/onboarding';
import { useAuth } from '@/lib/auth-context';
import { OnboardingFormData } from '@/types/onboarding';

export default function CompleteScreen() {
  const router = useRouter();
  const { mutateAsync, isPending } = useCompleteProfile();
  const { getValues } = useFormContext<OnboardingFormData>();
  const { updateUser } = useAuth();
  const [formError, setFormError] = useState<string | null>(null);

  const handleStart = async () => {
    setFormError(null);
    try {
      const user = await mutateAsync(getValues());
      updateUser(user);
      router.replace('/tabs');
    } catch (err) {
      const message = isAxiosError(err) ? err.response?.data?.detail : undefined;
      setFormError(message ?? "We couldn't finish setting up your account. Please try again.");
    }
  };

  return (
    <OnboardingImageLayout
      image={require('@/assets/images/onboarding-all-set.png')}
      aspectRatio={402 / 364}
      gap="gap-6"
    >
      <Divider />
      <ScrollView className="flex-1">
        <View className="gap-3">
          <ThemedText type="h2" className="text-center">{"You're all set!"}</ThemedText>
          <ThemedText type="body" className="text-center">
            Your next chapter begins now. You've told us your story so far. Now it's time to start
            rewriting it at your own pace, on your own terms.
          </ThemedText>
        </View>
      </ScrollView>
      <Divider />
      <View className="gap-3">
        {formError && (
          <ThemedText type="body-sm" className="text-secondary-500 text-center">{formError}</ThemedText>
        )}
        <CTAButton label={isPending ? 'Setting up…' : 'Continue to freewrite'} disabled={isPending} onPress={handleStart} />
      </View>
    </OnboardingImageLayout>
  );
}
