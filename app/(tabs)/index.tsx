import { StyleSheet, Text, View, Image } from 'react-native'; 

// FIX 1: Import ConnectWallet from the v4 package
import { ConnectWallet } from "@thirdweb-dev/react";

// FIX 2: Use the correct path to the logo
const GeoLogo = require("../../assets/twinnir_logo.png");
 
export default function HomeScreen() {
  return (   
    <View style={styles.container}>
      <Image 
        source={GeoLogo} 
        style={styles.logo} 
        resizeMode="contain" 
      />
      <Text style={styles.title}>Welcome to GeoTokenApp!</Text>
      <Text style={styles.subtitle}>Connect your wallet to begin collecting GeoTokens.</Text>
      
      {/* FIX 3: Use the v4 ConnectWallet component. 
          It automatically uses the provider's context. No 'client' prop needed! */}
      <ConnectWallet 
        theme="dark"
        modalTitle="Connect to GeoTokenApp"
        btnTitle="Connect Wallet"

      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: '#1E1E1E',
    padding: 20,
  },
  logo: {
    width: 150, 
    height: 150,
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#00D1FF',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#CCCCCC',
    marginBottom: 40,
    textAlign: 'center',
  },
});