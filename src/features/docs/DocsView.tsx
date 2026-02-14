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
    Activity,
    MousePointer2,
    Lock,
    Globe,
    Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

const Section = ({ title, icon: Icon, children, id }: { title: string, icon: any, children: React.ReactNode, id?: string }) => (
    <div className="mb-16 scroll-mt-20" id={id}>
        <div className="flex items-center gap-3 mb-6 pb-2 border-b border-primary/20">
            <Icon className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-mono font-bold uppercase tracking-[0.15em] text-white">{title}</h2>
        </div>
        <div className="space-y-6 text-slate-400 font-sans leading-relaxed text-base">
            {children}
        </div>
    </div>
);

const CodeBlock = ({ label, code }: { label: string, code: string }) => (
    <div className="bg-black/60 border border-white/10 rounded-lg p-5 mb-6 font-mono text-sm relative group">
        <div className="text-[10px] text-primary/40 uppercase tracking-widest mb-3 flex justify-between items-center">
            <span>{label}</span>
            <span className="opacity-0 group-hover:opacity-100 transition-opacity">PROD-SIGNED</span>
        </div>
        <div className="text-white font-bold break-all selection:bg-primary selection:text-black">{code}</div>
        <div className="absolute right-4 bottom-4">
            <ExternalLink className="w-3.5 h-3.5 text-slate-600 group-hover:text-primary transition-colors cursor-pointer" />
        </div>
    </div>
);

const FeatureCard = ({ icon: Icon, title, description }: { icon: any, title: string, description: string }) => (
    <div className="p-5 rounded-xl bg-white/5 border border-white/10 hover:border-primary/30 transition-all hover:bg-white/[0.07] group">
        <Icon className="w-6 h-6 text-primary mb-4 group-hover:scale-110 transition-transform" />
        <h4 className="text-white font-bold mb-2 uppercase tracking-wide text-sm">{title}</h4>
        <p className="text-xs text-slate-500 leading-normal">{description}</p>
    </div>
);

export const DocsView = () => {
    return (
        <div className="flex-1 bg-[#050505] overflow-auto custom-scrollbar">
            <div className="max-w-6xl mx-auto px-6 lg:px-12 py-16 lg:py-24">
                {/* Hero section */}
                <div className="mb-24 relative">
                    <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/10 blur-[120px] rounded-full pointer-events-none" />

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative z-10"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-mono font-bold uppercase tracking-[0.2em] mb-8">
                            <Activity className="w-3 h-3 animate-pulse" /> Protocol v2.5.0-TEMPO
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-mono font-900 text-white mb-6 tracking-tighter uppercase italic leading-[0.9]">
                            The <span className="text-primary drop-shadow-glow">Sovereign</span><br />
                            Trading Layer
                        </h1>
                        <p className="text-xl text-slate-400 max-w-2xl font-sans leading-relaxed">
                            Cexon is the first institutional-grade trading terminal optimized for parallelized state execution. By utilizing 2D nonces on the Tempo Network, we eliminate Head-of-Line blocking and enable atomic multi-lane swaps via autonomous agents.
                        </p>
                    </motion.div>
                </div>

                <div className="grid grid-cols-12 gap-16">
                    {/* Main Content */}
                    <div className="col-span-12 lg:col-span-8">

                        <Section title="01. The Architecture" icon={Cpu} id="protocol">
                            <p>
                                Modern trading requires more than just a faster interface; it requires a fundamental rethink of how blockchains process intent. Cexon is built on the <span className="text-white font-bold">Tempo Virtual Machine (TVM)</span>, which supports native transaction parallelization.
                            </p>
                            <p>
                                Unlike sequential chains (like Ethereum) where a single failed or underpriced transaction can stall an entire account, Cexon users can broadcast up to 4 concurrent transaction streams. Each stream, or "Lane", operates with its own nonce sequence, ensuring that liquidity can be seized across multiple pools simultaneously.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                                <FeatureCard
                                    icon={Layers}
                                    title="2D Nonce System"
                                    description="Concurrent sequence tracking that allows four independent transaction pipelines per wallet."
                                />
                                <FeatureCard
                                    icon={Zap}
                                    title="Sub-ms Latency"
                                    description="Optimized routing directly to Moderato nodes, bypassing public RPC congestion."
                                />
                            </div>
                        </Section>

                        <Section title="02. Non-Blocking Execution" icon={Activity} id="parallel">
                            <h3 className="text-white font-bold text-lg mb-4">Eliminating Head-of-Line Blocking</h3>
                            <p>
                                In traditional DeFi, a single "Swap" and a "Cancel" cannot happen at the exact same moment if they originate from the same account. Cexon solves this by mapping user intents to Execution Lanes.
                            </p>

                            <div className="bg-black/40 border border-white/5 rounded-xl p-8 my-8 overflow-hidden relative group">
                                <div className="flex flex-col gap-6">
                                    {[0, 1, 2, 3].map(lane => (
                                        <div key={lane} className="relative">
                                            <div className="flex justify-between items-center mb-2 text-[10px] uppercase font-mono tracking-widest">
                                                <span className="text-primary/60">Lane 0x0{lane}</span>
                                                <span className="text-slate-500 italic">Sequence Active</span>
                                            </div>
                                            <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-white/5">
                                                <motion.div
                                                    animate={{
                                                        x: ['-100%', '200%'],
                                                        opacity: [0, 1, 0]
                                                    }}
                                                    transition={{
                                                        duration: 2,
                                                        repeat: Infinity,
                                                        delay: lane * 0.4,
                                                        ease: "linear"
                                                    }}
                                                    className="h-full w-24 bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_15px_rgba(34,211,238,0.5)]"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="absolute top-0 right-0 p-4">
                                    <div className="flex items-center gap-2 text-[10px] font-mono text-green-500 bg-green-500/10 px-2 py-1 rounded border border-green-500/20">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                        Concurrent Throughput
                                    </div>
                                </div>
                            </div>

                            <p>
                                When you trigger a trade, the Cexon Lane Manager identifies the first idle lane and attaches the relevant sequence number. This allows for complex strategies, such as "Stop-Loss" orders being processed on Lane 3 while a "Market Buy" is executing on Lane 0.
                            </p>
                        </Section>

                        <Section title="03. Agentic Intelligence" icon={Sparkles} id="agent">
                            <p>
                                The terminal includes a native AI agent designed for high-stakes execution. This is not a chat bot, but a co-processor that monitors mempool health and liquidity depth.
                            </p>

                            <div className="space-y-4 py-4">
                                <div className="flex gap-4 items-start bg-white/5 p-5 rounded-lg border border-white/10 group hover:border-primary/40 transition-colors">
                                    <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                                        <MousePointer2 className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <h5 className="text-white font-bold mb-1 text-sm uppercase tracking-wide">Smart-Split Logic</h5>
                                        <p className="text-xs text-slate-500 leading-normal">
                                            Large orders are automatically fragmented across all 4 lanes. If you buy 100 ETH, the agent can split it into 4x 25 ETH chunks executed simultaneously across different pools to minimize slippage and sandwich risk.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-4 items-start bg-white/5 p-5 rounded-lg border border-white/10 group hover:border-primary/40 transition-colors">
                                    <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                                        <Terminal className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <h5 className="text-white font-bold mb-1 text-sm uppercase tracking-wide">Intent Terminal (Cmd+K)</h5>
                                        <p className="text-xs text-slate-500 leading-normal">
                                            Bypass buttons and sliders. Typed commands like "Buy 5 ETH" or "Emergency Cancel" are parsed into atomic transactions. The terminal understands decimals, pairs, and split-routing directives.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Section>

                        <Section title="04. Core Registries" icon={Code} id="contracts">
                            <p>
                                Transparency is core to the sovereignty of the Cexon terminal. All core logic is deployed via immutable factory contracts on the Moderato network.
                            </p>
                            <CodeBlock label="Lane Manager (Parallel Engine)" code="0x289745dBD8926017e99990374e207908B129fcCf" />
                            <CodeBlock label="cUSDC Mintable Anchor" code="0xa4269e802A38318D166810fF071AcC8Bce99D1Cc" />
                            <CodeBlock label="cETH Wrapped Anchor" code="0xC08b35520D8413626778D4796395b0DFFCB94C8b" />
                            <p className="text-xs italic text-slate-600">
                                Note: These addresses are project-owned and managed by the Cexon multisig to ensure liquidity depth and oracle accuracy.
                            </p>
                        </Section>

                        <Section title="05. Security Protocols" icon={Shield} id="security">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-center bg-red-500/5 border border-red-500/20 rounded-xl p-8">
                                <div>
                                    <h4 className="text-red-500 font-bold mb-4 flex items-center gap-2 uppercase tracking-widest text-sm">
                                        <Lock className="w-4 h-4" /> The Kill Switch
                                    </h4>
                                    <p className="text-xs text-slate-400 leading-relaxed">
                                        Developed for high-frequency algorithmic failures, the Kill Switch (Global Emergency Halt) provides a one-click revocation of all lane authorizations. It locks the terminal state and ensures no further transactions can be signed until a manual reset is performed.
                                    </p>
                                </div>
                                <div className="flex justify-center">
                                    <div className="w-24 h-24 rounded-full border-4 border-red-500/20 flex items-center justify-center relative">
                                        <div className="w-16 h-16 rounded-full bg-red-500/20 animate-ping absolute" />
                                        <Shield className="w-10 h-10 text-red-500" />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8">
                                <h3 className="text-white font-bold mb-4">Passkey MFA</h3>
                                <p>
                                    Cexon integrates Privy Native Auth, allowing users to secure their session balances via hardware biometrics (FaceID, TouchID). This ensures that even if local session keys are compromised, the ability to "Withdraw" or "Provision High-Value Liquidity" remains protected by physical device security.
                                </p>
                            </div>
                        </Section>
                    </div>

                    {/* Sidebar */}
                    <div className="col-span-12 lg:col-span-4">
                        <div className="sticky top-24 space-y-8">
                            <nav className="p-6 bg-white/[0.03] border border-white/5 rounded-2xl backdrop-blur-md">
                                <h3 className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-slate-500 mb-6 px-2">Index</h3>
                                <div className="space-y-1">
                                    {[
                                        { id: 'protocol', label: 'Protocol Architecture', icon: Cpu },
                                        { id: 'parallel', label: 'Parallel Execution', icon: Activity },
                                        { id: 'agent', label: 'Agent Intelligence', icon: Sparkles },
                                        { id: 'contracts', label: 'Registry Info', icon: Code },
                                        { id: 'security', label: 'Security Systems', icon: Shield }
                                    ].map((item) => (
                                        <a
                                            key={item.id}
                                            href={`#${item.id}`}
                                            className="flex items-center justify-between p-3 rounded-lg group hover:bg-white/5 transition-all"
                                        >
                                            <div className="flex items-center gap-3">
                                                <item.icon className="w-3.5 h-3.5 text-slate-500 group-hover:text-primary transition-colors" />
                                                <span className="text-xs text-slate-400 group-hover:text-white transition-colors">{item.label}</span>
                                            </div>
                                            <ChevronRight className="w-3.5 h-3.5 text-slate-700 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all" />
                                        </a>
                                    ))}
                                </div>
                            </nav>

                            <div className="p-6 bg-gradient-to-br from-primary/20 to-blue-600/10 border border-primary/20 rounded-2xl relative overflow-hidden group">
                                <Globe className="absolute -bottom-8 -right-8 w-32 h-32 text-primary/5 group-hover:text-primary/10 transition-colors" />
                                <h4 className="text-[10px] font-mono font-bold text-primary uppercase tracking-widest mb-4">Network Status</h4>
                                <div className="space-y-4 relative z-10">
                                    <div className="flex justify-between items-center text-[11px] font-mono">
                                        <span className="text-slate-500 uppercase">Provider</span>
                                        <span className="text-white">Tempo Moderato</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[11px] font-mono">
                                        <span className="text-slate-500 uppercase">Sync Status</span>
                                        <span className="text-green-500 font-bold uppercase">Optimized</span>
                                    </div>
                                    <button className="w-full py-3 bg-primary text-black text-[10px] font-bold uppercase tracking-widest rounded transition-all hover:shadow-glow active:scale-95">
                                        Verify Chain ID: 42431
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-32 pt-16 border-t border-white/5 flex flex-col items-center">
                    <img src="/cexonLOGO (1).png" className="h-10 opacity-20 grayscale mb-6" alt="Cexon" />
                    <div className="text-[10px] font-mono text-slate-600 uppercase tracking-[0.5em] text-center max-w-sm">
                        Cexon Institutional Protocol<br />Standard Operating License v1.02.4
                    </div>
                </div>
            </div>
        </div>
    );
};
