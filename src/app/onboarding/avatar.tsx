import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

export default function AvatarScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 p-6">
      <View className="flex-1 gap-4 justify-center">
        <Text className="text-2xl font-bold">Create your character</Text>
        <Text>
          Avatar customisation is coming soon. You will be able to unlock items and build your
          character in the item shop.
        </Text>
      </View>
      <Pressable
        onPress={() => router.push('/onboarding/complete')}
        className="p-4 border items-center">
        <Text>Skip for now</Text>
      </Pressable>
    </View>
  );
}
