import { isAxiosError } from 'axios';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { View } from 'react-native';

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
  const [formError, setFormError] = useState<string | null>(null);

  const switchMode = (next: 'register' | 'login') => {
    setMode(next);
    setFormError(null);
  };
  const {
    control,
    trigger,
    getValues,
  } = useFormContext<OnboardingFormData>();
  const { bottom } = useSafeAreaInsets();

  const handleNext = async () => {
    const valid = await trigger(['email', 'password']);
    if (!valid) return;
    setFormError(null);
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
      const fallback =
        mode === 'register'
          ? "We couldn't create your account. Please try again."
          : "We couldn't log you in. Please try again.";
      setFormError(message ?? fallback);
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
          onSelectRegister={() => switchMode('register')}
          onSelectLogin={() => switchMode('login')}
        />
        <View className="gap-2">
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
              <>
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
                {error && <ThemedText type="body-sm" className="text-secondary-500 pt-1">{error.message}</ThemedText>}
              </>
            )}
          />
        </View>
        <View className="gap-2">
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
              <>
                <TextInput
                  label="Password"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  placeholder={isRegister ? 'Min. 8 characters' : 'Your password'}
                  secureTextEntry
                  autoComplete={isRegister ? 'new-password' : 'current-password'}
                />
                {error && <ThemedText type="body-sm" className="text-secondary-500 pt-1">{error.message}</ThemedText>}
              </>
            )}
          />
        </View>
      </View>
      {formError && (
        <ThemedText type="body-sm" className="text-secondary-500 text-center pb-3">{formError}</ThemedText>
      )}
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
