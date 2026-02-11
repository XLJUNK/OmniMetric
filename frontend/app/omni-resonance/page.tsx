import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { getMultilingualMetadata } from '@/data/seo';
import OmniResonanceClient from '@/app/[lang]/omni-resonance/OmniResonanceClient';
import { DynamicStructuredData } from '@/components/DynamicStructuredData';

// Static metadata (Default to EN)
export const metadata: Metadata = getMultilingualMetadata('/omni-resonance', 'EN',
    "OmniResonance: Portfolio-Macro Alignment Terminal | OmniMetric",
    "Official Portfolio-Macro resonance diagnostic tool. Align your assets with global macro momentum using institutional-grade data."
);

const financialAppSchema = {
    "@context": "https://schema.org",
    "@type": "FinancialApplication",
    "name": "OmniResonance",
    "description": "Portfolio-Macro Alignment Terminal with proprietary macro indicators.",
    "applicationCategory": "FinancialApplication",
    "operatingSystem": "Web",
    "author": {
        "@type": "Organization",
        "name": "OmniMetric"
    },
    "keywords": "GMS Score, Omni Gravity Vector, OGV, Macro Analysis, Portfolio Sync, Asset Alignment"
};

export default function OmniResonancePage() {
    return (
        <>
            <DynamicStructuredData data={financialAppSchema} />
            <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-sky-500 font-mono tracking-widest animate-pulse">LOADING SIMULATOR...</div>}>
                <OmniResonanceClient lang="EN" />
            </Suspense>
        </>
    );
}
