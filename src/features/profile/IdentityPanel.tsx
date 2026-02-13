"use client";

import React from 'react';
import { Copy, AlertTriangle, Key } from 'lucide-react';
import { usePrivy } from '@privy-io/react-auth';

export const IdentityPanel = () => {
    const { user } = usePrivy();
    const address = user?.wallet?.address || '0x0000...0000';

    const handleCopy = () => {
        navigator.clipboard.writeText(address);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <section>
                <h3 className="text-primary font-mono text-[10px] uppercase tracking-[0.3em] font-bold mb-6 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    Identity Node
                </h3>

                <div className="bg-[#121212] border border-surface-border rounded-xl p-8 hover:border-primary/20 transition-all shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Key className="w-24 h-24 text-primary" />
                    </div>

                    <div className="relative z-10">
                        <label className="text-slate-500 font-mono text-[10px] uppercase tracking-widest mb-3 block">Embedded Wallet Address</label>
                        <div className="flex items-center gap-4 bg-black/40 border border-surface-border/50 rounded-lg p-4 font-mono">
                            <span className="text-white text-lg font-bold tracking-tight">{address}</span>
                            <button
                                onClick={handleCopy}
                                className="p-2 hover:bg-primary/20 rounded-md transition-all text-primary"
                            >
                                <Copy className="w-4 h-4" />
                            </button>
                        </div>
                        <p className="mt-4 text-slate-500 text-[11px] leading-relaxed">
                            This is your primary non-custodial destination for all Cexon terminal transactions.
                            Fully secured via Privy infrastructure.
                        </p>
                    </div>
                </div>
            </section>

            <section>
                <h3 className="text-red-500 font-mono text-[10px] uppercase tracking-[0.3em] font-bold mb-6">Critical Actions</h3>
                <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-8">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-red-500/10 rounded-lg border border-red-500/30">
                            <AlertTriangle className="text-red-500 w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="text-white font-bold mb-2">Export Private Key</h4>
                            <p className="text-slate-500 text-xs mb-6 leading-relaxed">
                                Access the raw private key of your embedded wallet. Never share this with anyone.
                                Support will never ask for your private key.
                            </p>
                            <button className="px-6 py-2.5 bg-red-500/10 border border-red-500/50 text-red-500 rounded font-mono text-[10px] font-bold uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">
                                Reveal Private Key
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
