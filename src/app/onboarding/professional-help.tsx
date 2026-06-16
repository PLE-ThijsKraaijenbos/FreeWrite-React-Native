import { useRouter } from 'expo-router';
import { Linking, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';

import { CTAButton } from '@/components/cta';
import { DividerScrollArea } from '@/components/DividerScrollArea';
import { OnboardingImageLayout } from '@/components/onboarding/OnboardingImageLayout';

export default function ProfessionalHelpScreen() {
  const router = useRouter();

  return (
    <OnboardingImageLayout
      image={require('@/assets/images/onboarding-professional-help.png')}
      aspectRatio={402 / 260}
      onBack={() => router.back()}
      gap="gap-6"
    >
      <DividerScrollArea>
        <View className="gap-3">
          <ThemedText type="h2" className="text-center">Let's make sure you're supported.</ThemedText>
          <ThemedText type="body" className="text-center">
            Thanks for being honest with us. Based on what you've shared, talking to a professional in
            person might be the best next step for you. A doctor or specialist can offer the kind of
            support an app can't. You're still welcome to use Freewrite, and your journey can still
            begin. We just want to make sure you have everything you need.
          </ThemedText>
        </View>
      </DividerScrollArea>
      <View className="gap-4">
        <CTAButton label="Find help" variant="secondary" onPress={() => Linking.openURL('https://findahelpline.com/')} />
        <CTAButton label="Continue" onPress={() => router.push('/onboarding/avatar')} />
      </View>
    </OnboardingImageLayout>
  );
}
