import React, { Suspense } from 'react';
import { MultiAssetSummary } from '@/components/MultiAssetSummary';
import { Metadata } from 'next';
import { DICTIONARY } from '@/data/dictionary';

export function generateStaticParams() {
    return Object.keys(DICTIONARY).map((lang) => ({
        lang: lang.toLowerCase(),
    }));
}

// 100% Static Review Page (Pre-rendered via generateStaticParams)

export const metadata: Metadata = {
    title: "UI Review | OmniMetric Terminal",
    description: "Private environment for verifying Next-Gen Universal Responsive UI (v2.4.0).",
    robots: "noindex, nofollow"
};

type Props = {
    params: Promise<{ lang: string }>
}

export default async function ReviewPage({ params }: Props) {
    await params; // Consume params to satisfy build requirements if needed or just ignore
    return (
        <div className="relative">
            <div className="bg-sky-500/10 border-b border-sky-500/20 px-4 py-2 text-[10px] font-bold text-sky-500 uppercase tracking-widest text-center z-[10000]">
                Global Macro Signal v2.4.0 (Private Review Environment)
            </div>
            <Suspense fallback={null}>
                <MultiAssetSummary />
            </Suspense>
        </div>
    );
}
