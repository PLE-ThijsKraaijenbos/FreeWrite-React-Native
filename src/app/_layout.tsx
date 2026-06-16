import '@/global.css';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import {
  Unbounded_500Medium,
  Unbounded_700Bold,
} from '@expo-google-fonts/unbounded';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { AuthProvider } from '@/lib/auth-context';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Unbounded_500Medium,
    Unbounded_700Bold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_700Bold,
  });

  React.useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider value={DefaultTheme}>
          <AuthProvider>
            <StatusBar style="dark" />
            <AnimatedSplashOverlay />
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="add-post" options={{ presentation: 'modal' }} />
              <Stack.Screen name="edit-post" options={{ presentation: 'modal' }} />
              <Stack.Screen name="unlock-item" options={{ presentation: 'modal' }} />
              <Stack.Screen name="journey/assignment" options={{ presentation: 'modal' }} />
              <Stack.Screen name="journey/[progressId]" options={{ presentation: 'modal' }} />
              <Stack.Screen
                name="journey/complete"
                options={{ presentation: 'modal', gestureEnabled: false }}
              />
              <Stack.Screen name="community/[id]" options={{ presentation: 'modal' }} />
            </Stack>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
