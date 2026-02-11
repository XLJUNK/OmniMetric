import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { getMultilingualMetadata } from '@/data/seo';
import OmniResonanceClient from './OmniResonanceClient';
import { DICTIONARY, LangType } from '@/data/dictionary';

export const dynamicParams = false;

export function generateStaticParams() {
    return Object.keys(DICTIONARY).filter(l => l !== 'EN').map((lang) => ({
        lang: lang.toLowerCase(),
    }));
}

// Static metadata (Default to EN)
export const metadata: Metadata = getMultilingualMetadata('/test/omni-resonance', 'EN',
    "OmniResonance Prototype | OmniMetric",
    "Technical prototype for macro alignment simulation and portfolio resonance mapping."
);

type Props = {
    params: Promise<{ lang: string }>
}

export default async function OmniResonancePage({ params }: Props) {
    const { lang } = await params;
    const normalizedLang = (lang.toUpperCase() as LangType) || 'EN';

    return (
        <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-sky-500 font-mono tracking-widest animate-pulse">LOADING SIMULATOR...</div>}>
            <OmniResonanceClient lang={normalizedLang} />
        </Suspense>
    );
}
