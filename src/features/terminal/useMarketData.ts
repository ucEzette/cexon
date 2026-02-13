"use client";

import { create } from 'zustand';
import { useEffect } from 'react';

// Types
export interface Order {
    price: number;
    amount: number;
    total: number;
}

interface MarketDataState {
    pair: string;
    price: number;
    change24h: number;
    bids: Order[];
    asks: Order[];
    setPrice: (price: number) => void;
    generateMockData: () => void;
}

export const useMarketStore = create<MarketDataState>((set, get) => ({
    pair: 'ETH/USDC',
    price: 2412.50,
    change24h: 2.4,
    bids: [],
    asks: [],
    setPrice: (price) => set({ price }),
    generateMockData: () => {
        // Generate initial orderbook
        const basePrice = get().price;
        const bids = Array.from({ length: 15 }).map((_, i) => ({
            price: basePrice - (i * 0.5 + Math.random()),
            amount: Math.random() * 5,
            total: 0 // calculate later
        }));
        const asks = Array.from({ length: 15 }).map((_, i) => ({
            price: basePrice + (i * 0.5 + Math.random()),
            amount: Math.random() * 5,
            total: 0
        }));
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
                store.generateMockData(); // Regenerate for simplicity in this demo, or update locally
            }
        }, 1500);

        return () => clearInterval(interval);
    }, []);

    return store;
};
