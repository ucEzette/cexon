"use client";

import { create } from 'zustand';
import { useEffect } from 'react';
import { Address } from 'viem';
import { USDC_ADDRESS, ETH_WRAPPER_ADDRESS } from '@/lib/contracts';

// Types
export interface Order {
    price: number;
    amount: number;
    total: number;
}

export interface MarketPair {
    name: string;
    tokenA: Address;
    tokenB: Address;
    basePrice: number;
    decimalsA: number; // Quote token (e.g. USDC)
    decimalsB: number; // Base token (e.g. ETH)
}

interface MarketDataState {
    pairs: MarketPair[];
    currentPair: MarketPair;
    price: number;
    change24h: number;
    bids: Order[];
    asks: Order[];
    setPrice: (price: number) => void;
    setPair: (pairName: string) => void;
    generateMockData: () => void;
}

const INITIAL_PAIRS: MarketPair[] = [
    {
        name: 'ETH/USDC',
        tokenA: USDC_ADDRESS,
        tokenB: ETH_WRAPPER_ADDRESS,
        basePrice: 2412.50,
        decimalsA: 6,
        decimalsB: 18
    },
    {
        name: 'cETH/USDC',
        tokenA: USDC_ADDRESS,
        tokenB: ETH_WRAPPER_ADDRESS,
        basePrice: 2412.50,
        decimalsA: 6,
        decimalsB: 18
    }
];

export const useMarketStore = create<MarketDataState>((set, get) => ({
    pairs: INITIAL_PAIRS,
    currentPair: INITIAL_PAIRS[0],
    price: INITIAL_PAIRS[0].basePrice,
    change24h: 2.4,
    bids: [],
    asks: [],
    setPrice: (price) => set({ price }),
    setPair: (pairName) => {
        const pair = get().pairs.find(p => p.name === pairName);
        if (pair) {
            set({ currentPair: pair, price: pair.basePrice });
            get().generateMockData();
        }
    },
    generateMockData: () => {
        // Generate initial orderbook
        const basePrice = get().price;

        let cumulativeBidTotal = 0;
        const bids = Array.from({ length: 15 }).map((_, i) => {
            const amount = Math.random() * 5;
            cumulativeBidTotal += amount;
            return {
                price: basePrice - (i * 0.5 + Math.random()),
                amount,
                total: cumulativeBidTotal
            };
        }).sort((a, b) => b.price - a.price);

        let cumulativeAskTotal = 0;
        const asks = Array.from({ length: 15 }).map((_, i) => {
            const amount = Math.random() * 5;
            cumulativeAskTotal += amount;
            return {
                price: basePrice + (i * 0.5 + Math.random()),
                amount,
                total: cumulativeAskTotal
            };
        }).sort((a, b) => a.price - b.price);

        set({ bids, asks });
    }
}));

export const useMarketData = () => {
    const store = useMarketStore();

    useEffect(() => {
        store.generateMockData();

        const interval = setInterval(() => {
            // Simulate live price updates
            const currentPrice = store.price;
            const fluctuation = (Math.random() - 0.5) * 0.5;
            const newPrice = currentPrice + fluctuation;
            store.setPrice(Number(newPrice.toFixed(2)));

            // Randomly update an ask or bid to simulate activity
            if (Math.random() > 0.5) {
                store.generateMockData();
            }
        }, 1500);

        return () => clearInterval(interval);
    }, [store.currentPair.name]);

    return store;
};
