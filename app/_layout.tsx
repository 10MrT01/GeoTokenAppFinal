import { Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';

// FIX 1: Import the v4 provider from the CORRECT package: @thirdweb-dev/react-native
import { ThirdwebProvider } from '@thirdweb-dev/react'; 

// FIX 2: Import the chain object (Sepolia)
import { Sepolia } from '@thirdweb-dev/chains'; 

import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    // FIX 3: Use the v4 Provider with the correct prop: activeChain
    <ThirdwebProvider
        activeChain={Sepolia} 
    >
      <View style={styles.container}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
          <Stack.Screen name="+not-found" /> 
        </Stack>
      </View>
    </ThirdwebProvider>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1E1E1E', 
    },
});