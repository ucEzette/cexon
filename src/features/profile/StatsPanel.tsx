"use client";

import React from 'react';
import { Activity, Zap, TrendingUp, Grid } from 'lucide-react';

export const StatsPanel = () => {
    const stats = [
        { label: 'Cumulative Volume', value: '$84.2M', icon: Activity, color: 'text-primary' },
        { label: 'Active Grid Bots', value: '12', icon: Grid, color: 'text-blue-500' },
        { label: '30-Day PnL', value: '+$14,240.22', icon: TrendingUp, color: 'text-green-500' },
        { label: 'Preferred Lane', value: 'Lane #02', icon: Zap, color: 'text-yellow-500' },
    ];

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-primary font-mono text-[10px] uppercase tracking-[0.3em] font-bold mb-8">System Analytics (Simulation)</h3>

            <div className="grid grid-cols-2 gap-6">
                {stats.map((stat, idx) => {
                    const Icon = stat.icon;
                    return (
                        <div key={idx} className="bg-[#121212] border border-surface-border rounded-xl p-6 hover:shadow-glow-sm transition-all group">
                            <div className="flex items-center gap-3 mb-4">
                                <div className={cn("p-2 rounded-lg bg-black/40 border border-surface-border/50 transition-colors group-hover:border-primary/50")}>
                                    <Icon className={cn("w-5 h-5", stat.color)} />
                                </div>
                                <span className="text-slate-500 font-mono text-[10px] uppercase tracking-widest">{stat.label}</span>
                            </div>
                            <div className="text-2xl font-bold text-white font-mono tracking-tight">{stat.value}</div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-8 p-6 bg-surface-dark/50 border border-surface-border rounded-xl">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-slate-400 text-xs font-mono uppercase tracking-widest">Execution Efficiency</span>
                    <span className="text-primary font-bold font-mono">99.98%</span>
                </div>
                <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden border border-surface-border/50">
                    <div className="h-full bg-primary w-[99.98%] shadow-glow" />
                </div>
            </div>
        </div>
    );
};

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');
