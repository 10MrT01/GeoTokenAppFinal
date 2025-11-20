import { Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { ThirdwebProvider } from '@thirdweb-dev/react';
import { Sepolia } from '@thirdweb-dev/chains';

export default function RootLayout() {
  return (
    <ThirdwebProvider activeChain={Sepolia}>
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
