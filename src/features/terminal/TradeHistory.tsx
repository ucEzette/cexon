"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { useGlobalStore } from '@/store/useGlobalStore';
import { motion, AnimatePresence } from 'framer-motion';
import { History, List, Activity } from 'lucide-react';

export const TradeHistory = () => {
    const { tradeHistory, activeOrders } = useGlobalStore();
    const [tab, setTab] = React.useState<'history' | 'open'>('history');
    const [isMounted, setIsMounted] = React.useState(false);

    React.useEffect(() => {
        setIsMounted(true);
    }, []);

    const data = tab === 'history' ? tradeHistory : activeOrders;

    return (
        <div className="flex-1 flex flex-col min-h-0 bg-surface-dark/30">
            <div className="h-9 border-b border-surface-border flex items-center px-4 justify-between bg-surface-dark/50">
                <div className="flex gap-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    <button
                        onClick={() => setTab('open')}
                        className={cn("py-2 flex items-center gap-1.5 transition-all", tab === 'open' ? "text-primary border-b border-primary" : "hover:text-white")}
                    >
                        <Activity className="w-3 h-3" />
                        Open Orders ({activeOrders.length})
                    </button>
                    <button
                        onClick={() => setTab('history')}
                        className={cn("py-2 flex items-center gap-1.5 transition-all", tab === 'history' ? "text-primary border-b border-primary" : "hover:text-white")}
                    >
                        <History className="w-3 h-3" />
                        Trade History
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-auto custom-scrollbar">
                <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 bg-surface-dark z-10">
                        <tr className="border-b border-surface-border/50">
                            <th className="px-4 py-2 text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider">Time</th>
                            <th className="px-4 py-2 text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider">Pair</th>
                            <th className="px-4 py-2 text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider">Side</th>
                            <th className="px-4 py-2 text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider text-right">Price</th>
                            <th className="px-4 py-2 text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider text-right">Amount</th>
                            <th className="px-4 py-2 text-[10px] font-mono text-primary font-bold uppercase tracking-wider text-center">Lane ID</th>
                            <th className="px-4 py-2 text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider text-right pr-6">Status</th>
                        </tr>
                    </thead>
                    <tbody className="text-[11px] font-mono group/body">
                        <AnimatePresence initial={false}>
                            {data.map((trade) => (
                                <motion.tr
                                    layout
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 10 }}
                                    key={trade.id}
                                    className="border-b border-surface-border/20 hover:bg-white/[0.02] transition-colors group/row"
                                >
                                    <td className="px-4 py-2.5 text-slate-400">
                                        {isMounted ? new Date(trade.timestamp).toLocaleTimeString([], { hour12: false }) : "--:--:--"}
                                    </td>
                                    <td className="px-4 py-2.5 text-white font-medium">{trade.pair}</td>
                                    <td className={cn(
                                        "px-4 py-2.5 font-bold uppercase tracking-tight",
                                        trade.side === 'buy' ? "text-primary" : "text-ask-red"
                                    )}>
                                        {trade.side}
                                    </td>
                                    <td className="px-4 py-2.5 text-right text-slate-300 font-bold" title={trade.priceInX18 ? `X18: ${trade.priceInX18}` : undefined}>
                                        {trade.price.toFixed(2)}
                                    </td>
                                    <td className="px-4 py-2.5 text-right text-slate-300" title={trade.amountInWei ? `Wei: ${trade.amountInWei}` : undefined}>
                                        {trade.amount.toFixed(6)}
                                    </td>
                                    <td className="px-4 py-2.5 text-center">
                                        {trade.laneId ? (
                                            <span className={cn(
                                                "px-2 py-0.5 rounded text-[10px] border font-bold uppercase tracking-tighter",
                                                trade.laneId === 1 && "bg-primary/10 border-primary/30 text-primary shadow-glow-sm",
                                                trade.laneId === 2 && "bg-blue-500/10 border-blue-500/30 text-blue-400",
                                                trade.laneId === 3 && "bg-purple-500/10 border-purple-500/30 text-purple-400",
                                                trade.laneId === 4 && "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
                                            )}>
                                                LANE_{trade.laneId.toString().padStart(2, '0')}
                                            </span>
                                        ) : (
                                            <span className="text-slate-700">---</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-2.5 text-right pr-6">
                                        <span className={cn(
                                            "uppercase text-[9px] font-bold tracking-widest",
                                            trade.status === 'filled' ? "text-green-500" : "text-yellow-500 animate-pulse"
                                        )}>
                                            {trade.status}
                                        </span>
                                    </td>
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                    </tbody>
                </table>
                {data.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-48 text-slate-600 gap-2">
                        <List className="w-8 h-8 opacity-20" />
                        <span className="text-[10px] uppercase font-bold tracking-widest">No Active Records Found</span>
                    </div>
                )}
            </div>
        </div>
    );
};
