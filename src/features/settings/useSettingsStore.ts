"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type GasToken = 'USDC' | 'TEMPO' | 'NATIVE';

interface SettingsState {
    gasToken: GasToken;
    isSponsored: boolean;
    setGasToken: (token: GasToken) => void;
    toggleSponsorship: () => void;
}

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set) => ({
            gasToken: 'USDC',
            isSponsored: false,
            setGasToken: (token) => set({ gasToken: token }),
            toggleSponsorship: () => set((state) => ({ isSponsored: !state.isSponsored })),
        }),
        {
            name: 'cexon-settings',
        }
    )
);
