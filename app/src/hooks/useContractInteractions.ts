import { createPublicClient, createWalletClient, http, Hash, Hex } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { LANE_MANAGER_ADDRESS, LANE_MANAGER_ABI } from '@/lib/contracts';

// In a real app, these would come from the user's connected wallet or a passkey-secured vault.
// For this prototype, we're using the provided demo account.
const PRIVATE_KEY = (process.env.NEXT_PUBLIC_PRIVATE_KEY || '0x6f7ff542e838c5f91b4e9d079598960c485669e1f2af51fec6c22e47c8a4ee6d') as Hex;
const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL || 'https://rpc.testnet.tempo.xyz';
const CHAIN_ID = Number(process.env.NEXT_PUBLIC_CHAIN_ID || 42429);

const account = privateKeyToAccount(PRIVATE_KEY);

const publicClient = createPublicClient({
    chain: {
        id: CHAIN_ID,
        name: 'Tempo Testnet',
        nativeCurrency: { name: 'USD', symbol: 'USD', decimals: 18 },
        rpcUrls: {
            default: { http: [RPC_URL] },
            public: { http: [RPC_URL] },
        },
    },
    transport: http()
});

const walletClient = createWalletClient({
    account,
    chain: {
        id: CHAIN_ID,
        name: 'Tempo Testnet',
        nativeCurrency: { name: 'USD', symbol: 'USD', decimals: 18 },
        rpcUrls: {
            default: { http: [RPC_URL] },
            public: { http: [RPC_URL] },
        },
    },
    transport: http()
});

export const useContractInteractions = () => {
    const executeTradeOnChain = async (laneId: number, nonce: number, orderHash: Hex): Promise<Hash> => {
        try {
            console.log(`[Contract] Executing trade in Lane ${laneId} with Nonce ${nonce}...`);

            const { request } = await publicClient.simulateContract({
                address: LANE_MANAGER_ADDRESS,
                abi: LANE_MANAGER_ABI,
                functionName: 'executeTrade',
                args: [BigInt(laneId), BigInt(nonce), orderHash],
                account,
            });

            const hash = await walletClient.writeContract(request);

            console.log(`[Contract] Transaction sent: ${hash}`);

            // Wait for confirmation
            await publicClient.waitForTransactionReceipt({ hash });
            console.log(`[Contract] Transaction confirmed!`);

            return hash;
        } catch (error) {
            console.error('[Contract] Execution failed:', error);
            throw error;
        }
    };

    const getLaneNoncesOnChain = async (): Promise<number[]> => {
        try {
            const nonces = await publicClient.readContract({
                address: LANE_MANAGER_ADDRESS,
                abi: LANE_MANAGER_ABI,
                functionName: 'getAllNonces',
            }) as bigint[];

            return nonces.map(n => Number(n));
        } catch (error) {
            console.error('[Contract] Failed to fetch nonces:', error);
            return [0, 0, 0, 0];
        }
    };

    return {
        executeTradeOnChain,
        getLaneNoncesOnChain
    };
};
