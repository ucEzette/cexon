"use client";

import React from 'react';
import { Wifi, Globe } from 'lucide-react';

export const Footer = () => {
    return (
        <footer className="h-8 bg-surface-dark border-t border-surface-border flex items-center justify-between px-4 text-[10px] font-mono shrink-0">
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-primary">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                    System Status: 12ms Latency
                </div>
                <div className="text-slate-400">
                    Parallel Lanes: <span className="text-white">4/4 Active</span>
                </div>
                <div className="text-slate-400 hidden sm:block">
                    Build: v2.4.0-rc1
                </div>
            </div>
            <div className="flex items-center gap-4 text-slate-500">
                <div className="flex items-center gap-1.5">
                    <Wifi className="w-3 h-3 text-green-500" />
                    <span className="text-slate-300">Stable Connection</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <Globe className="w-3 h-3" />
                    <span>Server: HK-07</span>
                    <span className="hidden md:inline">24/7 Support</span>
                </div>
            </div>
        </footer>
    );
};
