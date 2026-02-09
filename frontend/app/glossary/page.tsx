import React, { Suspense } from 'react';
import { DICTIONARY } from '@/data/dictionary';
import { DynamicStructuredData } from '@/components/DynamicStructuredData';
import { GlossaryClient } from '@/components/GlossaryClient';
import { Metadata } from 'next';
import { getMultilingualMetadata } from '@/data/seo';
import { getWikiData } from '@/lib/wiki';
import glossaryDataEn from '@/data/glossary-en.json';

export async function generateMetadata(): Promise<Metadata> {
    return getMultilingualMetadata('/glossary', 'EN', "Macro Glossary", "Navigate the nuances of the 2026 macro-economic landscape. This wiki defines core metrics, their market impact, and their specific relevance to the OmniMetric GMS Score.");
}

export default async function GlossaryPage() {
    const normalizedLang = 'EN';
    const currentGlossaryData = glossaryDataEn;

    const breadcrumbJsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "OmniMetric", "item": "https://omnimetric.net" },
            { "@type": "ListItem", "position": 2, "name": "Macro Glossary", "item": `https://omnimetric.net/glossary` }
        ]
    };

    const definedTerms = currentGlossaryData.map(term => ({
        "@type": "DefinedTerm",
        "termCode": term.id,
        "name": term.term,
        "description": term.definition,
        "inDefinedTermSet": {
            "@type": "DefinedTermSet",
            "name": `OmniMetric Macro Glossary`,
            "url": `https://omnimetric.net/glossary`
        }
    }));

    return (
        <Suspense fallback={<div className="min-h-screen bg-black"></div>}>
            <div className="min-h-screen bg-black text-slate-200 font-sans selection:bg-sky-500/30 pb-20">
                <DynamicStructuredData data={breadcrumbJsonLd} />
                <DynamicStructuredData data={{
                    "@context": "https://schema.org",
                    "@type": "DefinedTermSet",
                    "name": `OmniMetric Macro Glossary`,
                    "description": "Navigate the nuances of the 2026 macro-economic landscape. This wiki defines core metrics, their market impact, and their specific relevance to the OmniMetric GMS Score.",
                    "hasDefinedTerm": definedTerms
                }} />

                <GlossaryClient
                    lang="EN"
                    data={currentGlossaryData}
                    pageTitle="Macro Glossary"
                    pageDesc="Navigate the nuances of the 2026 macro-economic landscape. This wiki defines core metrics, their market impact, and their specific relevance to the OmniMetric GMS Score."
                    searchItems={getWikiData('EN')}
                    searchPlaceholder={DICTIONARY.EN.labels.search_placeholder}
                />
            </div>
        </Suspense>
    );
}
