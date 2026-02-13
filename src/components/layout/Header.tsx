"use client";

import React, { useState, useEffect } from 'react';
import { useGlobalStore } from '@/store/useGlobalStore';
import { useSettingsStore } from '@/features/settings/useSettingsStore';
import { PasskeyManager } from '@/features/passkey/PasskeyManager';
import { ChevronDown, Cpu, FlaskConical, Sparkles, Coins, ShieldAlert, Command } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

import { useNavigationStore, ViewType } from '@/store/useNavigationStore';
import { usePrivy } from '@privy-io/react-auth';
import { CommandTerminal } from '@/features/terminal/CommandTerminal';

export const Header = () => {
    const { login, authenticated, user, logout } = usePrivy();
    const { userBalance, mintDemoTokens, toggleKillSwitch, isKillSwitchActive } = useGlobalStore();
    const { gasToken, isSponsored, setGasToken } = useSettingsStore();
    const { activeView, setActiveView } = useNavigationStore();
    const [isPasskeyOpen, setIsPasskeyOpen] = useState(false);
    const [isGasDropdownOpen, setIsGasDropdownOpen] = useState(false);
    const [isTerminalOpen, setIsTerminalOpen] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsTerminalOpen(prev => !prev);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const truncatedAddress = user?.wallet?.address
        ? `${user.wallet.address.slice(0, 6)}...${user.wallet.address.slice(-4)}`
        : 'Connect';

    const navItems: ViewType[] = ['Trading', 'Portfolio', 'Analytics', 'Stake'];

    return (
        <header className="h-14 border-b border-surface-border bg-surface-dark/80 backdrop-blur-md flex items-center justify-between px-6 z-50 shrink-0 sticky top-0">
            <div className="flex items-center gap-8">
                <div className="flex items-center gap-3">
                    <div className="h-9 flex items-center">
                        <img
                            src="/cexonLOGO (1).png"
                            className="h-full w-auto object-contain filter drop-shadow-glow z-50 pointer-events-none"
                            alt="Cexon Terminal"
                        />
                    </div>
                </div>

                <nav className="hidden lg:flex items-center gap-6 text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-slate-500">
                    {navItems.map((item) => (
                        <button
                            key={item}
                            onClick={() => setActiveView(item)}
                            className={cn(
                                "py-1 transition-colors relative",
                                activeView === item
                                    ? "text-primary shadow-glow-sm"
                                    : "hover:text-white"
                            )}
                        >
                            {item}
                            {activeView === item && (
                                <motion.div
                                    layoutId="headerNav"
                                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary shadow-glow-sm"
                                />
                            )}
                        </button>
                    ))}
                </nav>
            </div>

            <div className="flex items-center gap-6 text-xs font-mono">
                {/* Command Terminal Trigger */}
                <button
                    onClick={() => setIsTerminalOpen(true)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded bg-white/5 border border-white/10 text-slate-400 hover:text-primary hover:border-primary/50 transition-all group"
                >
                    <Command className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-bold uppercase tracking-widest hidden sm:inline">TERMINAL</span>
                    <div className="flex items-center gap-1 px-1 py-0.5 rounded bg-black/40 border border-white/5 text-[8px] opacity-60 group-hover:opacity-100">
                        <span>⌘</span>
                        <span>K</span>
                    </div>
                </button>

                {/* Wallet / Privy Status */}
                <div
                    onClick={() => !authenticated ? login() : setIsPasskeyOpen(true)}
                    className={cn(
                        "flex items-center gap-2 px-3 py-1.5 rounded border transition-all cursor-pointer group",
                        authenticated
                            ? "bg-primary/10 border-primary/30"
                            : "bg-surface-border/30 border-surface-border/50 hover:border-primary/30"
                    )}
                >
                    <span className="relative flex h-2 w-2">
                        {authenticated && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>}
                        <span className={cn(
                            "relative inline-flex rounded-full h-2 w-2",
                            authenticated ? "bg-green-500" : "bg-slate-500"
                        )}></span>
                    </span>
                    <span className="text-slate-400 group-hover:text-slate-300 uppercase tracking-tighter text-[9px] font-bold">
                        {authenticated ? 'WALLET' : 'AUTH'}
                    </span>
                    <span className="text-white font-bold tracking-tight">
                        {truncatedAddress}
                    </span>
                </div>

                {/* Gas / Testnet Tools Dropdown */}
                <div className="relative">
                    <div
                        onClick={() => setIsGasDropdownOpen(!isGasDropdownOpen)}
                        className={cn(
                            "flex items-center gap-2 px-3 py-1.5 rounded bg-surface-border/30 border transition-all cursor-pointer group",
                            isGasDropdownOpen ? "border-primary/50" : "border-surface-border/50 hover:border-primary/30"
                        )}
                    >
                        <span className="text-slate-400">GAS:</span>
                        <span className="text-primary font-bold">{isSponsored ? 'FREE' : gasToken}</span>
                        <ChevronDown className={cn("w-3.5 h-3.5 text-slate-500 transition-transform", isGasDropdownOpen && "rotate-180")} />
                    </div>

                    {isGasDropdownOpen && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={() => setIsGasDropdownOpen(false)} />
                            <div className="absolute top-full right-0 mt-2 w-64 bg-surface-dark border border-surface-border rounded-lg shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                <div className="p-3 border-b border-surface-border/50 bg-black/20">
                                    <div className="text-[10px] uppercase text-slate-500 font-bold tracking-widest mb-3 flex items-center gap-2">
                                        <Coins className="w-3 h-3" /> Mainnet Assets
                                    </div>
                                    <div className="flex justify-between items-center mb-1.5 px-1">
                                        <span className="text-white font-medium">ETH</span>
                                        <span className="text-slate-300">{userBalance.ETH.toFixed(4)}</span>
                                    </div>
                                    <div className="flex justify-between items-center px-1">
                                        <span className="text-white font-medium">USDC</span>
                                        <span className="text-slate-300">{userBalance.USDC.toLocaleString()}</span>
                                    </div>
                                </div>

                                <div className="p-3 bg-primary/5">
                                    <div className="text-[10px] uppercase text-primary font-bold tracking-widest mb-3 flex items-center gap-2">
                                        <FlaskConical className="w-3 h-3" /> Testnet Tools
                                    </div>
                                    <div className="flex justify-between items-center mb-4 px-1">
                                        <span className="text-slate-400 text-[11px]">Faucet Balance</span>
                                        <span className="text-white font-bold">10,000 USDC</span>
                                    </div>
                                    <button
                                        onClick={() => {
                                            mintDemoTokens();
                                            setIsGasDropdownOpen(false);
                                        }}
                                        className="w-full py-2 rounded border border-primary/50 text-primary hover:bg-primary hover:text-black transition-all flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest bg-primary/10"
                                    >
                                        <Sparkles className="w-3.5 h-3.5" />
                                        Mint Test Tokens
                                    </button>
                                </div>

                                <div className="p-1.5 flex gap-1 bg-black/40 border-t border-surface-border/30">
                                    {['USDC', 'TEMPO', 'NATIVE'].map(token => (
                                        <button
                                            key={token}
                                            onClick={() => {
                                                setGasToken(token as any);
                                                setIsGasDropdownOpen(false);
                                            }}
                                            className={cn(
                                                "flex-1 py-1 text-[9px] font-bold rounded transition-colors",
                                                gasToken === token ? "bg-primary text-black" : "text-slate-500 hover:text-white"
                                            )}
                                        >
                                            {token}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>

                <div className="relative">
                    <button
                        onClick={toggleKillSwitch}
                        className={cn(
                            "flex items-center gap-2 px-3 py-1.5 rounded border transition-all font-bold text-[10px] uppercase tracking-widest",
                            isKillSwitchActive
                                ? "bg-red-500 text-white border-red-600 shadow-glow-sm"
                                : "bg-red-500/10 border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white"
                        )}
                    >
                        <ShieldAlert className="w-3.5 h-3.5" />
                        Kill Switch
                    </button>
                    {isKillSwitchActive && (
                        <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping" />
                    )}
                </div>

                <div
                    onClick={(e) => {
                        e.stopPropagation();
                        setActiveView('Settings');
                    }}
                    className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-blue-600 p-[1px] cursor-pointer hover:shadow-glow-sm transition-shadow active:scale-95 z-50"
                >
                    <div className="w-full h-full rounded-full bg-surface-dark flex items-center justify-center overflow-hidden">
                        <img
                            className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity"
                            alt="User Profile"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDK63RxlF-2H1E40Mm5TylWdjf35LXsP8zkQ49XXfC1AVIoHPW_Rg57WW1q3tplzF4hf9j5hJ3Pa_X3y3UtUyggq8i5pFinAmUgLxf5o-I2sS1Y5B8mTT_KH1PpDhkESYXbHMBi1w3PXUL_yzlBurEsxS7zMUk3Z-WV2SaUs_rkQUWyd0QveEAbkM5ah0uv18PW_T-XHUKmGUpUjgGrUr6MoxdBIEXZ69OXAkhXLnfTrBRnXP8t7jbLzE-QNZz074txcvbfrKg3BOI"
                        />
                    </div>
                </div>
            </div>

            <PasskeyManager isOpen={isPasskeyOpen} onClose={() => setIsPasskeyOpen(false)} />
            <CommandTerminal isOpen={isTerminalOpen} onClose={() => setIsTerminalOpen(false)} />
        </header>
    );
};
