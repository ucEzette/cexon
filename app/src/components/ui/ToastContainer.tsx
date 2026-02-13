"use client";

import React from 'react';
import { useToastStore, ToastType } from '@/store/useToastStore';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

const icons: Record<ToastType, React.ReactNode> = {
    success: <CheckCircle2 className="w-4 h-4 text-primary" />,
    error: <AlertCircle className="w-4 h-4 text-ask-red" />,
    info: <Zap className="w-4 h-4 text-blue-400" />,
    warning: <Info className="w-4 h-4 text-yellow-500" />,
};

export const ToastContainer = () => {
    const { toasts, removeToast } = useToastStore();

    return (
        <div className="fixed bottom-12 right-6 z-[200] flex flex-col gap-2 pointer-events-none">
            <AnimatePresence>
                {toasts.map((toast) => (
                    <motion.div
                        key={toast.id}
                        initial={{ opacity: 0, x: 20, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                        className={cn(
                            "pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-lg border bg-surface-dark/90 backdrop-blur-xl shadow-2xl min-w-[280px]",
                            toast.type === 'success' && "border-primary/30",
                            toast.type === 'error' && "border-ask-red/30",
                            toast.type === 'info' && "border-blue-500/30",
                            toast.type === 'warning' && "border-yellow-500/30",
                        )}
                    >
                        <div className="shrink-0">{icons[toast.type]}</div>
                        <div className="flex-1 text-xs font-medium text-slate-200 uppercase tracking-tight font-display">
                            {toast.message}
                        </div>
                        <button
                            onClick={() => removeToast(toast.id)}
                            className="p-1 hover:bg-white/5 rounded transition-colors text-slate-500 hover:text-white"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                        <motion.div
                            initial={{ width: "100%" }}
                            animate={{ width: "0%" }}
                            transition={{ duration: 4, ease: "linear" }}
                            className={cn(
                                "absolute bottom-0 left-0 h-[1px]",
                                toast.type === 'success' && "bg-primary",
                                toast.type === 'error' && "bg-ask-red",
                                toast.type === 'info' && "bg-blue-400",
                                toast.type === 'warning' && "bg-yellow-500",
                            )}
                        />
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};
