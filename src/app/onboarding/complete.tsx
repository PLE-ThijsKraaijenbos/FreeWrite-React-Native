import { isAxiosError } from 'axios';
import { useRouter } from 'expo-router';
import { useFormContext } from 'react-hook-form';
import { Alert, Text, View } from 'react-native';

import { CTAButton } from '@/components/cta';

import { useCompleteProfile } from '@/api/onboarding';
import { useAuth } from '@/lib/auth-context';
import { OnboardingFormData } from '@/types/onboarding';

export default function CompleteScreen() {
  const router = useRouter();
  const { mutateAsync, isPending } = useCompleteProfile();
  const { getValues } = useFormContext<OnboardingFormData>();
  const { updateUser } = useAuth();

  const handleStart = async () => {
    try {
      const user = await mutateAsync(getValues());
      updateUser(user);
      router.replace('/tabs');
    } catch (err) {
      const message = isAxiosError(err) ? err.response?.data?.detail : undefined;
      Alert.alert('Setup failed', message ?? 'Please try again.');
    }
  };

  return (
    <View className="flex-1 p-6">
      <View className="flex-1 gap-4 justify-center">
        <Text className="text-2xl font-bold">{"You're all set!"}</Text>
        <Text>
          Your next chapter begins now. You've told us your story so far. Now it's time to start
          rewriting it at your own pace, on your own terms.
        </Text>
      </View>
      <CTAButton label={isPending ? 'Setting up…' : 'Start my journey'} disabled={isPending} onPress={handleStart} />
    </View>
  );
}
