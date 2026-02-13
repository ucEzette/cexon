"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Command, X, Terminal as TerminalIcon, Sparkles, CornerDownLeft, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLaneManager } from '@/features/lane-manager/useLaneManager';

interface CommandTerminalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const CommandTerminal: React.FC<CommandTerminalProps> = ({ isOpen, onClose }) => {
    const [input, setInput] = useState('');
    const [parsedAction, setParsedAction] = useState<{ type: string; details: string; lanes: number[] } | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const { lanes } = useLaneManager();

    useEffect(() => {
        if (isOpen) {
            inputRef.current?.focus();
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
            setInput('');
            setParsedAction(null);
        }
    }, [isOpen]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setInput(val);

        // Simple mock parsing logic
        if (val.toLowerCase().includes('cancel all')) {
            setParsedAction({
                type: 'CANCEL',
                details: 'Canceling 3 active orders... routing to Lanes 1, 2, and 3.',
                lanes: [1, 2, 3]
            });
        } else if (val.toLowerCase().match(/buy \d+/i) || val.toLowerCase().match(/sell \d+/i)) {
            const match = val.match(/(\d+)/);
            const amount = match ? match[0] : '10';
            const side = val.toLowerCase().includes('buy') ? 'BUY' : 'SELL';
            setParsedAction({
                type: 'EXECUTE',
                details: `Smart-splitting ${amount} ETH ${side} across 4 parallel lanes.`,
                lanes: [1, 2, 3, 4]
            });
        } else {
            setParsedAction(null);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-md"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        className="relative w-full max-w-2xl bg-[#121212] border border-[#00F0FF]/30 rounded-xl shadow-[0_0_50px_rgba(0,240,255,0.15)] overflow-hidden"
                    >
                        <div className="p-4 border-b border-white/5 flex items-center gap-3 bg-black/20">
                            <TerminalIcon className="w-5 h-5 text-[#00F0FF]" />
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={handleInputChange}
                                placeholder="Enter trading intent (e.g., 'Buy 10 ETH' or 'Cancel all')..."
                                className="flex-1 bg-transparent border-none outline-none text-white font-mono text-lg placeholder:text-slate-600 focus:ring-0"
                            />
                            <div className="flex items-center gap-2 px-2 py-1 rounded bg-white/5 border border-white/10 text-[10px] text-slate-400 font-mono">
                                <span className="opacity-60">ESC</span>
                                <span className="opacity-30">TO CANCEL</span>
                            </div>
                        </div>

                        <div className="min-h-[200px] p-6 flex flex-col">
                            {parsedAction ? (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-6"
                                >
                                    <div className="flex items-start gap-4 p-4 rounded-lg bg-[#00F0FF]/5 border border-[#00F0FF]/20">
                                        <div className="mt-1">
                                            <Sparkles className="w-5 h-5 text-[#00F0FF] animate-pulse" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-[10px] text-[#00F0FF] font-bold uppercase tracking-widest mb-1">Agent Intent Parsed</div>
                                            <div className="text-sm text-slate-200 font-mono italic">"{parsedAction.details}"</div>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-3 px-1">LANE ALLOCATION</div>
                                        <div className="flex gap-2">
                                            {[1, 2, 3, 4].map((id) => (
                                                <div
                                                    key={id}
                                                    className={cn(
                                                        "flex-1 h-12 rounded border transition-all duration-500 flex flex-col items-center justify-center gap-1",
                                                        parsedAction.lanes.includes(id)
                                                            ? "bg-[#00F0FF]/10 border-[#00F0FF]/50 shadow-[0_0_15px_rgba(0,240,255,0.2)]"
                                                            : "bg-black/40 border-white/5 opacity-30"
                                                    )}
                                                >
                                                    <div className={cn(
                                                        "text-[9px] font-bold font-mono",
                                                        parsedAction.lanes.includes(id) ? "text-[#00F0FF]" : "text-slate-600"
                                                    )}>LANE 0{id}</div>
                                                    {parsedAction.lanes.includes(id) && (
                                                        <motion.div
                                                            animate={{ opacity: [0.3, 1, 0.3] }}
                                                            transition={{ repeat: Infinity, duration: 1.5 }}
                                                            className="w-full max-w-[80%] h-0.5 bg-[#00F0FF]"
                                                        />
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="pt-2 flex justify-end">
                                        <button className="flex items-center gap-2 px-4 py-2 rounded bg-[#00F0FF] text-black font-bold text-xs uppercase tracking-widest hover:brightness-110 active:scale-[0.98] transition-all">
                                            Confirm Broadcast
                                            <CornerDownLeft className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </motion.div>
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center text-center opacity-40">
                                    <div className="w-12 h-12 rounded-full border border-dashed border-slate-600 flex items-center justify-center mb-4">
                                        <Command className="w-6 h-6 text-slate-500" />
                                    </div>
                                    <div className="text-sm text-slate-400 font-medium mb-1 italic">Waiting for intent...</div>
                                    <div className="text-[10px] text-slate-600 font-mono uppercase tracking-wider">Natural Language Control System v2.4</div>
                                </div>
                            )}
                        </div>

                        <div className="bg-black/40 p-3 px-6 border-t border-white/5 flex items-center justify-between">
                            <div className="flex gap-4">
                                <div className="flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                    <span className="text-[10px] text-slate-500 font-mono uppercase">TEMPO CONNECTED</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <AlertCircle className="w-3 h-3 text-slate-600" />
                                    <span className="text-[10px] text-slate-500 font-mono uppercase">BYPASS MODE ON</span>
                                </div>
                            </div>
                            <div className="text-[9px] text-slate-600 font-mono">© 2026 CEXON SYSTEMS</div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
