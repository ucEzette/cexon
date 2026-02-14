'use client';

import React, { useState, useEffect } from 'react';
import { PrivyProvider } from '@privy-io/react-auth';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { tempoTestnet, RPC_URL } from '@/lib/chains';

const queryClient = new QueryClient();

export const wagmiConfig = createConfig({
    chains: [tempoTestnet],
    transports: {
        [tempoTestnet.id]: http(RPC_URL),
    },
});

export default function Providers({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Prevent hydration mismatch and context warnings by only rendering children once mounted
    if (!mounted) {
        return null;
    }

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
            <WagmiProvider config={wagmiConfig}>
                <QueryClientProvider client={queryClient}>
                    {children}
                </QueryClientProvider>
            </WagmiProvider>
        </PrivyProvider>
    );
}
