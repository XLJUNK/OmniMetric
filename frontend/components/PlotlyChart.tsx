'use client';

import React from 'react';

interface PlotlyChartProps {
    data: any[];
    layout: any;
    config?: any;
    style?: React.CSSProperties;
    useResizeHandler?: boolean;
}

const PlotlyChart = (props: PlotlyChartProps) => {
    const [Plot, setPlot] = React.useState<any>(null);
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        try {
            // Essential: Plotly MUST be loaded on the client side only
            const Plotly = require('plotly.js-dist-min');
            const factory = require('react-plotly.js/factory');
            const createPlotlyComponent = factory.default || factory;

            if (typeof createPlotlyComponent !== 'function') {
                throw new Error('Plotly factory not found');
            }

            setPlot(() => createPlotlyComponent(Plotly));
        } catch (err) {
            console.error('Failed to initialize Plotly:', err);
            setError(err instanceof Error ? err.message : 'Unknown error');
        }
    }, []);

    if (error) {
        return (
            <div className="h-full w-full flex items-center justify-center text-[10px] text-red-500 font-mono uppercase bg-slate-900/50 rounded-lg">
                Chart Error: {error}
            </div>
        );
    }

    if (!Plot) {
        return (
            <div className="h-full w-full flex items-center justify-center text-[10px] text-slate-600 font-mono uppercase animate-pulse">
                Initializing...
            </div>
        );
    }

    return <Plot {...props} />;
};

export default PlotlyChart;
