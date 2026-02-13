import { createPublicClient, createWalletClient, custom, Hash, Hex, http } from 'viem';
import { LANE_MANAGER_ADDRESS, LANE_MANAGER_ABI, USDC_ADDRESS } from '@/lib/contracts';
import { tempoTestnet } from '@/components/Providers';

const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL || 'https://rpc.tempo.xyz';

const publicClient = createPublicClient({
    chain: tempoTestnet,
    transport: http(RPC_URL)
});

export const useContractInteractions = (provider?: any) => {
    const executeTradeOnChain = async (laneId: number, nonce: number, orderHash: Hex): Promise<Hash> => {
        if (!provider) throw new Error("Wallet not connected");

        try {
            console.log(`[Contract] Executing trade in Lane ${laneId} with Nonce ${nonce} using Custom Type 0x76...`);

            const walletClient = createWalletClient({
                chain: tempoTestnet,
                transport: custom(provider)
            });

            const [account] = await walletClient.getAddresses();

            const { request } = await publicClient.simulateContract({
                address: LANE_MANAGER_ADDRESS,
                abi: LANE_MANAGER_ABI,
                functionName: 'executeTrade',
                args: [BigInt(laneId), BigInt(nonce), orderHash],
                account,
            });

            // Cast to any to support Tempo's custom EIP-2718 type fields (feeToken, nonceKey)
            // as specified in the technical requirements for 2D Nonces.
            const hash = await walletClient.writeContract({
                ...request,
                type: '0x76' as any,
                nonceKey: BigInt(laneId),
                feeToken: USDC_ADDRESS
            } as any);

            console.log(`[Contract] Transaction sent with Custom Type 0x76: ${hash}`);

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
