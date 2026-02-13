"use client";

import React from 'react';
import { motion } from 'framer-motion';
import {
    BookOpen,
    Cpu,
    Zap,
    Shield,
    Code,
    Layers,
    Terminal,
    Fingerprint,
    ExternalLink,
    ChevronRight,
    Search
} from 'lucide-react';
import { cn } from '@/lib/utils';

const Section = ({ title, icon: Icon, children }: { title: string, icon: any, children: React.ReactNode }) => (
    <div className="mb-12">
        <div className="flex items-center gap-3 mb-6 pb-2 border-b border-primary/20">
            <Icon className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-mono font-bold uppercase tracking-widest text-white">{title}</h2>
        </div>
        <div className="space-y-4 text-slate-400 font-sans leading-relaxed">
            {children}
        </div>
    </div>
);

const CodeBlock = ({ label, code }: { label: string, code: string }) => (
    <div className="bg-black/40 border border-white/5 rounded-md p-4 mb-4 font-mono text-xs">
        <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-2 flex justify-between items-center">
            <span>{label}</span>
            <span className="text-primary/40">v1.2.4-stable</span>
        </div>
        <div className="text-primary font-bold break-all">{code}</div>
    </div>
);

export const DocsView = () => {
    return (
        <div className="flex-1 bg-surface-dark overflow-auto custom-scrollbar">
            <div className="max-w-5xl mx-auto px-8 py-12">
                {/* Hero Header */}
                <div className="mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-mono font-bold uppercase tracking-widest mb-6">
                        <BookOpen className="w-3 h-3" /> System Documentation
                    </div>
                    <h1 className="text-5xl font-mono font-900 text-white mb-4 tracking-tighter uppercase italic">
                        Cexon <span className="text-primary">Institutional</span> Terminal
                    </h1>
                    <p className="text-lg text-slate-500 max-w-2xl font-sans">
                        Technical specifications and operational guide for the next generation of high-frequency parallelized DEX trading on the Tempo Network.
                    </p>
                </div>

                <div className="grid grid-cols-12 gap-12">
                    {/* Main Content */}
                    <div className="col-span-12 lg:col-span-8">

                        <Section title="1. Protocol Overview" icon={Cpu}>
                            <p>
                                Cexon is a sovereign trading terminal designed specifically for the Tempo blockchain. Unlike standard EVM trading applications that suffer from sequential processing bottlenecks, Cexon leverages Tempo's unique 4-lane parallel architecture to deliver sub-10ms transaction routing.
                            </p>
                            <p>
                                The "institutional" design philosophy prioritizes data density, security, and autonomous agency, making it the premier choice for high-volume traders and quantitative funds.
                            </p>
                        </Section>

                        <Section title="2. Parallel Execution (2D Nonces)" icon={Layers}>
                            <p>
                                Traditional Ethereum transactions use a linear nonce system, leading to "Head-of-Line" (HoL) blocking. If one transaction is stuck, all subsequent trades are delayed.
                            </p>
                            <div className="grid grid-cols-2 gap-4 my-6">
                                <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
                                    <div className="text-[10px] text-slate-500 uppercase mb-2 font-mono">Standard EVM</div>
                                    <div className="h-2 w-full bg-slate-800 rounded-full mb-2">
                                        <div className="h-full w-1/4 bg-red-500/50 rounded-full" />
                                    </div>
                                    <div className="text-[10px] text-red-400 font-mono">Blocked Flow</div>
                                </div>
                                <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg shadow-glow-sm">
                                    <div className="text-[10px] text-primary/60 uppercase mb-2 font-mono">Cexon Parallel</div>
                                    <div className="space-y-1.5">
                                        {[1, 2, 3, 4].map(l => (
                                            <div key={l} className="h-1.5 w-full bg-primary/10 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ x: '-100%' }}
                                                    animate={{ x: '100%' }}
                                                    transition={{ duration: 1, repeat: Infinity, delay: l * 0.2 }}
                                                    className="h-full w-1/3 bg-primary"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="text-[10px] text-primary font-mono mt-2">Active Multi-Lanes</div>
                                </div>
                            </div>
                            <p>
                                Cexon utilizes **2D Nonces**, where each account has 4 independent lanes (Lanes 0-3). Trades are routed dynamically to the first available lane, enabling concurrent execution of swaps, limit orders, and cancellations.
                            </p>
                        </Section>

                        <Section title="3. Agentic Intelligence" icon={Zap}>
                            <p>
                                Cexon features a built-in "Agent Mode" that acts as an autonomous execution layer.
                            </p>
                            <ul className="list-disc list-inside space-y-2 ml-2">
                                <li>
                                    <span className="text-white font-bold font-mono text-sm">Smart-Split Agent</span>: Automatically detects high-slippage scenarios (>$5,000) and suggests splitting orders across all 4 lanes to minimize price impact.
                                </li>
                                <li>
                                    <span className="text-white font-bold font-mono text-sm">Intent Terminal (Cmd+K)</span>: Power-users can execute complex multi-lane transactions using natural language intents, bypassing manual form input.
                                </li>
                            </ul>
                        </Section>

                        <Section title="4. Smart Contract Registry" icon={Code}>
                            <p>
                                Cexon core protocol contracts are deployed and verified on the Tempo Moderato (Testnet).
                            </p>
                            <CodeBlock label="Lane Manager (Core Engine)" code="0x55129FC022f7F955132f722B70Dc90e97269211c" />
                            <CodeBlock label="Fee Registry (Sponsorship)" code="0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266" />
                            <CodeBlock label="Trading Factory" code="0x70997970C51812dc3A010C7d01b50e0d17dc79C8" />
                        </Section>

                        <Section title="5. Security & Risk Control" icon={Shield}>
                            <p>
                                Institutional trading requires robust safety measures. Cexon includes:
                            </p>
                            <ul className="list-disc list-inside space-y-2 ml-2">
                                <li><span className="text-white font-bold">Privy Auth</span>: Multi-factor authentication with passkey support.</li>
                                <li><span className="text-white font-bold text-red-400">Kill Switch</span>: Global emergency halt that cancels all pending transactions and revokes lane access.</li>
                                <li><span className="text-white font-bold italic font-mono text-sm">2D Nonce Guard</span>: Protects against transaction replay attacks across different execution lanes.</li>
                            </ul>
                        </Section>
                    </div>

                    {/* Sidebar Nav/Info */}
                    <div className="col-span-12 lg:col-span-4">
                        <div className="sticky top-8 space-y-6">
                            <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
                                <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
                                    <Fingerprint className="w-3 h-3" /> Quick Navigation
                                </h3>
                                <div className="space-y-3">
                                    {['Protocol Overview', 'Parallel Execution', 'Agentic Intelligence', 'Smart Contracts', 'Security Controls'].map((item, i) => (
                                        <div key={item} className="flex items-center justify-between group cursor-pointer text-slate-400 hover:text-primary transition-colors">
                                            <span className="text-xs font-mono tracking-tight">{item}</span>
                                            <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all" />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="p-6 bg-primary/10 border border-primary/20 rounded-xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-100 transition-opacity">
                                    <Zap className="w-4 h-4 text-primary fill-primary" />
                                </div>
                                <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-primary mb-2">Technical Specs</h3>
                                <div className="space-y-2 font-mono text-[10px]">
                                    <div className="flex justify-between border-b border-primary/10 pb-1">
                                        <span className="text-primary/60">TPS CAPACITY</span>
                                        <span className="text-white">4,000+ per user</span>
                                    </div>
                                    <div className="flex justify-between border-b border-primary/10 pb-1">
                                        <span className="text-primary/60">LATENCY</span>
                                        <span className="text-white">~450ms (Tempo)</span>
                                    </div>
                                    <div className="flex justify-between border-b border-primary/10 pb-1">
                                        <span className="text-primary/60">ARCHITECTURE</span>
                                        <span className="text-white italic">2D Nonce Non-Blocking</span>
                                    </div>
                                </div>
                                <button className="w-full mt-6 py-2 bg-primary text-black text-[10px] font-bold uppercase tracking-widest hover:shadow-glow-sm transition-all flex items-center justify-center gap-2">
                                    View on Explorer <ExternalLink className="w-3 h-3" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Documentation Info */}
                <div className="mt-24 pt-12 border-t border-surface-border flex flex-col items-center">
                    <img src="/cexonLOGO (1).png" className="h-6 opacity-30 grayscale mb-4" alt="Cexon" />
                    <p className="text-[10px] font-mono text-slate-600 uppercase tracking-[0.3em]">
                        Standard Institutional Trading Agreement v1.0.2
                    </p>
                </div>
            </div>
        </div>
    );
};
