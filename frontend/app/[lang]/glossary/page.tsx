import React, { Suspense } from 'react';
import { LangType, DICTIONARY } from '@/data/dictionary';
import { GlossaryTerm } from '@/types/glossary';
import { DynamicStructuredData } from '@/components/DynamicStructuredData';
import { GlossaryClient } from '@/components/GlossaryClient';
import { Metadata } from 'next';
import { getMultilingualMetadata } from '@/data/seo';
import { getWikiData } from '@/lib/wiki';

// Import all language data
import glossaryDataJa from '@/data/glossary-ja.json';
import glossaryDataEn from '@/data/glossary-en.json';
import glossaryDataCn from '@/data/glossary-cn.json';
import glossaryDataEs from '@/data/glossary-es.json';
import glossaryDataHi from '@/data/glossary-hi.json';
import glossaryDataId from '@/data/glossary-id.json';
import glossaryDataAr from '@/data/glossary-ar.json';

export function generateStaticParams() {
    return Object.keys(DICTIONARY).filter((lang) => lang !== 'EN').map((lang) => ({
        lang: lang.toLowerCase(),
    }));
}

type Props = {
    params: Promise<{ lang: string }>
}

const getPageTitle = (l: LangType) => {
    switch (l) {
        case 'JP': return "マクロ経済用語集";
        case 'CN': return "宏观经济术语表";
        case 'ES': return "Glosario Macroeconómico";
        case 'HI': return "मैक्रो इकोनॉमिक शब्दावली";
        case 'ID': return "Glosarium Ekonomi Makro";
        case 'AR': return "قاموس الاقتصاد الكلي";
        default: return "Macro Glossary";
    }
};

const getPageDesc = (l: LangType) => {
    switch (l) {
        case 'JP': return "2026年のマクロ経済情勢を読み解く戦略的用語集。各指標の定義、市場への影響、そしてOmniMetric GMSスコアにおける重要度を解説します。";
        case 'CN': return "解读2026年宏观经济形势的战略词汇表。解释每个指标的定义、市场影响以及在OmniMetric GMS评分中的重要性。";
        case 'ES': return "Glosario estratégico para navegar el panorama macroeconómico de 2026. Definiciones, impacto en el mercado y relevancia para la puntuación GMS.";
        case 'HI': return "2026 के मैक्रो-इकोनॉमिक परिदृश्य को समझने के लिए रणनीतिक शब्दावली。 प्रत्येक संकेतक की परिभाषा, बाजार प्रभाव और GMS स्कोर में महत्व。";
        case 'ID': return "Glosarium strategis untuk menavigasi lanskap ekonomi makro 2026. Definisi, dampak pasar, dan relevansi skor GMS.";
        case 'AR': return "مسرد استراتيجي للتنقل في المشهد الاقتصادي الكلي لعام 2026. التعريفات وتأثير السوق وأهمية درجة GMS.";
        default: return "Navigate the nuances of the 2026 macro-economic landscape. This wiki defines core metrics, their market impact, and their specific relevance to the OmniMetric GMS Score.";
    }
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { lang } = await params;
    const normalizedLang = lang.toUpperCase() as LangType;
    return getMultilingualMetadata('/glossary', normalizedLang, getPageTitle(normalizedLang), getPageDesc(normalizedLang));
}

export default async function GlossaryPage({ params }: Props) {
    const { lang } = await params;
    const normalizedLang = (DICTIONARY[lang.toUpperCase() as LangType] ? lang.toUpperCase() : 'EN') as LangType;

    // Select data source based on language
    let currentGlossaryData: GlossaryTerm[];
    switch (normalizedLang) {
        case 'JP': currentGlossaryData = glossaryDataJa; break;
        case 'CN': currentGlossaryData = glossaryDataCn; break;
        case 'ES': currentGlossaryData = glossaryDataEs; break;
        case 'HI': currentGlossaryData = glossaryDataHi; break;
        case 'ID': currentGlossaryData = glossaryDataId; break;
        case 'AR': currentGlossaryData = glossaryDataAr; break;
        case 'EN':
        default: currentGlossaryData = glossaryDataEn; break;
    }

    // JSON-LD Generation
    const breadcrumbJsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "OmniMetric", "item": "https://omnimetric.net" },
            { "@type": "ListItem", "position": 2, "name": getPageTitle(normalizedLang), "item": `https://omnimetric.net/${normalizedLang.toLowerCase()}/glossary` }
        ]
    };

    const definedTerms = currentGlossaryData.map(term => ({
        "@type": "DefinedTerm",
        "termCode": term.id,
        "name": term.term,
        "description": term.definition,
        "inDefinedTermSet": {
            "@type": "DefinedTermSet",
            "name": `OmniMetric ${getPageTitle(normalizedLang)}`,
            "url": `https://omnimetric.net/${normalizedLang.toLowerCase()}/glossary`
        }
    }));

    return (
        <Suspense fallback={<div className="min-h-screen"></div>}>
            <div className="min-h-screen text-slate-800 dark:text-slate-200 font-sans selection:bg-sky-500/30 pb-20">
                {/* Inject JSON-LD */}
                <DynamicStructuredData data={breadcrumbJsonLd} />
                <DynamicStructuredData data={{
                    "@context": "https://schema.org",
                    "@type": "DefinedTermSet",
                    "name": `OmniMetric ${getPageTitle(normalizedLang)}`,
                    "description": getPageDesc(normalizedLang),
                    "hasDefinedTerm": definedTerms
                }} />

                <GlossaryClient
                    lang={normalizedLang}
                    data={currentGlossaryData}
                    pageTitle={getPageTitle(normalizedLang)}
                    pageDesc={getPageDesc(normalizedLang)}
                    searchItems={getWikiData(normalizedLang)}
                    searchPlaceholder={DICTIONARY[normalizedLang].labels.search_placeholder}
                />
            </div>
        </Suspense>
    );
}
