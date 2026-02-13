"use client";

import { create } from 'zustand';

export type ViewType = 'Trading' | 'Portfolio' | 'Analytics' | 'Stake';

interface NavigationState {
    activeView: ViewType;
    setActiveView: (view: ViewType) => void;
}

export const useNavigationStore = create<NavigationState>((set) => ({
    activeView: 'Trading',
    setActiveView: (view) => set({ activeView: view }),
}));
