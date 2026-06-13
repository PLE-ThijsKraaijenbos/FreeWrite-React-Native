import { zodResolver } from '@hookform/resolvers/zod';
import { Stack, useRouter } from 'expo-router';
import { FormProvider, useForm } from 'react-hook-form';

import { BackButton } from '@/components/BackButton';
import { onboardingSchema, type OnboardingFormData } from '@/types/onboarding';

export default function OnboardingLayout() {
  const router = useRouter();
  const form = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
    mode: 'onTouched',
    defaultValues: {
      email: '',
      password: '',
      name: '',
    },
  });

  return (
    <FormProvider {...form}>
      <Stack
        screenOptions={{
          headerShown: true,
          headerTitle: () => null,
          headerShadowVisible: false,
          headerStyle: { backgroundColor: 'white' },
          headerLeft: ({ canGoBack }) =>
            canGoBack ? (
              <BackButton variant="onboarding" onPress={() => router.back()} />
            ) : null,
          contentStyle: { backgroundColor: 'white' },
        }}
      />
    </FormProvider>
  );
}
