import { StyleSheet, Text, View, ScrollView, ActivityIndicator, Image } from 'react-native';

// FIX 1: Import the correct v4 hooks. 'useAddress' replaces 'useActiveAccount'.
import { useAddress, useContract, useNFTs, useOwnedNFTs } from "@thirdweb-dev/react";


// FIX 2: Import the contract ADDRESS string
import { GEONFT_CONTRACT_ADDRESS } from '../../constants/contracts';

// FIX 3: Import the card component
import GeoTokenCard from '../../components/GeoTokenCard';

export default function BuyScreen() {
    // FIX 4: Get the connected wallet address using the v4 hook
    const address = useAddress(); 
    
    // FIX 5: Connect to the NFT contract using the v4 hook
    const { contract } = useContract(GEONFT_CONTRACT_ADDRESS);

    // FIX 6: Fetch Claimable NFTs using the v4 hook
    const { data: nfts, isLoading: isLoadingNFTs } = useNFTs(contract, { start: 0, count: 20 });

    // FIX 7: Fetch Owned NFTs using the v4 hook
    const { data: ownedNfts, isLoading: isLoadingOwnedNfts } = useOwnedNFTs(contract, address);

    // Helper to safely resolve IPFS URLs
    const getImageSource = (uri: string | undefined | null) => {
        if (!uri) return { uri: 'https://placehold.co/100x100/333333/00D1FF?text=No+Image' };
        if (uri.startsWith('ipfs://')) {
            return { uri: `https://ipfs.io/ipfs/${uri.substring(7)}` };
        }
        return { uri };
    };

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
                <Text style={styles.sectionTitle}>Your Owned GeoTokens</Text>
                {!address ? (
                    <Text style={styles.emptyText}>Connect your wallet to see your collected GeoTokens.</Text>
                ) : isLoadingOwnedNfts ? (
                    <ActivityIndicator size="small" color="#00D1FF" style={styles.loading} />
                ) : ownedNfts && ownedNfts.length > 0 ? (
                    <ScrollView horizontal={true} contentContainerStyle={styles.ownedScrollViewContent} style={styles.ownedScrollView}>
                        {ownedNfts.map((nft) => ( 
                            <View key={nft.metadata.id.toString()} style={styles.ownedItem}>
                                <Image 
                                    source={getImageSource(nft.metadata.image)} 
                                    style={styles.ownedImage} 
                                    resizeMode="cover"
                                />
                                <Text style={styles.ownedTitle} numberOfLines={1}>{nft.metadata.name}</Text>
                                <Text style={styles.ownedQuantity}>Qty: {nft.quantityOwned}</Text> 
                            </View>
                        ))}
                    </ScrollView>
                ) : (
                    <Text style={styles.emptyText}>You don't own any GeoTokens yet. Claim one below!</Text>
                )}
                
                <Text style={styles.sectionTitle}>Available GeoTokens (FREE Claim)</Text>
                
                {isLoadingNFTs ? (
                    <ActivityIndicator size="large" color="#00D1FF" style={styles.loading} />
                ) : nfts && nfts.length > 0 ? (
                    nfts.map((nft) => ( 
                        <View key={nft.metadata.id.toString()} style={styles.cardContainer}>
                            <GeoTokenCard nft={nft} />
                        </View>
                    ))
                ) : (
                    <Text style={styles.emptyText}>No GeoTokens currently available to claim.</Text>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        backgroundColor: '#1E1E1E',
    },
    scrollView: {
        flex: 1,
        paddingHorizontal: 20,
    },
    scrollViewContent: {
        paddingVertical: 20,
        paddingBottom: 40,
    },
    cardContainer: {
        marginBottom: 30,
        alignItems: 'center',
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: '700', 
        marginBottom: 15,
        color: '#00D1FF',
        borderBottomWidth: 1,
        borderBottomColor: '#333333',
        paddingBottom: 5,
        marginTop: 20,
        width: '100%',
    },
    loading: {
        marginTop: 20,
    },
    emptyText: {
        color: '#CCCCCC',
        textAlign: 'center',
        fontSize: 16,
        paddingVertical: 20,
    },
    ownedScrollView: {
        paddingVertical: 10,
        marginTop: 5,
        width: '100%',
    },
    ownedScrollViewContent: {
        paddingHorizontal: 10, 
    },
    ownedItem: {
        backgroundColor: '#444444',
        borderRadius: 10,
        padding: 10,
        marginHorizontal: 8,
        alignItems: 'center',
        width: 120,
        height: 160,
        justifyContent: 'space-between',
    },
    ownedImage: {
        width: 100,
        height: 80,
        borderRadius: 5,
        marginBottom: 5,
        backgroundColor: '#333333',
    },
    ownedTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'center',
    },
    ownedQuantity: {
        fontSize: 12,
        color: '#00D1FF',
        fontWeight: 'bold',
        marginTop: 2,
    }
});