import { isAxiosError } from 'axios';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, Text, TextInput, View } from 'react-native';

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
        <View className="gap-2">
          <Text>Email</Text>
          <TextInput
            className="border p-3"
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />
        </View>
        <View className="gap-2">
          <Text>Password</Text>
          <TextInput
            className="border p-3"
            value={password}
            onChangeText={setPassword}
            placeholder="Your password"
            secureTextEntry
            autoComplete="current-password"
          />
        </View>
      </View>
      <Pressable onPress={() => router.back()} className="items-center p-4">
        <Text className="text-blue-500">Create account instead</Text>
      </Pressable>
      <Pressable
        onPress={handleLogin}
        disabled={isPending}
        className="p-4 border items-center disabled:opacity-50">
        <Text>{isPending ? 'Logging in…' : 'Log in'}</Text>
      </Pressable>
    </View>
  );
}
