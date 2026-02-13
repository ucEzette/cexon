"use client";

import React, { useState, useEffect } from 'react';
import { useLaneManager } from '@/features/lane-manager/useLaneManager';
import { useMarketStore } from '@/features/terminal/useMarketData';
import { useGlobalStore, Order } from '@/store/useGlobalStore';
import { cn } from '@/lib/utils';
import { Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useWallets } from '@privy-io/react-auth';
import { SmartSplitAgent } from './SmartSplitAgent';

export const OrderForm = () => {
    const { wallets } = useWallets();
    const { processTrade, lanes } = useLaneManager();
    const { price } = useMarketStore();
    const { userBalance, addOrder, fillOrder, isKillSwitchActive } = useGlobalStore();

    const [side, setSide] = useState<'buy' | 'sell'>('buy');
    const [orderType, setOrderType] = useState<'limit' | 'market' | 'stop'>('limit');
    const [isAgentMode, setIsAgentMode] = useState(false);
    const [amount, setAmount] = useState('4.5');
    const [orderPrice, setOrderPrice] = useState('2410.00');

    const total = (parseFloat(amount) || 0) * (parseFloat(orderPrice) || 0);
    const nextLane = lanes.find(l => l.status === 'idle');

    const handleTradeCap = async () => {
        if (isKillSwitchActive) return;

        const wallet = wallets[0];
        if (!wallet) {
            alert("Please connect your wallet first.");
            return;
        }

        const orderId = Math.random().toString(36).substring(7);
        const tradeParams = {
            id: orderId,
            side,
            amount: parseFloat(amount),
            price: parseFloat(orderPrice),
        };

        const newOrder: Order = {
            id: orderId,
            pair: 'ETH / USDC',
            side: tradeParams.side,
            price: tradeParams.price,
            amount: tradeParams.amount,
            total,
            status: 'open',
            timestamp: Date.now(),
        };

        addOrder(newOrder);

        try {
            const provider = await wallet.getEthereumProvider();
            const laneId = await processTrade(tradeParams, provider);

            if (laneId) {
                fillOrder(orderId, laneId);
            } else {
                alert("Execution failed: All lanes are currently busy. Parallel limit reached.");
            }
        } catch (err) {
            console.error(err);
            alert("Execution failed: User rejected or network error.");
        }
    };

    const handleAutoSplit = async (splitAmount: number) => {
        if (isKillSwitchActive) return;
        const wallet = wallets[0];
        if (!wallet) return;

        const provider = await wallet.getEthereumProvider();

        // Execute 4 parallel trades
        for (let i = 0; i < 4; i++) {
            const orderId = `split-${Math.random().toString(36).substring(7)}`;
            const tradeParams = {
                id: orderId,
                side,
                amount: splitAmount,
                price: parseFloat(orderPrice),
            };

            const newOrder: Order = {
                id: orderId,
                pair: 'ETH / USDC',
                side: tradeParams.side,
                price: tradeParams.price,
                amount: tradeParams.amount,
                total: splitAmount * tradeParams.price,
                status: 'open',
                timestamp: Date.now(),
            };

            addOrder(newOrder);

            // Fire and forget (parallel)
            processTrade(tradeParams, provider).then(laneId => {
                if (laneId) fillOrder(orderId, laneId);
            });
        }
    };

    return (
        <div className="p-5 flex flex-col gap-5 flex-1 overflow-y-auto custom-scrollbar">
            {/* Order Type Switcher */}
            <div className="flex border-b border-surface-border bg-black/20 mb-2">
                {(['limit', 'market', 'stop'] as const).map((type) => (
                    <button
                        key={type}
                        onClick={() => setOrderType(type)}
                        className={cn(
                            "flex-1 py-3 text-[10px] font-bold uppercase tracking-widest transition-colors",
                            orderType === type
                                ? "text-white border-b-2 border-primary bg-primary/5"
                                : "text-slate-500 hover:text-white hover:bg-white/5"
                        )}
                    >
                        {type}
                    </button>
                ))}
            </div>

            {/* Buy/Sell Switcher */}
            <div className="flex gap-2 p-1 bg-black/40 rounded-lg border border-surface-border">
                <button
                    onClick={() => setSide('buy')}
                    className={cn(
                        "flex-1 py-1.5 text-xs font-bold rounded transition-all",
                        side === 'buy'
                            ? "bg-green-500/20 text-green-400 border border-green-500/30"
                            : "text-slate-500 hover:text-green-400 hover:bg-green-500/10"
                    )}
                >
                    BUY
                </button>
                <button
                    onClick={() => setSide('sell')}
                    className={cn(
                        "flex-1 py-1.5 text-xs font-bold rounded transition-all",
                        side === 'sell'
                            ? "bg-red-500/20 text-red-400 border border-red-500/30"
                            : "text-slate-500 hover:text-red-400 hover:bg-red-500/10"
                    )}
                >
                    SELL
                </button>
            </div>

            {/* Lane Health & Smart Routing Info */}
            <div className="bg-black/40 rounded border border-surface-border p-3">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">Lane Health</span>
                    <span className="text-[10px] text-primary font-mono transition-all">
                        {nextLane ? `Smart Routing: Lane #${nextLane.id.toString().padStart(2, '0')}` : "Lanes Busy"}
                    </span>
                </div>
                <div className="flex gap-1.5">
                    {lanes.map((lane) => (
                        <div key={lane.id} className="flex-1 h-1.5 bg-surface-border/30 rounded-full overflow-hidden relative group cursor-help">
                            {lane.status === 'processing' && (
                                <div className="absolute inset-0 bg-yellow-500 animate-pulse" />
                            )}
                            {lane.status === 'confirmed' && (
                                <div className="absolute inset-0 bg-primary shadow-glow-sm" />
                            )}
                            {lane.status === 'idle' && (
                                <div className="absolute inset-0 bg-green-500/60 shadow-[0_0_8px_rgba(34,197,94,0.3)]" />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Agent Mode Toggle */}
            <div
                onClick={() => setIsAgentMode(!isAgentMode)}
                className={cn(
                    "p-3 rounded border transition-all cursor-pointer group flex items-center justify-between",
                    isAgentMode
                        ? "bg-primary/10 border-primary/50"
                        : "bg-black/40 border-surface-border hover:border-primary/30"
                )}
            >
                <div className="flex items-center gap-2">
                    <Sparkles className={cn("w-4 h-4 transition-colors", isAgentMode ? "text-primary" : "text-slate-500")} />
                    <div>
                        <div className={cn("text-[10px] font-bold uppercase tracking-widest", isAgentMode ? "text-primary" : "text-slate-400")}>
                            Agent Mode
                        </div>
                        <div className="text-[9px] text-slate-500 font-mono">Autonomous 2D Routing</div>
                    </div>
                </div>
                <div className={cn(
                    "w-8 h-4 rounded-full relative transition-colors",
                    isAgentMode ? "bg-primary" : "bg-slate-700"
                )}>
                    <motion.div
                        animate={{ x: isAgentMode ? 16 : 2 }}
                        className="absolute top-1 w-2 h-2 rounded-full bg-white shadow-sm"
                    />
                </div>
            </div>

            {/* Inputs */}
            <div className="space-y-4">
                <div>
                    <div className="flex justify-between mb-1.5 text-[11px]">
                        <label className="text-slate-400 font-medium font-display">Price (USDC)</label>
                        <span className="text-primary cursor-pointer font-mono hover:underline">Last: {price.toFixed(2)}</span>
                    </div>
                    <div className="relative group">
                        <input
                            className="w-full bg-black border border-surface-border rounded p-3 pl-4 pr-12 text-right text-white font-mono text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all group-hover:border-slate-600"
                            type="text"
                            value={orderPrice}
                            onChange={(e) => setOrderPrice(e.target.value)}
                        />
                        <span className="absolute right-3 top-3.5 text-xs text-slate-600 font-mono pointer-events-none">USDC</span>
                    </div>
                </div>

                <div>
                    <div className="flex justify-between mb-1.5 text-[11px]">
                        <label className="text-slate-400 font-medium font-display">Amount (ETH)</label>
                        <span className="text-slate-500 font-mono">Max: {side === 'buy' ? (userBalance.USDC / price).toFixed(2) : userBalance.ETH.toFixed(2)}</span>
                    </div>
                    <div className="relative group">
                        <input
                            className="w-full bg-black border border-surface-border rounded p-3 pl-4 pr-12 text-right text-white font-mono text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all group-hover:border-slate-600"
                            type="text"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                        <span className="absolute right-3 top-3.5 text-xs text-slate-600 font-mono pointer-events-none">ETH</span>
                    </div>
                    <div className="flex justify-between gap-1 mt-2">
                        {[25, 50, 75, 100].map(p => (
                            <button
                                key={p}
                                onClick={() => {
                                    const max = side === 'buy' ? (userBalance.USDC / price) : userBalance.ETH;
                                    setAmount((max * (p / 100)).toFixed(2));
                                }}
                                className="flex-1 py-1 text-[10px] bg-surface-border/30 rounded text-slate-400 hover:text-white hover:bg-surface-border transition-colors font-mono"
                            >
                                {p}%
                            </button>
                        ))}
                    </div>
                </div>

                <div className="pt-4 border-t border-surface-border/50">
                    <div className="flex justify-between mb-1.5">
                        <label className="text-xs text-slate-300 font-medium font-display">Total</label>
                    </div>
                    <div className="relative">
                        <input
                            className="w-full bg-surface-border/10 border border-surface-border/50 rounded p-3 pl-4 pr-12 text-right text-slate-300 font-mono text-sm"
                            readOnly
                            type="text"
                            value={total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        />
                        <span className="absolute right-3 top-3.5 text-xs text-slate-600 font-mono">USDC</span>
                    </div>
                </div>
            </div>

            <div className="mt-auto pt-4 flex flex-col">
                {/* Smart Split Agent Callout */}
                <SmartSplitAgent
                    amount={parseFloat(amount) || 0}
                    price={parseFloat(orderPrice) || 0}
                    side={side}
                    onSplit={handleAutoSplit}
                />

                <div className="flex items-center justify-between text-[11px] text-slate-500 mb-3 font-mono">
                    <span>Est. Fee</span>
                    <span>0.0012 ETH</span>
                </div>
                <button
                    onClick={handleTradeCap}
                    className={cn(
                        "w-full font-bold py-3.5 rounded shadow-glow transition-all transform active:scale-[0.99] font-mono text-sm tracking-widest",
                        side === 'buy'
                            ? "bg-gradient-to-r from-primary to-cyan-400 text-black shadow-primary/20"
                            : "bg-gradient-to-r from-ask-red to-red-400 text-white shadow-ask-red/20"
                    )}
                >
                    {side.toUpperCase()} ETH
                </button>
            </div>
        </div>
    );
};
