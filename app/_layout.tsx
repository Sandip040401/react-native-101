import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // Determine the user's system color scheme (light or dark mode)
  const colorScheme = useColorScheme();

  // Load custom fonts
  const [fontsLoaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'), // Add more fonts here as needed
  });

  // Hide the splash screen once fonts and assets are loaded
  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  // Return null while fonts are still loading
  if (!fontsLoaded) {
    return null;
  }

  return (
    // Apply the appropriate theme based on the system's color scheme
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      {/* Stack navigation */}
      <Stack>
        {/* Main screen with tabs */}
        <Stack.Screen name="index" options={{ headerShown: false }} />
        {/* 404 Not Found screen */}
        <Stack.Screen name="+not-found" />
      </Stack>

      {/* Status bar styling */}
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
