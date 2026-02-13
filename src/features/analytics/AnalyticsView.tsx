"use client";

import React from 'react';
import { BarChart3, PieChart, Activity, Zap, Cpu, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export const AnalyticsView = () => {
    return (
        <div className="p-8 flex flex-col gap-8 h-full overflow-y-auto custom-scrollbar bg-background-dark/50">
            <div>
                <h2 className="text-3xl font-bold text-white mb-2">Analytics</h2>
                <p className="text-slate-500 font-mono text-sm uppercase tracking-widest">Real-time Performance Metrics & AI Insights</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Win Rate', value: '72.4%', icon: Activity, color: 'text-green-500' },
                    { label: 'Avg execution', value: '184ms', icon: Zap, color: 'text-primary' },
                    { label: 'Total Volume', value: '$842K', icon: BarChart3, color: 'text-white' },
                    { label: 'Active Agents', value: '04', icon: Cpu, color: 'text-yellow-500' },
                ].map((stat, i) => (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.05 }}
                        key={stat.label}
                        className="p-4 rounded-xl bg-surface-dark border border-surface-border flex flex-col gap-3"
                    >
                        <div className="flex justify-between items-center">
                            <stat.icon className={`w-4 h-4 ${stat.color}`} />
                            <div className="text-[10px] text-slate-600 font-mono text-right">LIVE</div>
                        </div>
                        <div>
                            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{stat.label}</div>
                            <div className="text-2xl font-bold text-white font-mono">{stat.value}</div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-[500px]">
                <div className="lg:col-span-2 rounded-xl border border-surface-border bg-black/30 p-6 flex flex-col">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-2">
                            <Activity className="w-5 h-5 text-primary" />
                            <h3 className="text-xs font-bold text-white uppercase tracking-widest">Profit Attribution</h3>
                        </div>
                        <div className="flex gap-2">
                            {['1H', '24H', '1W', 'ALL'].map(t => (
                                <button key={t} className="px-2 py-1 text-[9px] font-bold font-mono rounded bg-surface-border/30 text-slate-400 hover:text-white transition-colors">{t}</button>
                            ))}
                        </div>
                    </div>
                    <div className="flex-1 flex items-center justify-center border-t border-surface-border/30 border-dashed">
                        <motion.div
                            animate={{ opacity: [0.3, 0.6, 0.3] }}
                            transition={{ duration: 3, repeat: Infinity }}
                            className="text-primary/40 font-mono text-[10px] tracking-[0.3em] uppercase"
                        >
                            Synthesizing Visual Metrics...
                        </motion.div>
                    </div>
                </div>

                <div className="rounded-xl border border-surface-border bg-surface-dark p-6 flex flex-col gap-6">
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-yellow-500" />
                        <h3 className="text-xs font-bold text-white uppercase tracking-widest">AI Agent Insights</h3>
                    </div>

                    <div className="space-y-4">
                        {[
                            "High volatility detected in ETH/USDC. Recommend tightening trailing stops.",
                            "Lane 03 performance optimized. Sequence break risk at 0.02%.",
                            "DEX liquidity aggregation complete. Optimal slippage found on Moderato.",
                            "Account session secured with biometric fingerprint. Identity verified."
                        ].map((insight, i) => (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 + i * 0.1 }}
                                key={i}
                                className="p-3 rounded bg-black/40 border-l border-primary/50 text-[10px] text-slate-400 leading-relaxed font-mono"
                            >
                                <span className="text-primary mr-2">>>></span> {insight}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
