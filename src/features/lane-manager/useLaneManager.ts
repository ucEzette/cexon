"use client";

import { create } from 'zustand';
import { useToastStore } from '@/store/useToastStore';
import { useMarketStore } from '@/features/terminal/useMarketData';
import { useContractInteractions } from '@/hooks/useContractInteractions';
import { keccak256, encodePacked, Hex, parseUnits } from 'viem';
import { USDC_ADDRESS, ETH_WRAPPER_ADDRESS, LANE_MANAGER_ADDRESS } from '@/lib/contracts';

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
    processTrade: (tradeParams: { id: string; side: string; price: number; amount: number; pair?: string }, provider?: any) => Promise<{ laneId: number; amountInWei: string; priceInX18: string } | null>;
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
        const { executeTradeOnChain, ensureAllowance } = useContractInteractions(provider);
        const { addToast } = useToastStore.getState();

        // Smart Routing: Find the first idle lane
        const availableLane = lanes.find(l => l.status === 'idle');

        if (!availableLane) {
            addToast("All lanes busy. Sequential bottleneck detected.", "error");
            return null;
        }

        const { currentPair } = useMarketStore.getState();
        const laneId = availableLane.id;
        const currentNonce = availableLane.nonce;

        // Set lane to processing
        set((state) => ({
            lanes: state.lanes.map(l =>
                l.id === laneId ? { ...l, status: 'processing' } : l
            )
        }));

        try {
            const isBuy = tradeParams.side === 'buy';
            const decimalsIn = isBuy ? currentPair.decimalsA : currentPair.decimalsB;
            const decimalsOut = isBuy ? currentPair.decimalsB : currentPair.decimalsA;

            const amountInValue = parseUnits(tradeParams.amount.toString(), decimalsIn);
            const tokenInAddr = isBuy ? currentPair.tokenA : currentPair.tokenB;
            const tokenOutAddr = isBuy ? currentPair.tokenB : currentPair.tokenA;

            const priceInX18 = parseUnits(tradeParams.price.toString(), 18);

            // Generate order hash for on-chain verification
            const orderHash = keccak256(
                encodePacked(
                    ['string', 'string', 'uint256', 'uint256'],
                    [tradeParams.id, tradeParams.side, priceInX18, amountInValue]
                )
            ) as Hex;

            // 0. Ensure allowance (Auto-Approval)
            addToast(`Verifying allowance for Lane ${laneId}...`, 'info');
            await ensureAllowance(tokenInAddr as Hex, LANE_MANAGER_ADDRESS, amountInValue);

            // 1. Execute on-chain
            addToast(`Broadcasting to Lane ${laneId} (Nonce: ${currentNonce})...`, 'info');
            const txHash = await executeTradeOnChain(
                laneId,
                currentNonce,
                orderHash,
                tokenInAddr as Hex,
                tokenOutAddr as Hex,
                amountInValue,
                0n
            );

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

            return {
                laneId,
                amountInWei: amountInValue.toString(),
                priceInX18: priceInX18.toString()
            };
        } catch (error: any) {
            console.error(`[LaneManager] Execution error in Lane ${laneId}:`, error);

            // Extract nested RPC or Contract error message
            const rawMessage = error.message || "";
            const nestedReason = error.cause?.message || error.details || "";
            const fullError = `${rawMessage} ${nestedReason}`.toLowerCase();

            if (fullError.includes("unauthorized") || fullError.includes("authentication required")) {
                addToast(`Lane ${laneId} Failed: RPC Unauthorized (Check Credentials)`, 'error');
            } else if (fullError.includes("insufficient funds") || fullError.includes("exceeds the balance")) {
                addToast(`Lane ${laneId} Failed: Insufficient Gas Funds`, 'error');
            } else if (fullError.includes("invalidnonce") || fullError.includes("sequence break")) {
                addToast(`Execution Refused in Lane ${laneId}: Sequence Break`, 'error');
            } else {
                // Surface first line of the actual fault
                const faultReason = (nestedReason || rawMessage).split('\n')[0].slice(0, 50);
                addToast(`Execution Refused in Lane ${laneId}: ${faultReason || 'Dynamic Fault'}`, 'error');
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
