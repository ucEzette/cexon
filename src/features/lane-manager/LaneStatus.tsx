"use client";

import React from 'react';
import { useLaneManager, LaneStatus as LaneStatusType } from './useLaneManager';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

export const LaneStatus = () => {
    const { lanes, syncNonces, isSyncing } = useLaneManager();

    React.useEffect(() => {
        syncNonces();
    }, []);

    return (
        <div className="h-48 border-t border-surface-border bg-surface-dark p-4 flex flex-col gap-3">
            <div className="flex justify-between items-center mb-1">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5 text-primary animate-pulse" />
                    Lane Visualizer
                </h3>
                <span className="text-[10px] font-mono text-slate-500 bg-surface-border/20 px-2 py-0.5 rounded border border-surface-border/30 flex items-center gap-1">
                    <span className={cn("w-1 h-1 rounded-full", isSyncing ? "bg-yellow-500 animate-pulse" : "bg-green-500")} />
                    2D NONCE MODE
                </span>
            </div>

            <div className="flex-1 flex flex-col gap-3 justify-center">
                {lanes.map((lane) => (
                    <div key={lane.id} className="flex items-center gap-3">
                        <span className="text-[10px] font-mono text-slate-500 w-12 text-right">
                            LANE {lane.id.toString().padStart(2, '0')}
                        </span>
                        <div className="flex-1 h-1.5 bg-black rounded-full overflow-hidden relative">
                            {lane.status === 'processing' && (
                                <motion.div
                                    initial={{ width: '0%' }}
                                    animate={{ width: '100%' }}
                                    transition={{ duration: 2, ease: "linear" }}
                                    className="absolute top-0 left-0 h-full bg-yellow-500 shadow-glow-sm rounded-full"
                                />
                            )}
                            {lane.status === 'confirmed' && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="absolute inset-0 bg-primary shadow-glow-sm rounded-full"
                                />
                            )}
                            {lane.status === 'idle' && (
                                <div className="absolute inset-0 bg-green-500/10" />
                            )}
                        </div>
                        <span className={cn(
                            "text-[10px] font-mono w-14 text-right transition-colors",
                            lane.status === 'processing' ? "text-yellow-500" :
                                lane.status === 'confirmed' ? "text-primary font-bold" : "text-slate-600"
                        )}>
                            {lane.status === 'processing' ? '[...]' :
                                lane.status === 'confirmed' ? 'FILL' : `N:${lane.nonce}`}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};
