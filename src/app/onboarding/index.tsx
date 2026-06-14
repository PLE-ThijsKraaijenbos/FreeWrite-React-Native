import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CTAButton } from '@/components/cta';

import { BackButton } from '@/components/BackButton';
import { FormProgress } from '@/components/onboarding/FormProgress';

const SLIDES = [
  {
    title: 'Your addiction wrote the last chapter. You write the next.',
    body: 'Freewrite uses the power of your own story to help you take back control. One chapter at a time.',
  },
  {
    title: 'Go on a journey. Meet yourself along the way.',
    body: "Guide yourself through missions built on narrative therapy techniques. Earn coins with every step you take, and use them to customise your character.",
  },
  {
    title: "You're not alone. Others have been here too.",
    body: "Read stories from people who've walked this path. Share yours when you're ready. Find strength in a community that truly understands.",
  },
];

export default function IntroScreen() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const { bottom } = useSafeAreaInsets();
  const slide = SLIDES[step];
  const isLast = step === SLIDES.length - 1;

  const handleNext = () => {
    if (isLast) {
      router.push('/onboarding/account');
    } else {
      setStep(step + 1);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerLeft: () =>
            step > 0 ? (
              <BackButton variant="onboarding" onPress={() => setStep(step - 1)} />
            ) : null,
        }}
      />
      <View className="flex-1 p-6" style={{ paddingBottom: bottom + 24 }}>
        <View className="px-16">
          <FormProgress filled={step + 1} length={SLIDES.length} />
        </View>
        <View className="flex-1 gap-4 justify-center">
          <ThemedText type="h2" className="text-center">{slide.title}</ThemedText>
          <ThemedText type="body" className="text-center">{slide.body}</ThemedText>
        </View>
        <CTAButton label={isLast ? "Let's go" : 'Next'} onPress={handleNext} />
      </View>
    </>
  );
}
