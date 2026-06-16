import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { ThemedText } from '@/components/themed-text';

import { CTAButton } from '@/components/cta';
import { FormProgress } from '@/components/onboarding/FormProgress';
import { OnboardingImageLayout } from '@/components/onboarding/OnboardingImageLayout';

const SLIDES = [
  {
    title: 'Your addiction wrote the last chapter. You write the next.',
    body: 'Freewrite uses the power of your own story to help you take back control. One chapter at a time.',
    image: require('@/assets/images/onboarding-intro-1.png'),
  },
  {
    title: 'Go on a journey. Meet yourself along the way.',
    body: "Guide yourself through missions built on narrative therapy techniques. Earn coins with every step you take, and use them to customise your character.",
    image: require('@/assets/images/onboarding-intro-2.png'),
  },
  {
    title: "You're not alone. Others have been here too.",
    body: "Read stories from people who've walked this path. Share yours when you're ready. Find strength in a community that truly understands.",
    image: require('@/assets/images/onboarding-intro-3.png'),
  },
];

export default function IntroScreen() {
  const router = useRouter();
  const [step, setStep] = useState(0);
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
    <OnboardingImageLayout
      image={slide.image}
      aspectRatio={402 / 437}
      heightRatio={0.35}
      onBack={step > 0 ? () => setStep(step - 1) : undefined}
      gap="gap-6"
      footer={<CTAButton label="Continue" onPress={handleNext} />}
    >
      <View className="px-16">
        <FormProgress filled={step + 1} length={SLIDES.length} />
      </View>
      <View className="gap-3">
        <ThemedText type="h2" className="text-center">{slide.title}</ThemedText>
        <ThemedText type="body" className="text-center">{slide.body}</ThemedText>
      </View>
    </OnboardingImageLayout>
  );
}
