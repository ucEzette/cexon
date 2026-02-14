"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Order {
    id: string;
    pair: string;
    side: 'buy' | 'sell';
    price: number;
    amount: number;
    total: number;
    status: 'open' | 'filled' | 'cancelled';
    timestamp: number;
    laneId?: number;
    amountInWei?: string;
    priceInX18?: string;
}

interface GlobalState {
    userBalance: {
        USDC: number;
        ETH: number;
        TEMPO: number;
    };
    activeOrders: Order[];
    tradeHistory: Order[];
    isKillSwitchActive: boolean;

    // Actions
    addOrder: (order: Order) => void;
    fillOrder: (orderId: string, laneId: number, amountInWei?: string, priceInX18?: string) => void;
    mintDemoTokens: () => void;
    toggleKillSwitch: () => void;
    updateBalance: (token: 'USDC' | 'ETH' | 'TEMPO', amount: number) => void;
}

export const useGlobalStore = create<GlobalState>()(
    persist(
        (set) => ({
            userBalance: {
                USDC: 1240.50,
                ETH: 0.4521,
                TEMPO: 100,
            },
            activeOrders: [],
            tradeHistory: [
                { id: 'h1', pair: 'ETH/USDC', side: 'buy', price: 2412.50, amount: 0.10, total: 241.25, status: 'filled', timestamp: Date.now() - 60000, laneId: 1 },
                { id: 'h2', pair: 'ETH/USDC', side: 'sell', price: 2412.45, amount: 0.55, total: 1326.85, status: 'filled', timestamp: Date.now() - 120000, laneId: 2 },
            ],
            isKillSwitchActive: false,

            toggleKillSwitch: () => set((state) => ({ isKillSwitchActive: !state.isKillSwitchActive })),

            addOrder: (order) => set((state) => ({
                activeOrders: [order, ...state.activeOrders]
            })),

            fillOrder: (orderId, laneId, amountInWei, priceInX18) => set((state) => {
                const orderIndex = state.activeOrders.findIndex(o => o.id === orderId);
                if (orderIndex === -1) return state;

                const order = state.activeOrders[orderIndex];
                const filledOrder: Order = {
                    ...order,
                    status: 'filled',
                    laneId,
                    amountInWei,
                    priceInX18
                };

                return {
                    activeOrders: state.activeOrders.filter(o => o.id !== orderId),
                    tradeHistory: [filledOrder, ...state.tradeHistory],
                    userBalance: {
                        ...state.userBalance,
                        ETH: order.side === 'buy' ? state.userBalance.ETH + order.amount : state.userBalance.ETH - order.amount,
                        USDC: order.side === 'buy' ? state.userBalance.USDC - order.total : state.userBalance.USDC + order.total,
                    }
                };
            }),

            mintDemoTokens: () => set((state) => ({
                userBalance: {
                    ...state.userBalance,
                    USDC: state.userBalance.USDC + 1000,
                }
            })),

            updateBalance: (token, amount) => set((state) => ({
                userBalance: {
                    ...state.userBalance,
                    [token]: amount,
                }
            })),
        }),
        {
            name: 'cexon-global-storage',
        }
    )
);
