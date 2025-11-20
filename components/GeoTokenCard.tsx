import React from 'react';
import { StyleSheet, Text, View, Image, Alert } from 'react-native';

// FIX 1: Import the NFT type from the v4 SDK package
import { NFT } from '@thirdweb-dev/sdk'; 

// FIX 2: Import Web3Button from the v4 React Native package
import { Web3Button } from '@thirdweb-dev/react-native';

// FIX 3: Import the contract address string
import { GEONFT_CONTRACT_ADDRESS } from '../constants/contracts';

interface GeoTokenCardProps {
    nft: NFT; 
}

const getImageSource = (uri: string | undefined | null) => {
    if (!uri) return { uri: 'https://placehold.co/400x300/333333/00D1FF?text=No+Image' };
    if (uri.startsWith('ipfs://')) {
        return { uri: `https://ipfs.io/ipfs/${uri.substring(7)}` };
    }
    return { uri };
};

export default function GeoTokenCard({ nft }: GeoTokenCardProps) {
    
    return (
        <View style={styles.card}>
            <Image 
                source={getImageSource(nft.metadata.image)} 
                style={styles.image} 
                resizeMode="cover"
            />
            <View style={styles.infoContainer}>
                <Text style={styles.title}>{nft.metadata.name}</Text>
                <Text style={styles.description} numberOfLines={2}>
                    {nft.metadata.description}
                </Text>
            </View>
            
            {/* FIX 4: Use Web3Button for the transaction. 
                It handles connecting, loading, and calling the contract automatically. */}
            <View style={styles.buttonContainer}>
                <Web3Button
                    contractAddress={GEONFT_CONTRACT_ADDRESS}
                    action={(contract) => {
                        // In v4, we use contract.erc1155.claim for Edition/1155 tokens
                        return contract.erc1155.claim(nft.metadata.id, 1);
                    }}
                    onSuccess={() => Alert.alert("Success!", "GeoToken claimed!")}
                    onError={(error) => Alert.alert("Error", error.message)}
                    theme="dark"
                >
                    Claim (FREE)
                </Web3Button>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#333333',
        borderRadius: 15,
        overflow: 'hidden',
        width: '100%',
        maxWidth: 350,
        marginBottom: 20,
        elevation: 5, // Android shadow
        shadowColor: '#000', // iOS shadow
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    image: {
        width: '100%',
        height: 200,
        backgroundColor: '#1E1E1E',
    },
    infoContainer: {
        padding: 15,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 5,
    },
    description: {
        fontSize: 14,
        color: '#CCCCCC',
    },
    buttonContainer: {
        padding: 10,
        alignItems: 'center',
    }
});