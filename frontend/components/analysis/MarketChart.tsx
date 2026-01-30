
'use client';

import React, { useEffect, useRef } from 'react';
import { createChart, ColorType, CrosshairMode, IChartApi, ISeriesApi, UTCTimestamp, CandlestickSeries, LineSeries, HistogramSeries } from 'lightweight-charts';

interface MarketData {
    time: number; // Unix timestamp
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
    sma200?: number;
    sma25?: number;
    bb_upper?: number;
    bb_middle?: number;
    bb_lower?: number;
    rsi?: number;
    deviation?: number;
    is_bullish?: boolean;
    is_bearish?: boolean;
}

interface MarketChartProps {
    data: MarketData[];
    visibleIndicators: {
        bb: boolean;
        sma: boolean;
        rsi: boolean;
    };
    colors?: {
        backgroundColor?: string;
        textColor?: string;
    };
}

export default function MarketChart({ data, visibleIndicators, colors }: MarketChartProps) {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<IChartApi | null>(null);

    // Series Refs
    const candleSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
    const volumeSeriesRef = useRef<ISeriesApi<"Histogram"> | null>(null);
    const sma200SeriesRef = useRef<ISeriesApi<"Line"> | null>(null);
    const sma25SeriesRef = useRef<ISeriesApi<"Line"> | null>(null);
    const bbUpperSeriesRef = useRef<ISeriesApi<"Line"> | null>(null);
    const bbLowerSeriesRef = useRef<ISeriesApi<"Line"> | null>(null);
    const rsiSeriesRef = useRef<ISeriesApi<"Line"> | null>(null);

    // RSI Subchart container
    const rsiContainerRef = useRef<HTMLDivElement>(null);
    const rsiChartRef = useRef<IChartApi | null>(null);

    useEffect(() => {
        if (!chartContainerRef.current) return;

        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: colors?.backgroundColor || '#1e1e1e' },
                textColor: colors?.textColor || '#d1d5db',
            },
            width: chartContainerRef.current.clientWidth,
            height: 400,
            grid: {
                vertLines: { color: '#333' },
                horzLines: { color: '#333' },
            },
            crosshair: {
                mode: CrosshairMode.Normal,
            },
            timeScale: {
                timeVisible: true,
                secondsVisible: false,
            },
        });

        chartRef.current = chart;

        // --- Main Chart Series ---

        // Volume
        const volumeSeries = chart.addSeries(HistogramSeries, {
            color: '#26a69a',
            priceFormat: {
                type: 'volume',
            },
            priceScaleId: 'volume', // Set explicit ID for volume scale
        });
        volumeSeriesRef.current = volumeSeries;

        // Configure Volume Scale (Overlay at bottom 20%)
        chart.priceScale('volume').applyOptions({
            scaleMargins: {
                top: 0.8,
                bottom: 0,
            },
        });

        // Candlestick
        const candleSeries = chart.addSeries(CandlestickSeries, {});
        candleSeriesRef.current = candleSeries;

        // SMA
        const sma200Series = chart.addSeries(LineSeries, { color: '#2962FF', lineWidth: 2, title: 'SMA 200' });
        sma200SeriesRef.current = sma200Series;

        const sma25Series = chart.addSeries(LineSeries, { color: '#FF6D00', lineWidth: 2, title: 'SMA 25' });
        sma25SeriesRef.current = sma25Series;

        // BB
        const bbUpperSeries = chart.addSeries(LineSeries, { color: 'rgba(0, 150, 136, 0.5)', lineWidth: 1, title: 'BB Upper' });
        bbUpperSeriesRef.current = bbUpperSeries;
        const bbLowerSeries = chart.addSeries(LineSeries, { color: 'rgba(0, 150, 136, 0.5)', lineWidth: 1, title: 'BB Lower' });
        bbLowerSeriesRef.current = bbLowerSeries;

        // Set Data
        const sortedData = [...data].sort((a, b) => a.time - b.time);

        candleSeries.setData(sortedData.map(d => ({
            time: d.time as UTCTimestamp,
            open: d.open,
            high: d.high,
            low: d.low,
            close: d.close
        })));

        volumeSeries.setData(sortedData.filter(d => d.volume !== undefined).map(d => ({
            time: d.time as UTCTimestamp,
            value: d.volume,
            color: (d.close >= d.open) ? 'rgba(38, 166, 154, 0.5)' : 'rgba(239, 83, 80, 0.5)'
        })));

        sma200Series.setData(sortedData.filter(d => d.sma200).map(d => ({
            time: d.time as UTCTimestamp,
            value: d.sma200!
        })));

        sma25Series.setData(sortedData.filter(d => d.sma25).map(d => ({
            time: d.time as UTCTimestamp,
            value: d.sma25!
        })));

        bbUpperSeries.setData(sortedData.filter(d => d.bb_upper).map(d => ({
            time: d.time as UTCTimestamp,
            value: d.bb_upper!
        })));

        bbLowerSeries.setData(sortedData.filter(d => d.bb_lower).map(d => ({
            time: d.time as UTCTimestamp,
            value: d.bb_lower!
        })));

        // Markers
        const markers: any[] = [];
        sortedData.forEach(d => {
            if (d.is_bullish) {
                markers.push({
                    time: d.time as UTCTimestamp,
                    position: 'belowBar',
                    color: '#2196F3',
                    shape: 'arrowUp',
                    text: 'Bull Div',
                    size: 1
                });
            }
            if (d.is_bearish) {
                markers.push({
                    time: d.time as UTCTimestamp,
                    position: 'aboveBar',
                    color: '#FF5252',
                    shape: 'arrowDown',
                    text: 'Bear Div',
                    size: 1
                });
            }
        });
        candleSeries.setMarkers(markers);


        const handleResize = () => {
            if (chartContainerRef.current) {
                chart.applyOptions({ width: chartContainerRef.current.clientWidth });
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            chart.remove();
        };
    }, []);

    // Update Data
    useEffect(() => {
        if (!chartRef.current) return;

        const sortedData = [...data].sort((a, b) => a.time - b.time);

        candleSeriesRef.current?.setData(sortedData.map(d => ({
            time: d.time as UTCTimestamp,
            open: d.open, high: d.high, low: d.low, close: d.close
        })));

        const markers: any[] = [];
        sortedData.forEach(d => {
            if (d.is_bullish) markers.push({ time: d.time as UTCTimestamp, position: 'belowBar', color: '#2196F3', shape: 'arrowUp', text: 'Bull Div', size: 1 });
            if (d.is_bearish) markers.push({ time: d.time as UTCTimestamp, position: 'aboveBar', color: '#FF5252', shape: 'arrowDown', text: 'Bear Div', size: 1 });
        });
        candleSeriesRef.current?.setMarkers(markers);

        volumeSeriesRef.current?.setData(sortedData.filter(d => d.volume !== undefined).map(d => ({
            time: d.time as UTCTimestamp,
            value: d.volume,
            color: (d.close >= d.open) ? 'rgba(38, 166, 154, 0.5)' : 'rgba(239, 83, 80, 0.5)'
        })));
        sma200SeriesRef.current?.setData(sortedData.filter(d => d.sma200).map(d => ({ time: d.time as UTCTimestamp, value: d.sma200! })));
        sma25SeriesRef.current?.setData(sortedData.filter(d => d.sma25).map(d => ({ time: d.time as UTCTimestamp, value: d.sma25! })));
        bbUpperSeriesRef.current?.setData(sortedData.filter(d => d.bb_upper).map(d => ({ time: d.time as UTCTimestamp, value: d.bb_upper! })));
        bbLowerSeriesRef.current?.setData(sortedData.filter(d => d.bb_lower).map(d => ({ time: d.time as UTCTimestamp, value: d.bb_lower! })));


        // Visibility
        sma200SeriesRef.current?.applyOptions({ visible: visibleIndicators.sma });
        sma25SeriesRef.current?.applyOptions({ visible: visibleIndicators.sma });
        bbUpperSeriesRef.current?.applyOptions({ visible: visibleIndicators.bb });
        bbLowerSeriesRef.current?.applyOptions({ visible: visibleIndicators.bb });

    }, [visibleIndicators, data]);

    // RSI Chart
    useEffect(() => {
        if (!rsiContainerRef.current) return;
        if (rsiChartRef.current) {
            rsiChartRef.current.remove();
            rsiChartRef.current = null;
        }

        if (!visibleIndicators.rsi) return;

        const rsiChart = createChart(rsiContainerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: colors?.backgroundColor || '#1e1e1e' },
                textColor: colors?.textColor || '#d1d5db',
            },
            width: rsiContainerRef.current.clientWidth,
            height: 150,
            grid: {
                vertLines: { color: '#333' },
                horzLines: { color: '#333' },
            },
            timeScale: {
                visible: true,
                timeVisible: true,
            },
        });

        rsiChartRef.current = rsiChart;

        const rsiSeries = rsiChart.addSeries(LineSeries, {
            color: '#9C27B0',
            lineWidth: 2,
            title: 'RSI(14)',
        });

        rsiSeries.createPriceLine({ price: 70, color: '#EF5350', lineWidth: 1, lineStyle: 2, axisLabelVisible: true, title: '70' });
        rsiSeries.createPriceLine({ price: 30, color: '#66BB6A', lineWidth: 1, lineStyle: 2, axisLabelVisible: true, title: '30' });

        const sortedData = [...data].sort((a, b) => a.time - b.time);

        rsiSeries.setData(sortedData.filter(d => d.rsi).map(d => ({
            time: d.time as UTCTimestamp,
            value: d.rsi!
        })));

        // Sync
        if (chartRef.current) {
            chartRef.current.timeScale().subscribeVisibleLogicalRangeChange(range => {
                if (range && rsiChartRef.current) {
                    rsiChartRef.current.timeScale().setVisibleLogicalRange(range);
                }
            });
            rsiChart.timeScale().subscribeVisibleLogicalRangeChange(range => {
                if (range && chartRef.current) {
                    chartRef.current.timeScale().setVisibleLogicalRange(range);
                }
            });
        }
    }, [visibleIndicators.rsi, data, colors]);


    return (
        <div className="flex flex-col gap-1 w-full relative">
            <div ref={chartContainerRef} className="w-full h-[400px]" />
            {visibleIndicators.rsi && (
                <div ref={rsiContainerRef} className="w-full h-[150px]" />
            )}
        </div>
    );
}
