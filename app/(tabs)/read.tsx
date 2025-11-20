import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';

// FIX 1: Import ALL v4 hooks from '@thirdweb-dev/react-native'
// useAddress replaces useActiveAccount
import { useAddress, useContract, useContractRead } from "@thirdweb-dev/react-native";
 

// FIX 2: Import the exported address string we just fixed in the previous step
import { GEOTOKEN_CONTRACT_ADDRESS } from '../../constants/contracts'; 

export default function ReadScreen() {
    // FIX 3: Get the connected wallet address directly
    const address = useAddress();

    // FIX 4: Connect to the contract using the address string
    const { contract } = useContract(GEOTOKEN_CONTRACT_ADDRESS);

    // FIX 5: Read the balance. Pass the address as the argument.
    // 'balanceOf' is the standard ERC-20 function to check a balance.
    const { data: balanceData, isLoading: isLoadingBalance } = useContractRead(
        contract, 
        "balanceOf", 
        [address] // Pass the user's address to check their balance
    );

    // FIX 6: Get the symbol for display (optional, but good for UI)
    const { data: symbol } = useContractRead(contract, "symbol");

    // Helper function to format BigNumber balance safely
    const formatBalance = (balance: any) => {
        if (!balance) return "0.00";
        // Simple division for display (assuming 18 decimals for standard ERC20)
        // In a production app, use ethers.utils.formatUnits
        return (Number(balance) / 10**18).toFixed(2);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Your GeoToken Balance</Text>
            
            {!address ? (
                <Text style={styles.emptyText}>Connect your wallet on the 'Connect' tab to view your balance.</Text>
            ) : isLoadingBalance ? (
                <ActivityIndicator size="large" color="#00D1FF" style={styles.loading} />
            ) : (
                <View style={styles.balanceContainer}>
                    <Text style={styles.balanceAmount}>{
                        `${formatBalance(balanceData)} ${symbol || 'GEO'}`
                    }</Text>
                    <Text style={styles.balanceLabel}>Current ERC-20 GeoToken Balance</Text>
                </View>
            )}
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
    title: {
        fontSize: 24,
        fontWeight: '700', 
        marginBottom: 30,
        color: '#00D1FF',
    },
    balanceContainer: {
        alignItems: 'center',
        padding: 30,
        borderRadius: 15,
        backgroundColor: '#333333',
    },
    balanceAmount: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    balanceLabel: {
        fontSize: 16,
        color: '#CCCCCC',
        marginTop: 10,
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
});