"use client";

import React, { useState } from 'react';
import { Shield, X, Monitor, Smartphone, Fingerprint, Search, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToastStore } from '@/store/useToastStore';

interface PasskeyManagerProps {
    isOpen: boolean;
    onClose: () => void;
}

export const PasskeyManager = ({ isOpen, onClose }: PasskeyManagerProps) => {
    const [isScanning, setIsScanning] = useState(false);
    const { addToast } = useToastStore();

    const handleAddPasskey = () => {
        setIsScanning(true);
        // Simulate biometric capture
        setTimeout(() => {
            setIsScanning(false);
            addToast('Passkey Verified & Securely Stored', 'success');
            onClose();
        }, 2500);
    };

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
                        className="w-full max-w-md bg-surface-dark/90 backdrop-blur-xl border border-surface-border rounded-xl shadow-2xl p-6 relative overflow-hidden"
                    >
                        {/* High-tech Scanning Overlay */}
                        <AnimatePresence>
                            {isScanning && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 z-50 bg-black/90 flex flex-col items-center justify-center gap-6"
                                >
                                    <div className="relative">
                                        <motion.div
                                            animate={{
                                                scale: [1, 1.2, 1],
                                                opacity: [0.3, 1, 0.3]
                                            }}
                                            transition={{ duration: 1.5, repeat: Infinity }}
                                            className="absolute inset-x-[-20px] top-0 h-1 bg-primary blur-sm shadow-glow"
                                        />
                                        <Fingerprint className="w-16 h-16 text-primary animate-pulse" />

                                        {/* Scanning Grid Effect */}
                                        <div className="absolute inset-0 border border-primary/20 bg-grid-primary/[0.05] pointer-events-none" />
                                    </div>

                                    <div className="text-center space-y-1">
                                        <div className="text-primary font-mono text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                                            <Loader2 className="w-3 h-3 animate-spin" />
                                            Authenticating Session...
                                        </div>
                                        <div className="text-[10px] text-slate-500 font-mono">ENCRYPTED END-TO-END VIA TEMPO KERNEL</div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>

                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                <Shield className="w-5 h-5 text-primary" />
                                Security & Devices
                            </h2>
                            <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="mb-6">
                            <div className="text-[10px] font-mono text-slate-400 mb-3 uppercase tracking-wider font-bold">Active Sessions</div>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 rounded-lg bg-black/40 border border-surface-border group hover:border-primary/30 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded bg-surface-border/30 flex items-center justify-center">
                                            <Monitor className="w-4 h-4 text-slate-400" />
                                        </div>
                                        <div>
                                            <div className="text-sm text-white font-medium">MacBook Pro M2</div>
                                            <div className="text-[10px] text-green-500 font-mono flex items-center gap-1">
                                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> Active Now
                                            </div>
                                        </div>
                                    </div>
                                    <button className="text-[10px] text-slate-500 hover:text-red-400 font-mono font-bold transition-colors">REVOKE</button>
                                </div>

                                <div className="flex items-center justify-between p-3 rounded-lg bg-black/40 border border-surface-border group hover:border-primary/30 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded bg-surface-border/30 flex items-center justify-center">
                                            <Smartphone className="w-4 h-4 text-slate-400" />
                                        </div>
                                        <div>
                                            <div className="text-sm text-white font-medium">iPhone 15 Pro</div>
                                            <div className="text-[10px] text-slate-500 font-mono">Last seen 2h ago</div>
                                        </div>
                                    </div>
                                    <button className="text-[10px] text-slate-500 hover:text-red-400 font-mono font-bold transition-colors">REVOKE</button>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleAddPasskey}
                            disabled={isScanning}
                            className="w-full py-4 bg-primary/10 hover:bg-primary/20 border border-primary/30 hover:border-primary text-primary hover:text-white rounded-lg transition-all group relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity blur-md"></div>
                            <div className="relative flex items-center justify-center gap-3 font-mono font-bold text-xs uppercase tracking-widest">
                                <Fingerprint className="w-5 h-5" />
                                Add New Passkey
                            </div>
                        </button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
