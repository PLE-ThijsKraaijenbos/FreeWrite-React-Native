import { isAxiosError } from 'axios';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Alert, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AuthSelection } from '@/components/onboarding/AuthSelection';
import { CTAButton } from '@/components/cta';
import { TextInput } from '@/components/TextInput';
import { useAuth } from '@/lib/auth-context';
import { OnboardingFormData } from '@/types/onboarding';

export default function AccountScreen() {
  const router = useRouter();
  const { register, login } = useAuth();
  const [mode, setMode] = useState<'register' | 'login'>('register');
  const [isPending, setIsPending] = useState(false);
  const {
    control,
    trigger,
    getValues,
    formState: { errors },
  } = useFormContext<OnboardingFormData>();
  const { bottom } = useSafeAreaInsets();

  const handleNext = async () => {
    const valid = await trigger(['email', 'password']);
    if (!valid) return;
    setIsPending(true);
    try {
      const { email, password } = getValues();
      if (mode === 'register') {
        await register(email, password);
      } else {
        await login(email, password);
        router.replace('/tabs');
        return;
      }
      router.push('/onboarding/questions/substance');
    } catch (err) {
      const message = isAxiosError(err) ? err.response?.data?.detail : undefined;
      const errorType = mode === 'register' ? 'Registration failed' : 'Login failed';
      Alert.alert(errorType, message ?? 'Please try again.');
    } finally {
      setIsPending(false);
    }
  };

  const isRegister = mode === 'register';

  return (
    <View className="flex-1 p-6" style={{ paddingBottom: bottom + 24 }}>
      <View className="flex-1 gap-6 justify-center">
        <View className="gap-2">
          <ThemedText type="h2" className="text-center">Welcome</ThemedText>
          <ThemedText type="body" className="text-center">
            Whenever you're ready create an account to begin, or log in to continue your journey.
          </ThemedText>
        </View>
        <AuthSelection
          selected={mode}
          onSelectRegister={() => setMode('register')}
          onSelectLogin={() => setMode('login')}
        />
        <View className="gap-2">
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Email"
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
          {errors.email && <ThemedText type="body-sm" className="text-red-500">{errors.email.message}</ThemedText>}
        </View>
        <View className="gap-2">
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Password"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder={isRegister ? 'Min. 8 characters' : 'Your password'}
                secureTextEntry
                autoComplete={isRegister ? 'new-password' : 'current-password'}
              />
            )}
          />
          {errors.password && <ThemedText type="body-sm" className="text-red-500">{errors.password.message}</ThemedText>}
        </View>
      </View>
      <CTAButton
        label={
          isPending
            ? isRegister
              ? 'Creating account…'
              : 'Logging in…'
            : isRegister
              ? 'Continue'
              : 'Log in'
        }
        disabled={isPending}
        onPress={handleNext}
      />
    </View>
  );
}
