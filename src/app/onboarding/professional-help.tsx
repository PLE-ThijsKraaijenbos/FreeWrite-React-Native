import { useRouter } from 'expo-router';
import { Linking, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CTAButton } from '@/components/cta';

export default function ProfessionalHelpScreen() {
  const router = useRouter();
  const { bottom } = useSafeAreaInsets();

  return (
    <View className="flex-1 p-6" style={{ paddingBottom: bottom + 24 }}>
      <View className="flex-1 gap-4 justify-center">
        <ThemedText type="h2" className="text-center">Let's make sure you're supported.</ThemedText>
        <ThemedText type="body" className="text-center">
          Thanks for being honest with us. Based on what you've shared, talking to a professional in
          person might be the best next step for you. A doctor or specialist can offer the kind of
          support an app can't. You're still welcome to use Freewrite, and your journey can still
          begin. We just want to make sure you have everything you need.
        </ThemedText>
      </View>
      <View className="gap-3">
        <CTAButton label="Find help" variant="secondary" onPress={() => Linking.openURL('https://findahelpline.com/')} />
        <CTAButton label="Continue" onPress={() => router.push('/onboarding/avatar')} />
      </View>
    </View>
  );
}
