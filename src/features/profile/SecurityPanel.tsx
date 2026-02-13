"use client";

import React from 'react';
import { Smartphone, Monitor, Plus, ShieldCheck } from 'lucide-react';

export const SecurityPanel = () => {
    const devices = [
        { name: 'MacBook Pro - TouchID', lastActive: '2h ago', type: 'desktop' },
        { name: 'iPhone 15 - FaceID', lastActive: 'Active Now', type: 'mobile' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <section>
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-primary font-mono text-[10px] uppercase tracking-[0.3em] font-bold flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4" />
                        Active Session Keys
                    </h3>
                    <button className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/30 text-primary rounded-lg font-mono text-[9px] font-bold uppercase tracking-[0.2em] shadow-glow-sm hover:scale-105 transition-transform">
                        <Plus className="w-3 h-3" />
                        Add New Device
                    </button>
                </div>

                <div className="space-y-4">
                    {devices.map((device, idx) => (
                        <div key={idx} className="bg-[#121212] border border-surface-border rounded-xl p-5 flex items-center justify-between hover:border-primary/30 transition-all">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-black/40 flex items-center justify-center border border-surface-border/50">
                                    {device.type === 'desktop' ? <Monitor className="w-5 h-5 text-slate-400" /> : <Smartphone className="w-5 h-5 text-slate-400" />}
                                </div>
                                <div>
                                    <div className="text-white font-bold text-sm mb-1">{device.name}</div>
                                    <div className="text-slate-500 font-mono text-[9px] uppercase tracking-widest">{device.lastActive}</div>
                                </div>
                            </div>
                            <button className="text-red-500/50 hover:text-red-500 font-mono text-[9px] uppercase tracking-widest font-bold px-3 py-1 hover:bg-red-500/10 rounded transition-all">
                                Revoke
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            <div className="p-6 rounded-xl border border-primary/20 bg-primary/5">
                <h4 className="text-primary font-bold text-sm mb-2 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" />
                    WebAuthn Protected
                </h4>
                <p className="text-slate-400 text-xs leading-relaxed">
                    All session updates require biometric verification or hardware security keys.
                    This node is currently under Level-4 Protocol Isolation.
                </p>
            </div>
        </div>
    );
};
