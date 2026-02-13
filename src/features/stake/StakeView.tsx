"use client";

import React from 'react';
import { Lock, Timer, Info, Sparkles, Coins } from 'lucide-react';
import { motion } from 'framer-motion';

export const StakeView = () => {
    return (
        <div className="p-8 flex flex-col gap-8 h-full overflow-y-auto custom-scrollbar bg-background-dark/50">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-bold text-white mb-2">Stake</h2>
                    <p className="text-slate-500 font-mono text-sm uppercase tracking-widest">Protocol Governance & Yield Aggregation</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-8 rounded-2xl bg-surface-dark border border-surface-border flex flex-col gap-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                        <Coins className="w-32 h-32" />
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                            <Lock className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Staked Balance</div>
                            <div className="text-3xl font-bold text-white font-mono">1,240.00 <span className="text-primary">USDC</span></div>
                        </div>
                    </div>

                    <div className="space-y-4 pt-4">
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-500 uppercase font-bold tracking-widest flex items-center gap-2">
                                <Timer className="w-3 h-3" /> Lock Duration
                            </span>
                            <span className="text-white font-mono font-bold">Ended</span>
                        </div>
                        <div className="h-1.5 w-full bg-black rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: '100%' }}
                                className="h-full bg-primary shadow-glow-sm"
                            />
                        </div>
                    </div>

                    <button className="w-full py-4 bg-primary text-black font-bold font-mono text-xs uppercase tracking-[0.2em] rounded-lg shadow-glow hover:scale-[1.02] transition-transform">
                        Withdraw USDC
                    </button>
                    <p className="text-[9px] text-slate-600 text-center font-mono italic">Early withdrawal incurs a 15% penalty fee dedicated to Fee Sponsorship pool.</p>
                </div>

                <div className="space-y-6">
                    <div className="p-6 rounded-2xl bg-primary/5 border border-primary/20 flex flex-col gap-4">
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-yellow-500" />
                            <h3 className="text-sm font-bold text-white uppercase tracking-widest">Rewards Pool</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl bg-black/40">
                                <div className="text-[9px] text-slate-500 font-bold uppercase mb-1">Current APY</div>
                                <div className="text-xl font-bold text-green-500 font-mono">18.4%</div>
                            </div>
                            <div className="p-4 rounded-xl bg-black/40">
                                <div className="text-[9px] text-slate-500 font-bold uppercase mb-1">Accrued (USDC)</div>
                                <div className="text-xl font-bold text-white font-mono">42.50</div>
                            </div>
                        </div>
                        <button className="w-full py-2 border border-primary/30 text-primary font-bold text-[10px] uppercase tracking-widest rounded hover:bg-primary/10 transition-colors">
                            Claim Rewards
                        </button>
                    </div>

                    <div className="p-6 rounded-2xl bg-surface-dark border border-surface-border">
                        <div className="flex items-center gap-2 mb-4">
                            <Info className="w-5 h-5 text-slate-500" />
                            <h3 className="text-[10px] font-bold text-white uppercase tracking-widest">Protocol Stats</h3>
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between text-[11px] font-mono">
                                <span className="text-slate-500">Total USDC Locked</span>
                                <span className="text-slate-300">14.2M</span>
                            </div>
                            <div className="flex justify-between text-[11px] font-mono">
                                <span className="text-slate-500">Governance Power</span>
                                <span className="text-slate-300">0.0086%</span>
                            </div>
                            <div className="flex justify-between text-[11px] font-mono">
                                <span className="text-slate-500">Fee Distribution</span>
                                <span className="text-slate-300">Automated</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
