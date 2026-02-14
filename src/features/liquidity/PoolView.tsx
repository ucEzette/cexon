"use client";

import React, { useState, useEffect } from 'react';
import { useWallets, usePrivy } from '@privy-io/react-auth';
import { createWalletClient, custom, formatUnits, parseUnits, Address, maxUint256 } from 'viem';
import {
    LANE_MANAGER_ADDRESS,
    USDC_ADDRESS,
    ETH_WRAPPER_ADDRESS,
    ERC20_ABI,
    LANE_MANAGER_ABI
} from '@/lib/contracts';
import { tempoTestnet, publicClient } from '@/lib/chains';
import { cn } from '@/lib/utils';
import {
    Droplets,
    Plus,
    ArrowUpRight,
    RefreshCw,
    Sparkles,
    ShieldCheck,
    Coins,
    Vault,
    TrendingUp
} from 'lucide-react';
import { motion } from 'framer-motion';

export const PoolView = () => {
    const { authenticated, login } = usePrivy();
    const { wallets } = useWallets();
    const wallet = wallets[0];
    const address = wallet?.address;

    const [amount, setAmount] = useState('');
    const [selectedToken, setSelectedToken] = useState<'USDC' | 'cETH'>('USDC');
    const [isSeeding, setIsSeeding] = useState(false);
    const [isMinting, setIsMinting] = useState(false);
    const [isSwitching, setIsSwitching] = useState(false);

    // State for balances and reserves
    const [reserves, setReserves] = useState({ USDC: 0n, cETH: 0n });
    const [userBalances, setUserBalances] = useState({ USDC: 0n, cETH: 0n });
    const [userLiquidityPos, setUserLiquidityPos] = useState({ USDC: 0n, cETH: 0n });
    const [allowance, setAllowance] = useState(0n);
    const [isWithdrawing, setIsWithdrawing] = useState(false);

    // Initializing Pair State
    const [isInitMode, setIsInitMode] = useState(false);
    const [initTokens, setInitTokens] = useState({ a: USDC_ADDRESS, b: ETH_WRAPPER_ADDRESS });
    const [initPrice, setInitPrice] = useState('2400');
    const [isInitializing, setIsInitializing] = useState(false);

    const tokenAddress = selectedToken === 'USDC' ? USDC_ADDRESS : ETH_WRAPPER_ADDRESS;
    const decimals = selectedToken === 'USDC' ? 6 : 18;

    const isWrongChain = React.useMemo(() => {
        if (!wallet || !wallet.chainId) return false;
        const cid = wallet.chainId;
        const cleanId = typeof cid === 'string' ? cid.split(':').pop() : cid;
        if (!cleanId) return false;
        const numericId = typeof cleanId === 'string'
            ? cleanId.startsWith('0x') ? parseInt(cleanId, 16) : parseInt(cleanId, 10)
            : cleanId;
        return numericId !== tempoTestnet.id;
    }, [wallet?.chainId]);

    const fetchData = async () => {
        try {
            const [uRes, eRes] = await Promise.all([
                publicClient.readContract({
                    address: USDC_ADDRESS,
                    abi: ERC20_ABI,
                    functionName: 'balanceOf',
                    args: [LANE_MANAGER_ADDRESS]
                }),
                publicClient.readContract({
                    address: ETH_WRAPPER_ADDRESS,
                    abi: ERC20_ABI,
                    functionName: 'balanceOf',
                    args: [LANE_MANAGER_ADDRESS]
                })
            ]);
            setReserves({ USDC: uRes as bigint, cETH: eRes as bigint });

            if (address) {
                const [uBal, eBal, allow, uLiq, eLiq] = await Promise.all([
                    publicClient.readContract({
                        address: USDC_ADDRESS,
                        abi: ERC20_ABI,
                        functionName: 'balanceOf',
                        args: [address as Address]
                    }),
                    publicClient.readContract({
                        address: ETH_WRAPPER_ADDRESS,
                        abi: ERC20_ABI,
                        functionName: 'balanceOf',
                        args: [address as Address]
                    }),
                    publicClient.readContract({
                        address: tokenAddress,
                        abi: ERC20_ABI,
                        functionName: 'allowance',
                        args: [address as Address, LANE_MANAGER_ADDRESS]
                    }),
                    publicClient.readContract({
                        address: LANE_MANAGER_ADDRESS,
                        abi: LANE_MANAGER_ABI,
                        functionName: 'userLiquidity',
                        args: [address as Address, USDC_ADDRESS]
                    }),
                    publicClient.readContract({
                        address: LANE_MANAGER_ADDRESS,
                        abi: LANE_MANAGER_ABI,
                        functionName: 'userLiquidity',
                        args: [address as Address, ETH_WRAPPER_ADDRESS]
                    })
                ]);
                setUserBalances({ USDC: uBal as bigint, cETH: eBal as bigint });
                setAllowance(allow as bigint);
                setUserLiquidityPos({ USDC: uLiq as bigint, cETH: eLiq as bigint });
            }
        } catch (err) {
            console.error("Failed to fetch pool data:", err);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 10000);
        return () => clearInterval(interval);
    }, [address, tokenAddress]);

    const handleSwitchChain = async () => {
        if (!wallet) return;
        setIsSwitching(true);
        try {
            await wallet.switchChain(tempoTestnet.id);
        } catch (err) {
            console.error('Failed to switch chain:', err);
        } finally {
            setIsSwitching(false);
        }
    };

    const handleMint = async (token?: 'USDC' | 'cETH') => {
        if (!wallet) return;
        const targetToken = token || selectedToken;
        const targetAddress = targetToken === 'USDC' ? USDC_ADDRESS : ETH_WRAPPER_ADDRESS;
        const targetDecimals = targetToken === 'USDC' ? 6 : 18;

        setIsMinting(true);
        try {
            const provider = await wallet.getEthereumProvider();
            const walletClient = createWalletClient({
                chain: tempoTestnet,
                transport: custom(provider)
            });

            const { request } = await publicClient.simulateContract({
                address: targetAddress,
                abi: ERC20_ABI,
                functionName: 'mint',
                args: [address as Address, parseUnits('1000', targetDecimals)],
                account: address as Address,
            });

            const hash = await walletClient.writeContract(request);
            console.log('Mint tx sent:', hash);
            await publicClient.waitForTransactionReceipt({ hash });
            fetchData();
        } catch (err) {
            console.error('Mint failed:', err);
        } finally {
            setIsMinting(false);
        }
    };

    const handleSeed = async () => {
        if (!amount || !wallet || !address) return;
        setIsSeeding(true);
        try {
            const parsedAmount = parseUnits(amount, decimals);
            const provider = await wallet.getEthereumProvider();
            const walletClient = createWalletClient({
                chain: tempoTestnet,
                transport: custom(provider)
            });

            // 1. Approve if needed
            if (allowance < parsedAmount) {
                console.log('Approving...');
                const { request: appReq } = await publicClient.simulateContract({
                    address: tokenAddress,
                    abi: ERC20_ABI,
                    functionName: 'approve',
                    args: [LANE_MANAGER_ADDRESS, maxUint256],
                    account: address as Address,
                });
                const appHash = await walletClient.writeContract(appReq);
                await publicClient.waitForTransactionReceipt({ hash: appHash });
            }

            // 2. Add Liquidity to LaneManager
            console.log('Seeding...');
            const { request: seedReq } = await publicClient.simulateContract({
                address: LANE_MANAGER_ADDRESS,
                abi: LANE_MANAGER_ABI,
                functionName: 'addLiquidity',
                args: [tokenAddress, parsedAmount],
                account: address as Address,
            });

            const hash = await walletClient.writeContract(seedReq);
            console.log('Seeding tx sent:', hash);
            await publicClient.waitForTransactionReceipt({ hash });

            setAmount('');
            fetchData();
        } catch (err) {
            console.error('Seeding failed:', err);
        } finally {
            setIsSeeding(false);
        }
    };

    const handleWithdraw = async (token: 'USDC' | 'cETH', amountToWithdraw: bigint) => {
        if (!wallet || !address || amountToWithdraw <= 0n) return;
        setIsWithdrawing(true);
        try {
            const provider = await wallet.getEthereumProvider();
            const walletClient = createWalletClient({
                chain: tempoTestnet,
                transport: custom(provider)
            });

            const targetAddress = token === 'USDC' ? USDC_ADDRESS : ETH_WRAPPER_ADDRESS;

            const { request } = await publicClient.simulateContract({
                address: LANE_MANAGER_ADDRESS,
                abi: LANE_MANAGER_ABI,
                functionName: 'removeLiquidity',
                args: [targetAddress, amountToWithdraw],
                account: address as Address,
            });

            const hash = await walletClient.writeContract(request);
            await publicClient.waitForTransactionReceipt({ hash });
            fetchData();
        } catch (err) {
            console.error('Withdraw failed:', err);
        } finally {
            setIsWithdrawing(false);
        }
    };

    const handleInitializePool = async () => {
        if (!wallet || !address) return;
        setIsInitializing(true);
        try {
            const provider = await wallet.getEthereumProvider();
            const walletClient = createWalletClient({
                chain: tempoTestnet,
                transport: custom(provider)
            });

            const scaledPrice = parseUnits(initPrice, 18);

            const { request } = await publicClient.simulateContract({
                address: LANE_MANAGER_ADDRESS,
                abi: LANE_MANAGER_ABI,
                functionName: 'initializePool',
                args: [USDC_ADDRESS, ETH_WRAPPER_ADDRESS, scaledPrice],
                account: address as Address,
            });

            const hash = await walletClient.writeContract(request);
            await publicClient.waitForTransactionReceipt({ hash });
            setIsInitMode(false);
            fetchData();
        } catch (err) {
            console.error('Init pool failed:', err);
        } finally {
            setIsInitializing(false);
        }
    };

    const needsApproval = amount && parseUnits(amount, decimals || 0) > allowance;

    if (!authenticated) {
        return (
            <div className="flex-1 flex items-center justify-center bg-background-dark p-8">
                <div className="text-center space-y-6">
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto border border-primary/20">
                        <Vault className="w-10 h-10 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white tracking-tight">Access Restricted</h1>
                        <p className="text-slate-500 font-mono text-xs uppercase tracking-widest mt-2">Authentication required for Vault Operations</p>
                    </div>
                    <button
                        onClick={() => login()}
                        className="px-8 py-3 bg-primary text-black font-bold rounded uppercase tracking-widest shadow-glow hover:bg-white transition-all transform active:scale-95"
                    >
                        Initialize Connection
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col p-8 bg-background-dark overflow-auto custom-scrollbar">
            <div className="max-w-6xl mx-auto w-full space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                            <Vault className="w-8 h-8 text-primary" />
                            Liquidity Hub
                        </h1>
                        <p className="text-slate-400 font-mono text-sm mt-1 uppercase tracking-widest">
                            Global Vault Management & Reserve Provisioning
                        </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        <div className="px-4 py-2 rounded bg-primary/10 border border-primary/20 flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-xs font-mono font-bold text-primary uppercase tracking-widest">Production Pulse Active</span>
                        </div>
                        {address && (
                            <div className="text-[10px] font-mono text-slate-500 flex items-center gap-2">
                                <ShieldCheck className="w-3 h-3" />
                                {address.slice(0, 6)}...{address.slice(-4)}
                            </div>
                        )}
                    </div>
                </div>

                {/* Dashboard Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-surface-dark border border-surface-border p-6 rounded-xl relative overflow-hidden group hover:border-primary/50 transition-all shadow-2xl">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Droplets className="w-16 h-16 text-primary" />
                        </div>
                        <h3 className="text-slate-500 font-mono text-[10px] uppercase font-bold tracking-widest mb-4">cUSDC Reserves</h3>
                        <div className="text-4xl font-bold text-white font-mono tracking-tighter">
                            {Number(formatUnits(reserves.USDC, 6)).toLocaleString()}
                            <span className="text-lg text-slate-500 ml-2">USDC</span>
                        </div>
                        <div className="mt-4 flex items-center gap-2 text-green-500 text-xs font-mono font-bold uppercase tracking-wider">
                            <TrendingUp className="w-3 h-3" />
                            Stable Liquidity Level
                        </div>
                    </div>

                    <div className="bg-surface-dark border border-surface-border p-6 rounded-xl relative overflow-hidden group hover:border-blue-500/50 transition-all shadow-2xl">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <TrendingUp className="w-16 h-16 text-blue-500" />
                        </div>
                        <h3 className="text-slate-500 font-mono text-[10px] uppercase font-bold tracking-widest mb-4">cETH Reserves</h3>
                        <div className="text-4xl font-bold text-white font-mono tracking-tighter">
                            {Number(formatUnits(reserves.cETH, 18)).toLocaleString()}
                            <span className="text-lg text-slate-500 ml-2">ETH</span>
                        </div>
                        <div className="mt-4 flex items-center gap-2 text-blue-500 text-xs font-mono font-bold uppercase tracking-wider">
                            <ShieldCheck className="w-3 h-3" />
                            Native Depth Optimal
                        </div>
                    </div>

                    <div className="bg-surface-dark border border-surface-border p-6 rounded-xl relative overflow-hidden group hover:border-purple-500/50 transition-all shadow-2xl">
                        <h3 className="text-slate-500 font-mono text-[10px] uppercase font-bold tracking-widest mb-4">Protocol Health</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-xs font-mono uppercase tracking-widest">
                                <span className="text-slate-400">Pair Utilization</span>
                                <span className="text-white">12.4%</span>
                            </div>
                            <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
                                <div className="w-[12.4%] h-full bg-gradient-to-r from-primary to-blue-500 shadow-glow-sm" />
                            </div>
                            <div className="flex justify-between items-center text-xs font-mono uppercase tracking-widest">
                                <span className="text-slate-400">Total Value Locked</span>
                                <span className="text-primary font-bold shadow-glow-sm">$4.8M EST</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Action Area */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    {/* Management Form */}
                    <div className="lg:col-span-3 space-y-6">
                        <div className="bg-surface-dark border border-surface-border rounded-xl p-8 space-y-8 relative overflow-hidden">
                            <div className="flex items-center gap-4 mb-2">
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                                    <Plus className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white uppercase tracking-tight">Supply Liquidity</h2>
                                    <p className="text-slate-500 text-xs font-mono">Increase vault depth to support larger trades</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {/* Mode Toggle */}
                                <div className="flex bg-black/40 p-1 rounded-lg border border-surface-border">
                                    <button
                                        onClick={() => setIsInitMode(false)}
                                        className={cn(
                                            "flex-1 py-2 text-[10px] font-mono font-bold uppercase tracking-[0.2em] rounded transition-all",
                                            !isInitMode ? "bg-primary text-black shadow-glow-sm" : "text-slate-500 hover:text-white"
                                        )}
                                    >
                                        Supply Assets
                                    </button>
                                    <button
                                        onClick={() => setIsInitMode(true)}
                                        className={cn(
                                            "flex-1 py-2 text-[10px] font-mono font-bold uppercase tracking-[0.2em] rounded transition-all",
                                            isInitMode ? "bg-primary text-black shadow-glow-sm" : "text-slate-500 hover:text-white"
                                        )}
                                    >
                                        Initialize Pool
                                    </button>
                                </div>

                                {!isInitMode ? (
                                    <>
                                        {/* Token Select */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <button
                                                onClick={() => setSelectedToken('USDC')}
                                                className={cn(
                                                    "p-4 rounded-lg border transition-all flex flex-col gap-3 group text-left",
                                                    selectedToken === 'USDC'
                                                        ? "bg-primary/10 border-primary shadow-glow-sm"
                                                        : "bg-black/20 border-surface-border hover:border-slate-600"
                                                )}
                                            >
                                                <div className="flex justify-between items-center w-full">
                                                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-black font-bold text-xs ring-4 ring-primary/5">U</div>
                                                    {selectedToken === 'USDC' && <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />}
                                                </div>
                                                <div>
                                                    <div className="text-xs font-mono font-bold text-slate-500 group-hover:text-slate-400 uppercase tracking-widest">Digital Dollar</div>
                                                    <div className="text-white font-bold tracking-tighter text-lg underline decoration-primary/30 underline-offset-4">cUSDC</div>
                                                </div>
                                            </button>

                                            <button
                                                onClick={() => setSelectedToken('cETH')}
                                                className={cn(
                                                    "p-4 rounded-lg border transition-all flex flex-col gap-3 group text-left",
                                                    selectedToken === 'cETH'
                                                        ? "bg-blue-500/10 border-blue-500 shadow-glow-sm"
                                                        : "bg-black/20 border-surface-border hover:border-slate-600"
                                                )}
                                            >
                                                <div className="flex justify-between items-center w-full">
                                                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xs ring-4 ring-blue-500/5">E</div>
                                                    {selectedToken === 'cETH' && <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />}
                                                </div>
                                                <div>
                                                    <div className="text-xs font-mono font-bold text-slate-500 group-hover:text-slate-400 uppercase tracking-widest">Native Asset</div>
                                                    <div className="text-white font-bold tracking-tighter text-lg underline decoration-blue-500/30 underline-offset-4">cETH</div>
                                                </div>
                                            </button>
                                        </div>

                                        {/* Amount Input */}
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500">
                                                <span>Provision Amount</span>
                                                <span>Balance: {selectedToken === 'USDC'
                                                    ? formatUnits(userBalances.USDC, 6)
                                                    : formatUnits(userBalances.cETH, 18)}
                                                </span>
                                            </div>
                                            <div className="relative group">
                                                <input
                                                    type="number"
                                                    value={amount}
                                                    onChange={(e) => setAmount(e.target.value)}
                                                    placeholder="0.00"
                                                    className="w-full bg-black/40 border-2 border-surface-border rounded-xl p-6 text-2xl font-mono text-white placeholder:text-slate-700 focus:outline-none focus:border-primary/50 transition-all focus:ring-4 focus:ring-primary/5 pr-20"
                                                />
                                                <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-500 font-mono font-bold text-sm tracking-widest">
                                                    {selectedToken}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action Button */}
                                        <button
                                            onClick={isWrongChain ? handleSwitchChain : handleSeed}
                                            disabled={(!amount && !isWrongChain) || isSeeding || isSwitching}
                                            className={cn(
                                                "w-full py-5 rounded-xl font-bold text-lg uppercase tracking-widest transition-all relative overflow-hidden flex items-center justify-center gap-3 active:scale-[0.98]",
                                                isSeeding || isSwitching
                                                    ? "bg-slate-700 text-slate-400"
                                                    : isWrongChain
                                                        ? "bg-red-500/20 text-red-500 border border-red-500/50 hover:bg-red-500 hover:text-white"
                                                        : needsApproval
                                                            ? "bg-amber-500 text-black shadow-glow-sm hover:bg-amber-400"
                                                            : "bg-primary text-black shadow-glow hover:bg-white transition-colors disabled:opacity-50 disabled:grayscale"
                                            )}
                                        >
                                            {isSeeding && <RefreshCw className="w-5 h-5 animate-spin" />}
                                            {isWrongChain
                                                ? (isSwitching ? 'Switching...' : 'Switch to Tempo')
                                                : isSeeding ? 'Broadcasting...' : needsApproval ? 'Authorize & Supply' : 'Supply Liquidity'}
                                            <ArrowUpRight className="w-5 h-5 opacity-50" />
                                        </button>
                                    </>
                                ) : (
                                    <div className="space-y-6">
                                        <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                                            <p className="text-[10px] font-mono text-primary/80 uppercase tracking-wider mb-4">Select Pair Tokens</p>
                                            <div className="flex items-center gap-4 justify-center">
                                                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-black font-bold">U</div>
                                                <RefreshCw className="w-4 h-4 text-slate-500" />
                                                <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">E</div>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500 ml-1">Initial Base Price (USDC per ETH)</label>
                                            <input
                                                type="number"
                                                value={initPrice}
                                                onChange={(e) => setInitPrice(e.target.value)}
                                                className="w-full bg-black/40 border-2 border-surface-border rounded-xl p-4 font-mono text-white focus:border-primary/50 outline-none"
                                            />
                                        </div>
                                        <button
                                            onClick={isWrongChain ? handleSwitchChain : handleInitializePool}
                                            disabled={isInitializing || isSwitching}
                                            className="w-full py-4 bg-primary text-black font-bold rounded-xl uppercase tracking-widest shadow-glow hover:bg-white transition-all disabled:opacity-50"
                                        >
                                            {isInitializing ? <RefreshCw className="w-5 h-5 animate-spin mx-auto" /> : 'Create Market Pair'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Developer Tools & Insights */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-surface-dark/50 border border-surface-border rounded-xl p-6 space-y-6">
                            <div className="flex items-center gap-2 mb-2">
                                <Sparkles className="w-5 h-5 text-primary" />
                                <h4 className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-white">Developer Toolbox</h4>
                            </div>

                            <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg space-y-4">
                                <p className="text-[10px] font-mono text-primary/80 leading-relaxed uppercase tracking-wider">
                                    Instant Minting enabled for production-ready Mock Contracts on Moderato Testnet.
                                </p>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        onClick={isWrongChain ? handleSwitchChain : () => handleMint('USDC')}
                                        disabled={isMinting || isSwitching}
                                        className="py-2.5 bg-primary/10 border border-primary/30 text-primary text-[10px] font-bold uppercase tracking-widest rounded hover:bg-primary hover:text-black transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        {isMinting || isSwitching ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                                        {isWrongChain ? 'Switch' : 'Mint USDC'}
                                    </button>
                                    <button
                                        onClick={isWrongChain ? handleSwitchChain : () => handleMint('cETH')}
                                        disabled={isMinting || isSwitching}
                                        className="py-2.5 bg-blue-500/10 border border-blue-500/30 text-blue-500 text-[10px] font-bold uppercase tracking-widest rounded hover:bg-blue-500 hover:text-white transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        {isMinting || isSwitching ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                                        {isWrongChain ? 'Switch' : 'Mint ETH'}
                                    </button>
                                </div>
                                <button
                                    onClick={isWrongChain ? handleSwitchChain : async () => {
                                        await handleMint('USDC');
                                        await handleMint('cETH');
                                    }}
                                    disabled={isMinting || isSwitching}
                                    className="w-full py-2 bg-gradient-to-r from-primary/20 to-blue-500/20 border border-white/10 text-white text-[9px] font-bold uppercase tracking-[0.2em] rounded hover:border-white/30 transition-all flex items-center justify-center gap-2"
                                >
                                    {isMinting ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3 text-amber-400" />}
                                    {isWrongChain ? 'Switch to Tempo' : 'Mint All Protocol Assets'}
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                    <Vault className="w-3 h-3" /> Active Positions
                                </div>
                                <div className="space-y-2">
                                    {userLiquidityPos.USDC > 0n && (
                                        <div className="bg-black/40 p-4 rounded border border-primary/20 flex flex-col gap-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">USDC Position</span>
                                                <span className="text-white font-mono font-bold">{formatUnits(userLiquidityPos.USDC, 6)} USDC</span>
                                            </div>
                                            <button
                                                onClick={() => handleWithdraw('USDC', userLiquidityPos.USDC)}
                                                disabled={isWithdrawing}
                                                className="w-full py-1.5 bg-red-500/10 text-red-500 border border-red-500/20 rounded text-[9px] font-bold uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
                                            >
                                                {isWithdrawing ? 'Withdrawing...' : 'Remove Liquidity'}
                                            </button>
                                        </div>
                                    )}
                                    {userLiquidityPos.cETH > 0n && (
                                        <div className="bg-black/40 p-4 rounded border border-blue-500/20 flex flex-col gap-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">ETH Position</span>
                                                <span className="text-white font-mono font-bold">{formatUnits(userLiquidityPos.cETH, 18)} ETH</span>
                                            </div>
                                            <button
                                                onClick={() => handleWithdraw('cETH', userLiquidityPos.cETH)}
                                                disabled={isWithdrawing}
                                                className="w-full py-1.5 bg-red-500/10 text-red-500 border border-red-500/20 rounded text-[9px] font-bold uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
                                            >
                                                {isWithdrawing ? 'Withdrawing...' : 'Remove Liquidity'}
                                            </button>
                                        </div>
                                    )}
                                    {userLiquidityPos.USDC === 0n && userLiquidityPos.cETH === 0n && (
                                        <div className="p-8 text-center border border-dashed border-surface-border rounded-lg">
                                            <p className="text-[10px] font-mono text-slate-600 uppercase tracking-widest">No active positions</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                    <Coins className="w-3 h-3" /> Wallet Balances
                                </div>
                                <div className="space-y-2">
                                    <div className="bg-black/40 p-3 rounded border border-surface-border flex justify-between items-center group hover:border-primary/30 transition-all">
                                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Cexon USDC</span>
                                        <span className="text-white font-mono font-bold tracking-tight">
                                            {Number(formatUnits(userBalances.USDC, 6)).toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="bg-black/40 p-3 rounded border border-surface-border flex justify-between items-center group hover:border-blue-500/30 transition-all">
                                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Cexon ETH</span>
                                        <span className="text-white font-mono font-bold tracking-tight">
                                            {Number(formatUnits(userBalances.cETH, 18)).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Network Info */}
                        <div className="p-6 bg-black/40 border border-surface-border rounded-xl space-y-3">
                            <h4 className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.2em] font-bold">Network Context</h4>
                            <div className="flex justify-between items-center text-[11px] font-mono">
                                <span className="text-slate-400 uppercase tracking-widest">Chain ID</span>
                                <span className="text-white font-bold">42431</span>
                            </div>
                            <div className="flex justify-between items-center text-[11px] font-mono">
                                <span className="text-slate-400 uppercase tracking-widest">Moderato Explorer</span>
                                <span className="text-primary font-bold shadow-glow-sm flex items-center gap-1 cursor-pointer hover:underline">
                                    LIVE <ArrowUpRight className="w-3 h-3" />
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
