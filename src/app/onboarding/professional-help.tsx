import { useRouter } from 'expo-router';
import { Linking, Pressable, Text, View } from 'react-native';

export default function ProfessionalHelpScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 p-6">
      <View className="flex-1 gap-4 justify-center">
        <Text className="text-2xl font-bold">Let's make sure you're supported.</Text>
        <Text>
          Thanks for being honest with us. Based on what you've shared, talking to a professional in
          person might be the best next step for you. A doctor or specialist can offer the kind of
          support an app can't. You're still welcome to use Freewrite, and your journey can still
          begin. We just want to make sure you have everything you need.
        </Text>
      </View>
      <View className="gap-3">
        <Pressable
          onPress={() => Linking.openURL('https://findahelpline.com/')}
          className="p-4 border items-center">
          <Text>Find help</Text>
        </Pressable>
        <Pressable
          onPress={() => router.push('/onboarding/avatar')}
          className="p-4 border items-center">
          <Text>Continue</Text>
        </Pressable>
      </View>
    </View>
  );
}
