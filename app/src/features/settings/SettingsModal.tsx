"use client";

import React from 'react';
import { useSettingsStore, GasToken } from './useSettingsStore';
import { X, Check, Fuel, ShieldCheck, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SettingsModal = ({ isOpen, onClose }: SettingsModalProps) => {
    const { gasToken, isSponsored, setGasToken, toggleSponsorship } = useSettingsStore();

    const tokens: { id: GasToken; name: string; icon: string }[] = [
        { id: 'USDC', name: 'USDC (Stablecoin)', icon: 'U' },
        { id: 'TEMPO', name: 'TEMPO', icon: 'T' },
        { id: 'NATIVE', name: 'Native Chain Token', icon: 'N' },
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-md bg-surface-dark border border-surface-border rounded-xl shadow-2xl overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-surface-border">
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                <Fuel className="w-5 h-5 text-primary" />
                                Transaction Settings
                            </h2>
                            <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-8 font-display">
                            {/* Fee Token Selection */}
                            <section className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-semibold text-slate-300">Gas Payment Token</label>
                                    <span className="text-[10px] font-mono text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
                                        TIP-20 ENABLED
                                    </span>
                                </div>
                                <div className="grid gap-2">
                                    {tokens.map((token) => (
                                        <button
                                            key={token.id}
                                            onClick={() => setGasToken(token.id)}
                                            className={cn(
                                                "flex items-center justify-between p-3 rounded-lg border transition-all text-left",
                                                gasToken === token.id
                                                    ? "bg-primary/5 border-primary text-white shadow-glow-sm"
                                                    : "bg-black/40 border-surface-border text-slate-400 hover:border-slate-600"
                                            )}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={cn(
                                                    "w-8 h-8 rounded-full flex items-center justify-center font-bold font-mono text-xs",
                                                    gasToken === token.id ? "bg-primary text-black" : "bg-surface-border text-slate-500"
                                                )}>
                                                    {token.icon}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium">{token.name}</div>
                                                    <div className="text-[10px] opacity-60">Pay for transactions using {token.id}</div>
                                                </div>
                                            </div>
                                            {gasToken === token.id && <Check className="w-4 h-4 text-primary" />}
                                        </button>
                                    ))}
                                </div>
                            </section>

                            {/* Sponsorship Toggle */}
                            <section className="p-4 bg-primary/5 border border-primary/20 rounded-lg space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex gap-2">
                                        <ShieldCheck className="w-5 h-5 text-primary" />
                                        <div>
                                            <div className="text-sm font-bold text-white">Gasless Mode</div>
                                            <div className="text-[10px] text-slate-400">Transactions are sponsored by the Tempo relayer</div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={toggleSponsorship}
                                        className={cn(
                                            "relative w-12 h-6 rounded-full transition-colors focus:outline-none border border-surface-border",
                                            isSponsored ? "bg-primary" : "bg-black"
                                        )}
                                    >
                                        <motion.div
                                            animate={{ x: isSponsored ? 26 : 2 }}
                                            className={cn(
                                                "w-4 h-4 bg-white rounded-full mt-0.5 ml-0.5",
                                                !isSponsored && "bg-slate-600"
                                            )}
                                        />
                                    </button>
                                </div>
                            </section>

                            {/* Session Keys / Passkeys CTA */}
                            <section className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-semibold text-slate-300">Active Sessions</label>
                                    <span className="text-[10px] text-slate-500 font-mono">1 Active</span>
                                </div>
                                <div className="bg-black/40 border border-surface-border rounded-lg p-3 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Zap className="w-4 h-4 text-yellow-500" />
                                        <span className="text-xs text-slate-300">Biometric Signer (iPad Pro)</span>
                                    </div>
                                    <span className="text-[10px] text-green-500 font-mono">CONNECTED</span>
                                </div>
                                <button className="w-full py-2.5 rounded-lg border border-primary/30 text-primary text-xs font-bold hover:bg-primary/5 transition-all">
                                    + CREATE NEW PASSKEY SESSION
                                </button>
                            </section>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
