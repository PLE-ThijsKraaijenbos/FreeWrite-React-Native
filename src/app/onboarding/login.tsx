import { isAxiosError } from 'axios';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';

import { CTAButton } from '@/components/cta';
import { TextInput } from '@/components/TextInput';
import { useAuth } from '@/lib/auth-context';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPending, setIsPending] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) return;
    setIsPending(true);
    try {
      await login(email, password);
      router.replace('/tabs');
    } catch (err) {
      const message =
        isAxiosError(err) && err.response?.status === 401
          ? 'Incorrect email or password.'
          : 'Something went wrong. Please try again.';
      Alert.alert('Login failed', message);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <View className="flex-1 p-6">
      <View className="flex-1 gap-6 justify-center">
        <Text className="text-2xl font-bold">Welcome back</Text>
        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
        />
        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="Your password"
          secureTextEntry
          autoComplete="current-password"
        />
      </View>
      <Pressable onPress={() => router.back()} className="items-center p-4">
        <Text className="text-blue-500">Create account instead</Text>
      </Pressable>
      <CTAButton label={isPending ? 'Logging in…' : 'Log in'} disabled={isPending} onPress={handleLogin} />
    </View>
  );
}
