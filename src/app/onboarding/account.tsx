import { isAxiosError } from 'axios';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Alert, Pressable, Text, TextInput, View } from 'react-native';

import { useAuth } from '@/lib/auth-context';
import { OnboardingFormData } from '@/types/onboarding';
import { CTAButton } from '@/components/cta';

export default function AccountScreen() {
  const router = useRouter();
  const { register } = useAuth();
  const [isPending, setIsPending] = useState(false);
  const {
    control,
    trigger,
    getValues,
    formState: { errors },
  } = useFormContext<OnboardingFormData>();

  const handleNext = async () => {
    const valid = await trigger(['email', 'password']);
    if (!valid) return;
    setIsPending(true);
    try {
      const { email, password } = getValues();
      await register(email, password);
      router.push('/onboarding/questions/substance');
    } catch (err) {
      const message = isAxiosError(err) ? err.response?.data?.detail : undefined;
      Alert.alert('Registration failed', message ?? 'Please try again.');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <View className="flex-1 p-6">
      <View className="flex-1 gap-6 justify-center">
        <Text className="text-2xl font-bold">Create your account</Text>
        <View className="gap-2">
          <Text>Email</Text>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className="border p-3"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="you@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            )}
          />
          {errors.email && <Text className="text-red-500">{errors.email.message}</Text>}
        </View>
        <View className="gap-2">
          <Text>Password</Text>
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className="border p-3"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="Min. 8 characters"
                secureTextEntry
                autoComplete="new-password"
              />
            )}
          />
          {errors.password && <Text className="text-red-500">{errors.password.message}</Text>}
        </View>
      </View>
      <Pressable onPress={() => router.push('/onboarding/login')} className="items-center p-4">
        <Text className="text-blue-500">Log in instead</Text>
      </Pressable>
      <CTAButton label={isPending ? 'Creating account…' : 'Continue'} disabled={isPending} onPress={handleNext} />
    </View>
  );
}
