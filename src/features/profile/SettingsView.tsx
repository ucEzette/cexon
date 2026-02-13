"use client";

import React, { useState } from 'react';
import { User, Shield, Sliders, BarChart3, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { IdentityPanel } from './IdentityPanel';
import { SecurityPanel } from './SecurityPanel';
import { PreferencesPanel } from './PreferencesPanel';
import { StatsPanel } from './StatsPanel';

type TabType = 'General' | 'Security' | 'Preferences' | 'Statistics';

export const SettingsView = () => {
    const [activeTab, setActiveTab] = useState<TabType>('General');

    const menuItems = [
        { id: 'General', icon: User, label: 'Identity & Wallet' },
        { id: 'Security', icon: Shield, label: 'Security & Passkeys' },
        { id: 'Preferences', icon: Sliders, label: 'Trading Preferences' },
        { id: 'Statistics', icon: BarChart3, label: 'Account Statistics' },
    ];

    const renderPanel = () => {
        switch (activeTab) {
            case 'General': return <IdentityPanel />;
            case 'Security': return <SecurityPanel />;
            case 'Preferences': return <PreferencesPanel />;
            case 'Statistics': return <StatsPanel />;
            default: return <IdentityPanel />;
        }
    };

    return (
        <div className="flex-1 bg-[#050505] overflow-hidden flex flex-col">
            <div className="p-8 border-b border-surface-border bg-surface-dark/30">
                <h2 className="text-3xl font-bold text-white font-display tracking-tight mb-2 uppercase">Account Control Center</h2>
                <p className="text-slate-500 font-mono text-xs uppercase tracking-[0.2em]">Cexon High-Frequency Node Configuration</p>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Sidebar */}
                <aside className="w-72 border-r border-surface-border bg-surface-dark/10 p-6 flex flex-col gap-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id as TabType)}
                                className={cn(
                                    "flex items-center justify-between px-4 py-3 rounded-lg transition-all group font-mono text-[11px] uppercase tracking-widest font-bold",
                                    isActive
                                        ? "bg-primary/10 text-primary border border-primary/30 shadow-glow-sm"
                                        : "text-slate-500 hover:bg-white/5 hover:text-slate-300"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <Icon className={cn("w-4 h-4", isActive ? "text-primary" : "text-slate-500 group-hover:text-slate-300")} />
                                    {item.label}
                                </div>
                                {isActive && <ChevronRight className="w-3 h-3" />}
                            </button>
                        );
                    })}
                </aside>

                {/* Main Content */}
                <main className="flex-1 overflow-auto bg-[url('/bg-grid.png')] bg-repeat">
                    <div className="max-w-4xl mx-auto p-10">
                        {renderPanel()}
                    </div>
                </main>
            </div>
        </div>
    );
};
