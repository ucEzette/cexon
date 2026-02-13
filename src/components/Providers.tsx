'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import { type Chain } from 'viem';

// 1. Manually define the Tempo Testnet
export const tempoTestnet: Chain = {
    id: 123456, // Replace with actual Tempo Testnet ID if different
    name: 'Tempo Testnet',
    nativeCurrency: {
        decimals: 18,
        name: 'Tempo',
        symbol: 'TMP',
    },
    rpcUrls: {
        default: { http: ['https://rpc.tempo.xyz'] },
        public: { http: ['https://rpc.tempo.xyz'] },
    },
    blockExplorers: {
        default: { name: 'Tempo Explorer', url: 'https://explorer.tempo.xyz' },
    },
} as const;

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <PrivyProvider
            appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ''}
            config={{
                appearance: {
                    theme: 'dark',
                    accentColor: '#00F0FF', // Cexon Turquoise Accent
                    logo: '/cexonLOGO.jpeg',
                },
                defaultChain: tempoTestnet,
                supportedChains: [tempoTestnet],
                embeddedWallets: {
                    ethereum: {
                        createOnLogin: 'users-without-wallets',
                    },
                },
                loginMethods: ['email', 'wallet', 'google', 'apple'],
            }}
        >
            {children}
        </PrivyProvider>
    );
}
