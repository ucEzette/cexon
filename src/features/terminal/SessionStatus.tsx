"use client";

import React from 'react';
import { Shield, Key, Fingerprint, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

import { usePrivy } from '@privy-io/react-auth';

export const SessionStatus = () => {
    const { authenticated } = usePrivy();
    const isActive = authenticated;

    return (
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-full border backdrop-blur-md shadow-glow-sm transition-all",
                    isActive
                        ? "bg-green-500/10 border-green-500/30 text-green-400"
                        : "bg-yellow-500/10 border-yellow-500/30 text-yellow-400"
                )}
            >
                {isActive ? (
                    <>
                        <Fingerprint className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-bold tracking-wider font-mono uppercase">Session Secured</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    </>
                ) : (
                    <>
                        <Shield className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-bold tracking-wider font-mono uppercase">Create Session</span>
                    </>
                )}
            </motion.div>
        </div>
    );
};
