import { Slot } from "expo-router";
import { ThirdwebProvider } from "@thirdweb-dev/react-native";
import { Sepolia } from "@thirdweb-dev/chains";

export default function RootLayout() {
  return (
    <ThirdwebProvider 
      activeChain={Sepolia}
      clientId="e2ee66d4-5a08-4349-86ab-5b6d9e71baf0"   // ✔ correct place
    >
      <Slot />
    </ThirdwebProvider>
  );
}
