import { isAxiosError } from 'axios';
import { useRouter } from 'expo-router';
import { useFormContext } from 'react-hook-form';
import { Alert, Pressable, Text, View } from 'react-native';

import { useCompleteProfile } from '@/api/onboarding';
import { OnboardingFormData } from '@/types/onboarding';

export default function CompleteScreen() {
  const router = useRouter();
  const { mutateAsync, isPending } = useCompleteProfile();
  const { getValues } = useFormContext<OnboardingFormData>();

  const handleStart = async () => {
    try {
      await mutateAsync(getValues());
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
      <Pressable
        onPress={handleStart}
        disabled={isPending}
        className="p-4 border items-center disabled:opacity-50">
        <Text>{isPending ? 'Setting up…' : 'Start my journey'}</Text>
      </Pressable>
    </View>
  );
}
