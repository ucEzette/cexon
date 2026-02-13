"use client";

import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { ToastContainer } from '@/components/ui/ToastContainer';

interface MainLayoutProps {
    children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
    return (
        <div className="flex flex-col h-screen bg-background-dark text-slate-200 font-display selection:bg-primary/30">
            <Header />
            <div className="flex-1 flex overflow-hidden">
                {children}
            </div>
            <Footer />
            <ToastContainer />
        </div>
    );
};
