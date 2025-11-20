import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { 
  useWallet,
  useConnect,
  useDisconnect,
  inAppWallet
} from "@thirdweb-dev/react-native";

import { useEffect, useState } from "react";

export default function HomeScreen() {
  const wallet = useWallet();
  const connect = useConnect();
  const disconnect = useDisconnect();

  const [address, setAddress] = useState<string | null>(null);

  // ✔ Correct wallet config (NO clientId here!)
  const inApp = inAppWallet();

  // Get address when wallet changes
  useEffect(() => {
    (async () => {
      if (wallet) {
        const addr = await wallet.getAddress();
        setAddress(addr);
      } else {
        setAddress(null);
      }
    })();
  }, [wallet]);

  const handleConnect = async () => {
    try {
      await connect(inApp);   // ✔ valid for your SDK version
    } catch (e) {
      console.log("Wallet connection error:", e);
    }
  };

  return (
    <View style={styles.container}>
      {!wallet ? (
        <TouchableOpacity style={styles.button} onPress={handleConnect}>
          <Text style={styles.buttonText}>Connect Wallet</Text>
        </TouchableOpacity>
      ) : (
        <>
          <Text style={styles.connectedText}>
            Connected: {address?.slice(0, 6)}...
          </Text>

          <TouchableOpacity 
            style={styles.disconnectButton} 
            onPress={disconnect}
          >
            <Text style={styles.disconnectText}>Disconnect</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  button: {
    backgroundColor: "#2e78b7",
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  connectedText: {
    color: "white",
    fontSize: 16,
    marginBottom: 20,
  },
  disconnectButton: {
    backgroundColor: "#B00020",
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 10,
  },
  disconnectText: {
    color: "white",
    fontWeight: "bold",
  },
});
