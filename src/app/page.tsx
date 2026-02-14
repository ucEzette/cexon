"use client";

import React, { useState } from 'react';
import { MainLayout } from "@/components/layout/MainLayout";
import { OrderForm } from "@/features/terminal/OrderForm";
import { OrderBook } from "@/features/terminal/OrderBook";
import { ChartWidget } from "@/features/terminal/ChartWidget";
import { LaneStatus } from "@/features/lane-manager/LaneStatus";
import { SessionStatus } from "@/features/terminal/SessionStatus";
import { useMarketStore } from '@/features/terminal/useMarketData';
import { TradeHistory } from '@/features/terminal/TradeHistory';
import { cn } from '@/lib/utils';
import { TrendingUp, BarChart2, ChevronDown } from 'lucide-react';
import { useNavigationStore } from '@/store/useNavigationStore';
import { PortfolioView } from '@/features/portfolio/PortfolioView';
import { AnalyticsView } from '@/features/analytics/AnalyticsView';
import { StakeView } from '@/features/stake/StakeView';
import { SettingsView } from '@/features/profile/SettingsView';
import { DocsView } from '@/features/docs/DocsView';
import { PoolView } from '@/features/liquidity/PoolView';

export default function Home() {
    const { price, pairs, currentPair, setPair } = useMarketStore();
    const { activeView } = useNavigationStore();
    const [activeTab, setActiveTab] = useState<'chart' | 'logs'>('chart');

    const renderContent = () => {
        switch (activeView) {
            case 'Portfolio':
                return <PortfolioView />;
            case 'Analytics':
                return <AnalyticsView />;
            case 'Stake':
                return <StakeView />;
            case 'Settings':
                return <SettingsView />;
            case 'Docs':
                return <DocsView />;
            case 'Pool':
                return <PoolView />;
            case 'Trading':
            default:
                return (
                    <div className="flex-1 grid grid-cols-12 divide-x divide-surface-border overflow-hidden h-full">
                        {/* Left Column: Market & Order Form */}
                        <aside className="col-span-12 lg:col-span-3 bg-surface-dark flex flex-col h-full border-r border-surface-border max-w-[400px] overflow-hidden">
                            <div className="p-4 border-b border-surface-border bg-surface-dark/50 shrink-0">
                                <div className="flex items-center justify-between mb-1">
                                    <div className="flex items-center gap-2 text-white font-bold text-lg font-mono group cursor-pointer relative">
                                        <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                                            <BarChart2 className="w-4 h-4 text-primary" />
                                        </div>
                                        <div className="flex items-center gap-1 group-hover:text-primary transition-colors">
                                            {currentPair.name}
                                            <ChevronDown className="w-4 h-4 opacity-50" />
                                        </div>

                                        {/* Simple Pair Selector Dropdown on Hover/Click */}
                                        <div className="absolute top-full left-0 mt-2 bg-surface-dark border border-surface-border rounded shadow-2xl hidden group-hover:block z-50 min-w-[150px]">
                                            {pairs.map(p => (
                                                <div
                                                    key={p.name}
                                                    onClick={() => setPair(p.name)}
                                                    className={cn(
                                                        "px-4 py-2 hover:bg-primary hover:text-black cursor-pointer text-xs font-bold uppercase tracking-widest transition-all",
                                                        currentPair.name === p.name ? "text-primary" : "text-slate-400"
                                                    )}
                                                >
                                                    {p.name}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <span className="text-green-500 text-sm font-mono flex items-center gap-1 font-bold">
                                        +2.4% <TrendingUp className="w-3 h-3" />
                                    </span>
                                </div>
                                <div className="flex justify-between text-[10px] text-slate-500 font-mono uppercase tracking-widest">
                                    <span>Vol: $1.2B</span>
                                    <span>24h High: 2,450.00</span>
                                </div>
                            </div>

                            <OrderForm />
                        </aside>

                        {/* Center Column: Charts & Parallel Execution Visualizer */}
                        <main className="col-span-12 lg:col-span-6 flex flex-col bg-background-dark relative border-r border-surface-border overflow-hidden h-full">
                            <SessionStatus />

                            {/* Toolbar / Tabs */}
                            <div className="h-10 border-b border-surface-border flex items-center px-4 justify-between bg-surface-dark/50 z-10 shrink-0">
                                <div className="flex gap-4 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                                    <span
                                        onClick={() => setActiveTab('chart')}
                                        className={cn("cursor-pointer py-2 px-1 transition-all", activeTab === 'chart' ? "text-primary border-b border-primary shadow-glow-sm" : "hover:text-white")}
                                    >
                                        Live Chart
                                    </span>
                                    <span
                                        onClick={() => setActiveTab('logs')}
                                        className={cn("cursor-pointer py-2 px-1 transition-all", activeTab === 'logs' ? "text-primary border-b border-primary shadow-glow-sm" : "hover:text-white")}
                                    >
                                        Execution Logs
                                    </span>
                                </div>
                            </div>

                            {/* Performance View Area */}
                            <div className="flex-1 flex flex-col min-h-0 relative overflow-hidden">
                                {activeTab === 'chart' ? (
                                    <div className="flex-1 flex flex-col bg-grid-slate-900/[0.05] relative overflow-hidden">
                                        <div className="absolute top-12 left-4 z-10 pointer-events-none">
                                            <div className="text-[10px] text-primary/60 font-mono mb-1">REAL-TIME DATA FEED</div>
                                            <div className="flex gap-4 font-mono text-xs">
                                                <span className="text-slate-400">O <span className="text-white">2408.2</span></span>
                                                <span className="text-slate-400">H <span className="text-white">2415.5</span></span>
                                                <span className="text-slate-400">L <span className="text-white">2405.1</span></span>
                                                <span className="text-slate-400">C <span className="text-white">{price.toFixed(1)}</span></span>
                                            </div>
                                        </div>
                                        <div className="flex-1 overflow-hidden">
                                            <ChartWidget />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex-1 overflow-auto bg-black/40 custom-scrollbar">
                                        <TradeHistory />
                                    </div>
                                )}
                            </div>

                            {/* 2D Nonce Execution Manager */}
                            <div className="shrink-0">
                                <LaneStatus />
                            </div>
                        </main>

                        {/* Right Column: Order Book & Flow */}
                        <OrderBook />
                    </div>
                );
        }
    };

    return (
        <MainLayout>
            {renderContent()}
        </MainLayout>
    );
}
