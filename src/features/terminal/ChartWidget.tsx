"use client";

import React, { useEffect, useRef } from 'react';
import { createChart, ColorType, Time } from 'lightweight-charts';
import { useMarketStore } from './useMarketData';
import { useGlobalStore } from '@/store/useGlobalStore';

export const ChartWidget = () => {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const candlestickSeriesRef = useRef<any>(null);
    const { price } = useMarketStore();
    const { tradeHistory } = useGlobalStore();

    useEffect(() => {
        if (!chartContainerRef.current) return;

        const initChart = () => {
            if (!chartContainerRef.current) return;

            const containerWidth = chartContainerRef.current.clientWidth || 600;
            const containerHeight = chartContainerRef.current.clientHeight || 400;

            const chart = createChart(chartContainerRef.current, {
                layout: {
                    background: { type: ColorType.Solid, color: '#050505' },
                    textColor: '#94a3b8',
                },
                width: containerWidth,
                height: containerHeight,
                grid: {
                    vertLines: { color: 'rgba(255, 255, 255, 0.05)' },
                    horzLines: { color: 'rgba(255, 255, 255, 0.05)' },
                },
                timeScale: {
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    timeVisible: true,
                    rightOffset: 12,
                    barSpacing: 3,
                },
                rightPriceScale: {
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                },
            });

            candlestickSeriesRef.current = chart.addCandlestickSeries({
                upColor: '#00eeff',
                downColor: '#ff3b30',
                borderVisible: false,
                wickUpColor: '#00eeff',
                wickDownColor: '#ff3b30',
            });

            // Generate initial data
            const data: { time: Time; open: number; high: number; low: number; close: number }[] = [];
            let currentPrice = price;
            const now = Math.floor(Date.now() / 1000);

            for (let i = 0; i < 100; i++) {
                const time = (now - (100 - i) * 60) as Time;
                const open = currentPrice;
                const close = open + (Math.random() - 0.5) * 5;
                const high = Math.max(open, close) + Math.random() * 2;
                const low = Math.min(open, close) - Math.random() * 2;

                data.push({ time, open, high, low, close });
                currentPrice = close;
            }

            candlestickSeriesRef.current.setData(data);

            const handleResize = () => {
                if (chartContainerRef.current) {
                    chart.applyOptions({
                        width: chartContainerRef.current.clientWidth,
                        height: chartContainerRef.current.clientHeight
                    });
                }
            };

            window.addEventListener('resize', handleResize);

            return { chart, handleResize };
        };

        const timer = setTimeout(() => {
            const result = initChart();
            if (result) {
                (window as any)._cleanup_chart = () => {
                    window.removeEventListener('resize', result.handleResize);
                    result.chart.remove();
                };
            }
        }, 100);

        return () => {
            clearTimeout(timer);
            if ((window as any)._cleanup_chart) {
                (window as any)._cleanup_chart();
            }
        };
    }, []);

    // Sync markers with tradeHistory
    useEffect(() => {
        if (!candlestickSeriesRef.current) return;

        const markers = tradeHistory.map((trade) => ({
            time: (Math.floor(new Date(trade.timestamp).getTime() / 1000)) as Time,
            position: trade.side === 'buy' ? 'belowBar' : 'aboveBar',
            color: trade.side === 'buy' ? '#00eeff' : '#ff3b30',
            shape: trade.side === 'buy' ? 'arrowUp' : 'arrowDown',
            text: `${trade.side.toUpperCase()} ${trade.amount}`,
            size: 1,
        }));

        // Filter out markers with invalid times (outside current chart range for mock)
        // For simulation, we just show everything recent
        candlestickSeriesRef.current.setMarkers(markers.slice(-20));
    }, [tradeHistory]);

    return (
        <div className="flex-1 relative flex flex-col bg-background-dark min-h-[400px]">
            {/* Toolbar */}
            <div className="h-10 border-b border-surface-border flex items-center px-4 justify-between bg-surface-dark/50">
                <div className="flex gap-4 text-xs font-mono text-slate-400">
                    <span className="hover:text-white cursor-pointer">1m</span>
                    <span className="hover:text-white cursor-pointer">5m</span>
                    <span className="text-primary cursor-pointer border-b border-primary">15m</span>
                    <span className="hover:text-white cursor-pointer">1h</span>
                    <span className="hover:text-white cursor-pointer">4h</span>
                    <span className="hover:text-white cursor-pointer">D</span>
                </div>
            </div>

            {/* Chart */}
            <div className="w-full relative h-[400px] bg-black/20">
                <div ref={chartContainerRef} className="absolute inset-0 w-full h-full" />
                {!chartContainerRef.current && (
                    <div className="absolute inset-0 flex items-center justify-center text-slate-500 font-mono text-[10px] uppercase tracking-widest">
                        Initializing Engine...
                    </div>
                )}
            </div>
        </div>
    );
};
