import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { getMultilingualMetadata } from '@/data/seo';
import TechnicalClient from './TechnicalClient';
import { DICTIONARY, LangType } from '@/data/dictionary';

export function generateStaticParams() {
    return Object.keys(DICTIONARY).filter((lang) => lang !== 'EN').map((lang) => ({
        lang: lang.toLowerCase(),
    }));
}

// Static metadata (Default to EN)
export const metadata: Metadata = getMultilingualMetadata('/technical', 'EN',
    "Technical Analysis Hub | OmniMetric",
    "Core technical technical indicators and quant-momentum analysis for active market researchers."
);

type Props = {
    params: Promise<{ lang: string }>
}

export default async function TechnicalPage({ params }: Props) {
    const { lang } = await params;
    const normalizedLang = (lang.toUpperCase() as LangType) || 'EN';

    return (
        <Suspense fallback={<div className="min-h-screen animate-pulse bg-slate-100 dark:bg-slate-900" />}>
            <TechnicalClient lang={normalizedLang} />
        </Suspense>
    );
}
