"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { useMarketStore } from './useMarketData';
import { useGlobalStore } from '@/store/useGlobalStore';
import { ArrowUpDown, Filter } from 'lucide-react';

export const OrderBook = () => {
    const { bids, asks, price } = useMarketStore();
    const { tradeHistory } = useGlobalStore();
    const [isMounted, setIsMounted] = React.useState(false);

    React.useEffect(() => {
        setIsMounted(true);
    }, []);

    return (
        <aside className="col-span-12 lg:col-span-3 bg-surface-dark flex flex-col h-full border-l border-surface-border overflow-hidden">
            {/* Header */}
            <div className="p-3 border-b border-surface-border flex justify-between items-center bg-surface-dark/50">
                <h3 className="text-sm font-medium text-slate-300 font-display">Order Book</h3>
                <div className="flex gap-1.5 text-slate-500">
                    <button className="p-1 hover:bg-white/5 rounded transition-colors"><ArrowUpDown className="w-3.5 h-3.5" /></button>
                    <button className="p-1 hover:bg-white/5 rounded transition-colors"><Filter className="w-3.5 h-3.5" /></button>
                </div>
            </div>

            {/* Column Headers */}
            <div className="grid grid-cols-3 px-3 py-2 text-[10px] uppercase text-slate-500 font-mono font-bold tracking-wider border-b border-surface-border/50">
                <div className="text-left font-display">Price (USDC)</div>
                <div className="text-right font-display">Size (ETH)</div>
                <div className="text-right font-display">Sum</div>
            </div>

            {/* Asks (Sells) */}
            <div className="flex-1 overflow-y-auto font-mono text-[11px] custom-scrollbar">
                <div className="flex flex-col-reverse">
                    {asks.map((ask, i) => (
                        <div
                            key={i}
                            className="grid grid-cols-3 px-3 py-0.5 hover:bg-white/5 cursor-pointer depth-bg-ask relative"
                            style={{ '--percent': `${Math.min((ask.total / 50) * 100, 100)}%` } as React.CSSProperties}
                        >
                            <div className="text-ask-red font-bold">{ask.price.toFixed(2)}</div>
                            <div className="text-right text-slate-300">{ask.amount.toFixed(2)}</div>
                            <div className="text-right text-slate-500">{ask.total.toFixed(2)}</div>
                        </div>
                    ))}
                </div>

                {/* Spread / Mid Price */}
                <div className="py-2.5 px-3 my-1 bg-surface-border/20 border-y border-surface-border flex justify-between items-center">
                    <span className="text-primary font-bold text-lg">{price.toFixed(2)}</span>
                    <span className="text-[10px] text-slate-500 flex items-center gap-1 font-mono uppercase">
                        Spread: {(asks[0]?.price - bids[0]?.price).toFixed(2)}
                    </span>
                </div>

                {/* Bids (Buys) */}
                <div className="flex flex-col">
                    {bids.map((bid, i) => (
                        <div
                            key={i}
                            className="grid grid-cols-3 px-3 py-0.5 hover:bg-white/5 cursor-pointer depth-bg-bid"
                            style={{ '--percent': `${Math.min((bid.total / 50) * 100, 100)}%` } as React.CSSProperties}
                        >
                            <div className="text-primary font-bold">{bid.price.toFixed(2)}</div>
                            <div className="text-right text-slate-300">{bid.amount.toFixed(2)}</div>
                            <div className="text-right text-slate-500">{bid.total.toFixed(2)}</div>
                        </div>
                    ))}
                </div>

                {/* Recent Trades Section */}
                <div className="px-3 py-2 mt-6 text-[10px] uppercase text-slate-400 font-bold tracking-widest border-t border-b border-surface-border/50 bg-black/20">
                    Recent Trades
                </div>
                <div className="flex flex-col mb-4">
                    {tradeHistory.slice(0, 10).map((trade) => (
                        <div key={trade.id} className="grid grid-cols-3 px-3 py-1 opacity-80 hover:opacity-100 transition-all border-b border-white/[0.02]">
                            <div className={cn(
                                "font-bold",
                                trade.side === 'buy' ? "text-primary" : "text-ask-red"
                            )}>
                                {trade.price.toFixed(2)}
                            </div>
                            <div className="text-right text-slate-400">{trade.amount.toFixed(2)}</div>
                            <div className="text-right text-slate-600">
                                {isMounted ? new Date(trade.timestamp).toLocaleTimeString([], { hour12: false }) : "--:--:--"}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </aside>
    );
};
