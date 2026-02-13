"use client";

import React from 'react';
import { Wallet, TrendingUp, History, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useGlobalStore } from '@/store/useGlobalStore';
import { motion } from 'framer-motion';

export const PortfolioView = () => {
    const { userBalance } = useGlobalStore();

    const assets = [
        { name: 'Ethereum', symbol: 'ETH', balance: userBalance.ETH, price: 2412.50, change: 2.4 },
        { name: 'USD Coin', symbol: 'USDC', balance: userBalance.USDC, price: 1.00, change: 0.01 },
    ];

    return (
        <div className="p-8 flex flex-col gap-8 h-full overflow-y-auto custom-scrollbar bg-background-dark/50">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-bold text-white mb-2">Portfolio</h2>
                    <p className="text-slate-500 font-mono text-sm uppercase tracking-widest">Asset Distribution & Performance</p>
                </div>
                <div className="text-right">
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mb-1">Total Net Worth</div>
                    <div className="text-4xl font-bold text-primary font-mono tracking-tighter shadow-glow-sm">
                        ${(userBalance.ETH * 2412.50 + userBalance.USDC).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {assets.map((asset, i) => (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={asset.symbol}
                        className="p-6 rounded-xl bg-surface-dark border border-surface-border hover:border-primary/30 transition-all group"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:scale-110 transition-transform">
                                <Wallet className="w-5 h-5 text-primary" />
                            </div>
                            <div className={asset.change >= 0 ? "text-green-500" : "text-red-500"}>
                                <div className="flex items-center gap-1 text-xs font-bold font-mono">
                                    {asset.change >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                    {Math.abs(asset.change)}%
                                </div>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <div className="text-slate-400 text-xs font-bold uppercase tracking-widest">{asset.name}</div>
                            <div className="text-2xl font-bold text-white font-mono">{asset.balance.toFixed(4)} {asset.symbol}</div>
                            <div className="text-slate-600 font-mono text-[10px]">${(asset.balance * asset.price).toLocaleString()} USD</div>
                        </div>
                    </motion.div>
                ))}

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="p-6 rounded-xl border border-dashed border-primary/20 bg-primary/5 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-primary/10 transition-all group"
                >
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30 group-hover:bg-primary group-hover:text-black transition-all">
                        <TrendingUp className="w-5 h-5" />
                    </div>
                    <span className="text-primary font-mono text-[10px] uppercase font-bold tracking-widest">Connect New Wallet</span>
                </motion.div>
            </div>

            <div className="flex-1 min-h-[400px] border border-surface-border rounded-xl bg-surface-dark/30 p-6">
                <div className="flex items-center gap-3 mb-6">
                    <History className="w-5 h-5 text-slate-500" />
                    <h3 className="text-sm font-bold text-white uppercase tracking-widest">Performance History</h3>
                </div>
                <div className="h-full flex items-center justify-center text-slate-600 font-mono text-xs uppercase tracking-[0.2em]">
                    Historical Data Feed Offline
                </div>
            </div>
        </div>
    );
};
