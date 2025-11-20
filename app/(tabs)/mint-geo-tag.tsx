import React, { useState } from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  Pressable, 
  Image, 
  ActivityIndicator, 
  Alert 
} from "react-native";

import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";

import {
  useAddress,
  useContract,
  useStorage,
  Web3Button
} from "@thirdweb-dev/react-native";

import { GEONFT_CONTRACT_ADDRESS } from "../../constants/contracts";

export default function MintGeoTagScreen() {
  const address = useAddress();
  const { contract } = useContract(GEONFT_CONTRACT_ADDRESS);
  const storage = useStorage();

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<any | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [statusText, setStatusText] = useState("Select an image to mint your Geo-Tag.");

  // ---------------------------
  // 1. PICK IMAGE
  // ---------------------------
  const pickImage = async () => {
    if (!address) {
      Alert.alert("Wallet Required", "Please connect your wallet first.");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      const fileUri = result.assets[0].uri;
      setImageUri(fileUri);
      setStatusText("Image selected!");

      // Simulated GPS (replace with real EXIF reader later)
      setMetadata({
        name: "GeoTag NFT",
        description: `Minted by ${address.substring(0, 6)}...`,
        attributes: [
          { trait_type: "Date Minted", value: new Date().toISOString() },
          { trait_type: "Latitude", value: "40.7128" },
          { trait_type: "Longitude", value: "-74.0060" },
        ],
      });
    }
  };

  // ---------------------------
  // 2. UPLOAD TO IPFS
  // ---------------------------
  const uploadToIPFS = async () => {
    if (!storage || !imageUri) return;

    setIsUploading(true);
    setStatusText("Uploading to IPFS...");

    // Read image → base64
    const base64 = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const fileData = `data:image/jpeg;base64,${base64}`;

    // Upload image
    const imageIpfsUri = await storage.upload({ data: fileData, name: "geotag-image.jpg" });

    // Build final metadata
    const finalMetadata = {
      ...metadata,
      image: imageIpfsUri,
      properties: {
        minter: address,
      },
    };

    // Upload metadata JSON file
    const metadataIpfsUri = await storage.upload({ 
      data: finalMetadata, 
      name: "metadata.json" 
    });

    setIsUploading(false);
    setStatusText("Upload complete!");
    return metadataIpfsUri;
  };

  // ---------------------------
  // 3. LAZY MINT NFT
  // ---------------------------
  const mintNFT = async () => {
  if (!contract) throw new Error("Contract not ready");
  if (!address) throw new Error("Wallet not connected");

  const uri = await uploadToIPFS();
  if (!uri) throw new Error("IPFS upload failed");

  return contract.erc1155.mintTo(address, {
    metadata: {
      uri,
    },
    supply: 1,
  });
};


  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.inner}>
      <Text style={styles.title}>Mint a Geo-Tag NFT</Text>

      <Pressable style={styles.imageButton} onPress={pickImage}>
        <Text style={styles.imageButtonText}>
          {imageUri ? "Change Image" : "Select Image"}
        </Text>
      </Pressable>

      {imageUri && (
        <View style={styles.previewBox}>
          <Image source={{ uri: imageUri }} style={styles.imagePreview} />
          <Text style={styles.status}>{statusText}</Text>

          {metadata && (
            <View style={styles.metaBox}>
              <Text style={styles.metaTitle}>Metadata Preview</Text>
              {metadata.attributes.map((a: any, i: number) => (
                <Text key={i} style={styles.metaText}>
                  {a.trait_type}: {a.value}
                </Text>
              ))}
            </View>
          )}
        </View>
      )}

      <View style={styles.mintBox}>
        {address && imageUri ? (
          <Web3Button
            contractAddress={GEONFT_CONTRACT_ADDRESS}
            action={mintNFT}
            onSuccess={() => {
              Alert.alert("Success", "Your Geo-Tag NFT was minted!");
              setImageUri(null);
              setMetadata(null);
              setStatusText("Select an image to mint your Geo-Tag.");
            }}
            onError={(err) => Alert.alert("Mint Failed", err.message)}
            isDisabled={isUploading}
          >
            {isUploading ? <ActivityIndicator /> : "Mint Geo-Tag NFT"}
          </Web3Button>
        ) : (
          <Text style={styles.prompt}>Connect wallet + select image to mint</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: "#1E1E1E", flex: 1 },
  inner: { padding: 20, alignItems: "center" },
  title: { color: "#00D1FF", fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  imageButton: { backgroundColor: "#00D1FF", padding: 12, borderRadius: 10, width: "100%", alignItems: "center" },
  imageButtonText: { color: "#1E1E1E", fontWeight: "700" },
  previewBox: { width: "100%", marginTop: 20 },
  imagePreview: { width: "100%", height: 240, borderRadius: 10, borderColor: "#00D1FF", borderWidth: 1 },
  status: { color: "#ccc", marginTop: 10 },
  metaBox: { backgroundColor: "#333", padding: 10, marginTop: 10, borderRadius: 10 },
  metaTitle: { color: "#FFD700", fontWeight: "bold" },
  metaText: { color: "#ccc", marginTop: 3 },
  mintBox: { width: "100%", marginTop: 30 },
  prompt: { color: "#ccc", textAlign: "center" },
});
