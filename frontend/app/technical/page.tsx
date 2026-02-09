import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { getMultilingualMetadata } from '@/data/seo';
// Importing directly from the localized folder component
import TechnicalClient from '@/app/[lang]/technical/TechnicalClient';

export const metadata: Metadata = getMultilingualMetadata('/technical', 'EN',
    "Technical Analysis Hub | OmniMetric",
    "Core technical technical indicators and quant-momentum analysis for active market researchers."
);

export default function TechnicalPage() {
    return (
        <Suspense fallback={<div className="min-h-screen animate-pulse bg-black" />}>
            <TechnicalClient lang="EN" />
        </Suspense>
    );
}
