import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { BackButton } from '@/components/onboarding/back-button';

const SLIDES = [
  {
    title: 'Your addiction wrote the last chapter. You write the next.',
    body: 'Freewrite uses the power of your own story to help you take back control. One chapter at a time.',
  },
  {
    title: 'Go on a journey. Meet yourself along the way.',
    body: "Guide your character through missions and mini-games built on real therapy techniques. Every step you take for them, you take for yourself.",
  },
  {
    title: "You're not alone. Others have been here too.",
    body: "Read stories from people who've walked this path. Share yours when you're ready. Find strength in a community that truly understands.",
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
    <>
      <Stack.Screen
        options={{
          headerLeft: () =>
            step > 0 ? <BackButton onPress={() => setStep(step - 1)} /> : null,
        }}
      />
      <View className="flex-1 p-6">
        <View className="flex-row gap-2 mb-8">
          {SLIDES.map((_, i) => (
            <Text key={i}>{i === step ? '●' : '○'}</Text>
          ))}
        </View>
        <View className="flex-1 gap-4">
          <Text className="text-2xl font-bold">{slide.title}</Text>
          <Text>{slide.body}</Text>
        </View>
        <Pressable onPress={handleNext} className="p-4 border items-center">
          <Text>{isLast ? "Let's go" : 'Next'}</Text>
        </Pressable>
      </View>
    </>
  );
}
