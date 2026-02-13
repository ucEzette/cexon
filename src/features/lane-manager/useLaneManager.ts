"use client";

import { create } from 'zustand';
import { useToastStore } from '@/store/useToastStore';
import { useContractInteractions } from '@/hooks/useContractInteractions';
import { keccak256, encodePacked, Hex } from 'viem';

export type LaneStatus = 'idle' | 'processing' | 'confirmed' | 'error';

export interface Lane {
    id: number;
    status: LaneStatus;
    nonce: number;
    lastExecutionTime?: number;
    lastTxHash?: string;
}

interface LaneState {
    lanes: Lane[];
    isSyncing: boolean;
    syncNonces: (provider?: any) => Promise<void>;
    processTrade: (tradeParams: { id: string; side: string; price: number; amount: number }, provider?: any) => Promise<number | null>;
    resetLane: (id: number) => void;
}

export const useLaneManager = create<LaneState>((set, get) => ({
    lanes: [
        { id: 1, status: 'idle', nonce: 0 },
        { id: 2, status: 'idle', nonce: 0 },
        { id: 3, status: 'idle', nonce: 0 },
        { id: 4, status: 'idle', nonce: 0 },
    ],
    isSyncing: false,

    syncNonces: async (provider) => {
        const { getLaneNoncesOnChain } = useContractInteractions(provider);
        set({ isSyncing: true });
        try {
            const nonces = await getLaneNoncesOnChain();
            set((state) => ({
                lanes: state.lanes.map((l, i) => ({ ...l, nonce: nonces[i] })),
                isSyncing: false
            }));
            console.log("[LaneManager] Nonces synced from chain:", nonces);
        } catch (error) {
            console.error("[LaneManager] Sync failed:", error);
            set({ isSyncing: false });
        }
    },

    processTrade: async (tradeParams, provider) => {
        const { lanes } = get();
        const { executeTradeOnChain } = useContractInteractions(provider);
        const { addToast } = useToastStore.getState();

        // Smart Routing: Find the first idle lane
        const availableLane = lanes.find(l => l.status === 'idle');

        if (!availableLane) {
            addToast("All lanes busy. Sequential bottleneck detected.", "error");
            return null;
        }

        const laneId = availableLane.id;
        const currentNonce = availableLane.nonce;

        // Set lane to processing
        set((state) => ({
            lanes: state.lanes.map(l =>
                l.id === laneId ? { ...l, status: 'processing' } : l
            )
        }));

        try {
            // Generate order hash for on-chain verification
            const orderHash = keccak256(
                encodePacked(
                    ['string', 'string', 'uint256', 'uint256'],
                    [tradeParams.id, tradeParams.side, BigInt(Math.floor(tradeParams.price * 100)), BigInt(Math.floor(tradeParams.amount * 10000))]
                )
            ) as Hex;

            // Execute on-chain
            addToast(`Broadcasting to Lane ${laneId} (Nonce: ${currentNonce})...`, 'info');
            const txHash = await executeTradeOnChain(laneId, currentNonce, orderHash);

            // Transition to confirmed
            set((state) => ({
                lanes: state.lanes.map(l =>
                    l.id === laneId ? {
                        ...l,
                        status: 'confirmed',
                        nonce: l.nonce + 1,
                        lastExecutionTime: Date.now(),
                        lastTxHash: txHash
                    } : l
                )
            }));

            addToast(`Lane ${laneId} CONFIRMED. Nonce advanced to ${currentNonce + 1}`, 'success');

            // Brief delay for the "Confirmed" flash effect
            setTimeout(() => {
                get().resetLane(laneId);
            }, 2000);

            return laneId;
        } catch (error: any) {
            console.error(`[LaneManager] Execution error in Lane ${laneId}:`, error);

            const errorMessage = error.message || "";
            if (errorMessage.includes("insufficient funds") || errorMessage.includes("exceeds the balance")) {
                addToast(`Lane ${laneId} Failed: Insufficient Gas Funds`, 'error');
            } else if (errorMessage.includes("InvalidNonce") || errorMessage.includes("Sequence Break")) {
                addToast(`Execution Refused in Lane ${laneId}: Sequence Break`, 'error');
            } else {
                addToast(`Execution Refused in Lane ${laneId}: Dynamic Fault`, 'error');
            }

            set((state) => ({
                lanes: state.lanes.map(l =>
                    l.id === laneId ? { ...l, status: 'idle' } : l
                )
            }));
            return null;
        }
    },

    resetLane: (id) => set((state) => ({
        lanes: state.lanes.map(l =>
            l.id === id ? { ...l, status: 'idle' } : l
        )
    })),
}));
