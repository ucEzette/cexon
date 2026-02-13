"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, Zap, Target } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLaneManager } from '@/features/lane-manager/useLaneManager';
import { useToastStore } from '@/store/useToastStore';

interface SmartSplitAgentProps {
    amount: number;
    price: number;
    side: 'buy' | 'sell';
    onSplit: (splitAmount: number) => void;
}

export const SmartSplitAgent: React.FC<SmartSplitAgentProps> = ({ amount, price, side, onSplit }) => {
    const { addToast } = useToastStore.getState();
    const usdValue = amount * price;
    const isVisible = usdValue >= 5000;

    const handleAutoSplit = () => {
        const splitAmount = amount / 4;
        addToast(`Agent Logic: Parallelizing ${side} order across 4 lanes.`, 'info');
        onSplit(splitAmount);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ height: 0, opacity: 0, marginBottom: 0 }}
                    animate={{ height: 'auto', opacity: 1, marginBottom: 16 }}
                    exit={{ height: 0, opacity: 0, marginBottom: 0 }}
                    className="overflow-hidden"
                >
                    <div className="bg-[#121212]/80 border border-[#00F0FF]/30 rounded-lg p-4 backdrop-blur-md relative overflow-hidden group">
                        {/* Background subtle glow */}
                        <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Zap className="w-12 h-12 text-[#00F0FF]" />
                        </div>

                        <div className="flex items-start gap-3 relative z-10">
                            <div className="mt-0.5">
                                <div className="w-8 h-8 rounded-lg bg-[#00F0FF]/10 flex items-center justify-center border border-[#00F0FF]/20">
                                    <Sparkles className="w-4 h-4 text-[#00F0FF] animate-pulse" />
                                </div>
                            </div>

                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-[10px] text-[#00F0FF] font-bold uppercase tracking-widest">Slippage Killer Agent</span>
                                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                                </div>
                                <p className="text-[11px] text-slate-300 font-medium leading-relaxed mb-3 font-display">
                                    High slippage detected ($<span className="text-white font-mono">{usdValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>). Agent recommends splitting this trade into <span className="text-[#00F0FF] font-bold">4 parallel lanes</span> to minimize price impact.
                                </p>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={handleAutoSplit}
                                        className="flex items-center gap-2 px-3 py-1.5 rounded bg-[#00F0FF]/10 border border-[#00F0FF]/30 text-[#00F0FF] text-[10px] font-bold uppercase tracking-widest hover:bg-[#00F0FF] hover:text-black transition-all active:scale-[0.98]"
                                    >
                                        Auto-Split Execution
                                        <ArrowRight className="w-3 h-3" />
                                    </button>
                                    <button className="text-[9px] text-slate-500 font-bold uppercase tracking-widest hover:text-slate-300 transition-colors">
                                        Dismiss
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Lane visual preview */}
                        <div className="mt-3 flex gap-1 h-1 w-full opacity-40">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="flex-1 rounded-full bg-[#00F0FF]" />
                            ))}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
