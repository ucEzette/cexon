import { type Chain, createPublicClient, http } from 'viem';

export const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL || 'https://rpc.tempo.xyz';

export const tempoTestnet: Chain = {
    id: 42431, // Tempo Moderato Testnet ID
    name: 'Tempo Moderato',
    nativeCurrency: {
        decimals: 18,
        name: 'Tempo',
        symbol: 'TMP',
    },
    rpcUrls: {
        default: { http: [RPC_URL] },
        public: { http: [RPC_URL] },
    },
    blockExplorers: {
        default: { name: 'Tempo Explorer', url: 'https://explorer.tempo.xyz' },
    },
} as const;

export const publicClient = createPublicClient({
    chain: tempoTestnet,
    transport: http(RPC_URL)
});
