"use client";

import React, { useState } from 'react';
import { Zap, Settings as SettingsIcon, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export const PreferencesPanel = () => {
    const [gasToken, setGasToken] = useState('USDC');
    const [slippage, setSlippage] = useState('0.5');

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <section>
                <h3 className="text-primary font-mono text-[10px] uppercase tracking-[0.3em] font-bold mb-6 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-500" />
                    Execution Constraints
                </h3>

                <div className="grid grid-cols-1 gap-6">
                    <div className="bg-[#121212] border border-surface-border rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h4 className="text-white font-bold text-sm flex items-center gap-2">
                                    Gas Payment Preference
                                    <HelpCircle className="w-3 h-3 text-slate-600" />
                                </h4>
                                <p className="text-slate-500 text-[11px] mt-1">Select the asset used to settle protocol fees.</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            {['USDC', 'USDT', 'TMP'].map((token) => (
                                <button
                                    key={token}
                                    onClick={() => setGasToken(token)}
                                    className={cn(
                                        "flex-1 py-3 rounded-lg border font-mono text-[10px] font-bold uppercase transition-all",
                                        gasToken === token
                                            ? "bg-primary text-black border-primary shadow-glow-sm"
                                            : "bg-black/40 border-surface-border text-slate-500 hover:text-white"
                                    )}
                                >
                                    {token}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-[#121212] border border-surface-border rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h4 className="text-white font-bold text-sm">Default Slippage Tolerance</h4>
                                <p className="text-slate-500 text-[11px] mt-1">Maximum price deviation for orders to execute.</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="relative flex-1">
                                <input
                                    type="text"
                                    value={slippage}
                                    onChange={(e) => setSlippage(e.target.value)}
                                    className="w-full bg-black/60 border border-surface-border/50 rounded-lg py-3 px-4 text-white font-mono text-sm focus:outline-none focus:border-primary/50 transition-all"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-primary font-bold font-mono">%</span>
                            </div>
                            <div className="flex gap-1">
                                {['0.1', '0.5', '1.0'].map(val => (
                                    <button
                                        key={val}
                                        onClick={() => setSlippage(val)}
                                        className="px-4 py-3 bg-white/5 hover:bg-white/10 rounded-lg text-white font-mono text-[10px] transition-all"
                                    >
                                        {val}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
