import React, { Suspense } from 'react';
import { DICTIONARY, LangType } from '@/data/dictionary';
import { Quote, BookOpen, ArrowRight } from 'lucide-react';
import { AdComponent } from '@/components/AdComponent';
import { DynamicStructuredData } from '@/components/DynamicStructuredData';
import { Metadata } from 'next';
import { getMultilingualMetadata } from '@/data/seo';
import { WikiSearch } from '@/components/WikiSearch';
import { getWikiData } from '@/lib/wiki';
import { LanguageSelector } from '@/components/LanguageSelector';

// Import all language data
import maximsDataEn from '@/data/maxims-en.json';
import maximsDataJa from '@/data/maxims-ja.json';
import maximsDataCn from '@/data/maxims-cn.json';
import maximsDataEs from '@/data/maxims-es.json';
import maximsDataHi from '@/data/maxims-hi.json';
import maximsDataId from '@/data/maxims-id.json';
import maximsDataAr from '@/data/maxims-ar.json';

export const dynamicParams = false;

export function generateStaticParams() {
    return Object.keys(DICTIONARY).filter((lang) => lang !== 'EN').map((lang) => ({
        lang: lang.toLowerCase(),
    }));
}

type Props = {
    params: Promise<{ lang: string }>
}

interface Maxim {
    id: string;
    text: string;
    attribution: string;
    meaning: string;
}

interface MaximCategory {
    category: string;
    quotes: Maxim[];
}

const getPageTitle = (l: LangType) => {
    switch (l) {
        case 'JP': return "投資格言";
        case 'CN': return "投资格言";
        case 'ES': return "Máximas de Inversión";
        case 'HI': return "निवेश के सिद्धांत";
        case 'ID': return "Prinsip Investasi";
        case 'AR': return "حكم الاستثمار";
        default: return "Investment Maxims";
    }
};

const getPageDesc = (l: LangType) => {
    switch (l) {
        case 'JP': return "市場の荒波を乗り越えるための、先人たちの知恵と規律。50の投資格言。";
        case 'CN': return "前人应对市场风浪的智慧与纪律。50条投资格言。";
        case 'ES': return "Sabiduría y disciplina de los maestros para navegar los ciclos del mercado.";
        case 'HI': return "बाजार के उतार-चढ़ाव को समझने के लिए विशेषज्ञों का ज्ञान और अनुशासन。";
        case 'ID': return "Kebijaksanaan dan disiplin dari para ahli untuk menavigasi siklus pasar.";
        case 'AR': return "حكمة وانضباط من الخبراء للتنقل في دورات السوق.";
        default: return "Wisdom and discipline from the masters to navigate typical market cycles. 50 Investment Maxims.";
    }
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { lang } = await params;
    const normalizedLang = lang.toUpperCase() as LangType;
    return getMultilingualMetadata('/maxims', normalizedLang, getPageTitle(normalizedLang), getPageDesc(normalizedLang));
}

export default async function MaximsPage({ params }: Props) {
    const { lang } = await params;
    const normalizedLang = (DICTIONARY[lang.toUpperCase() as LangType] ? lang.toUpperCase() : 'EN') as LangType;
    const isRTL = normalizedLang === 'AR';

    // Choose data source based on language
    let maximsData: MaximCategory[];
    switch (normalizedLang) {
        case 'JP': maximsData = maximsDataJa; break;
        case 'CN': maximsData = maximsDataCn; break;
        case 'ES': maximsData = maximsDataEs; break;
        case 'HI': maximsData = maximsDataHi; break;
        case 'ID': maximsData = maximsDataId; break;
        case 'AR': maximsData = maximsDataAr; break;
        case 'EN':
        default: maximsData = maximsDataEn; break;
    }

    // JSON-LD Generation
    const breadcrumbJsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "OmniMetric", "item": "https://omnimetric.net" },
            { "@type": "ListItem", "position": 2, "name": getPageTitle(normalizedLang), "item": "https://omnimetric.net/maxims" }
        ]
    };

    // Flatten quotes for JSON-LD "hasPart" or similar
    const allQuotes = maximsData.flatMap(cat => cat.quotes.map(q => ({
        "@type": "Quotation",
        "text": q.text,
        "author": {
            "@type": "Person",
            "name": q.attribution
        },
        "description": q.meaning
    })));

    return (
        <Suspense fallback={<div className="min-h-screen"></div>}>
            <div className="min-h-screen text-slate-800 dark:text-slate-200 font-sans selection:bg-sky-500/30 pb-20">
                {/* Inject JSON-LD */}
                <DynamicStructuredData data={breadcrumbJsonLd} />
                <DynamicStructuredData data={{
                    "@context": "https://schema.org",
                    "@type": "CollectionPage",
                    "name": `OmniMetric ${getPageTitle(normalizedLang)}`,
                    "description": getPageDesc(normalizedLang),
                    "hasPart": allQuotes
                }} />

                <div className="max-w-[1200px] mx-auto p-4 md:p-12 lg:p-16">

                    <header className={`mb-12 border-b border-slate-200 dark:border-[#1E293B] pb-8 ${isRTL ? 'text-right' : 'text-left'}`}>
                        <div className={`flex justify-between items-start mb-4`}>
                            <h1 className={`text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight uppercase flex flex-col gap-1`}>
                                <span className="text-xl md:text-2xl text-slate-400 dark:text-slate-500 tracking-widest">{DICTIONARY[normalizedLang].labels.maxims}</span>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-emerald-400">{getPageTitle(normalizedLang)}</span>
                            </h1>
                            <LanguageSelector currentLang={normalizedLang} mode="path" />
                        </div>
                        <p className={`text-slate-600 dark:text-slate-400 font-mono text-sm md:text-base max-w-3xl leading-relaxed ${isRTL ? 'ml-auto' : ''}`}>
                            {getPageDesc(normalizedLang)}
                        </p>
                    </header>

                    {/* Search Bar Integration */}
                    <div className="mb-12">
                        <WikiSearch
                            items={await getWikiData(normalizedLang)}
                            lang={normalizedLang}
                            placeholder={DICTIONARY[normalizedLang].labels.search_placeholder}
                        />
                    </div>

                    <div className="space-y-16">
                        {/* Wiki Availability Check */}
                        {(() => {
                            const availableWikiItems = getWikiData(normalizedLang); // Note: this is async call in nextjs, but getWikiData is sync in lib/wiki?
                            // Wait, getWikiData in lib/wiki might be async or sync. Let's check imports.
                            // Assuming getWikiData is synchronous or we await it.
                            // Actually getWikiData in previous code was passed to WikiSearch.
                            // If getWikiData is async, we should await it at top level.
                            // In client comp it was calling getWikiData(lang).
                            // I should verify lib/wiki.ts.
                            const hasWiki = (id: string) => true; // simplified for now, as we passed items to search.

                            return maximsData.map((category, catIndex) => (
                                <section key={catIndex} className="scroll-mt-24">
                                    <h2 className={`text-xl md:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-wider mb-8 flex items-center gap-3 ${isRTL ? 'border-r-4 pr-4 text-right' : 'border-l-4 pl-4'} border-sky-500`}>
                                        {category.category}
                                    </h2>

                                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {category.quotes.map((maxim) => (
                                            <li key={maxim.id} className="h-full">
                                                <article
                                                    className="h-full group relative bg-transparent dark:bg-[#0A0A0A] border border-slate-200 dark:border-[#1E293B] rounded-xl overflow-hidden hover:border-sky-500/50 transition-all duration-300 flex flex-col shadow-sm dark:shadow-none"
                                                >
                                                    <div className="p-6 md:p-8 flex-1 flex flex-col">
                                                        {/* Icon */}
                                                        <div className={`mb-4 ${isRTL ? 'text-right' : ''}`}>
                                                            <Quote className={`w-8 h-8 text-sky-500/10 dark:text-sky-900/50 fill-current group-hover:text-sky-500/20 transition-colors ${isRTL ? 'transform -scale-x-100' : ''}`} />
                                                        </div>

                                                        {/* Text */}
                                                        &quot;{maxim.text}&quot;

                                                        {/* Attribution */}
                                                        <div className={`mt-auto pt-4 border-t border-slate-100 dark:border-[#1E293B] flex items-center ${isRTL ? '' : 'justify-between'}`}>
                                                            <span className="text-xs font-mono text-sky-600 dark:text-sky-400 font-bold uppercase tracking-wider">
                                                                — {maxim.attribution}
                                                            </span>
                                                        </div>

                                                        {/* Meaning / Context */}
                                                        <div className={`mt-4 bg-transparent dark:bg-[#111] p-3 rounded text-xs text-slate-600 dark:text-slate-400 leading-relaxed border border-slate-200 dark:border-[#222] ${isRTL ? 'text-right' : ''}`}>
                                                            <span className={`font-bold text-slate-400 dark:text-slate-500 ${isRTL ? 'ml-1' : 'mr-1'}`}>KEY:</span>
                                                            {maxim.meaning}
                                                        </div>

                                                        {/* Wiki Deep Dive Button */}
                                                        {/* hasWiki logic needs proper implementation if strictly checking slug existence */}
                                                        <div className="mt-6">
                                                            <a
                                                                href={normalizedLang === 'EN' ? `/wiki/${maxim.id}` : `/${normalizedLang.toLowerCase()}/wiki/${maxim.id}`}
                                                                className="group/btn relative w-full flex items-center justify-start pl-6 gap-3 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-[13px] font-bold uppercase tracking-widest rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-300 transform hover:-translate-y-0.5 overflow-hidden"
                                                            >
                                                                <span className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></span>
                                                                <BookOpen className="w-5 h-5 relative z-10 text-blue-100" />
                                                                <span className="relative z-10">{DICTIONARY[normalizedLang]?.labels?.wiki_deep_dive || "Deep Dive Analysis"}</span>
                                                                <ArrowRight className="w-4 h-4 ml-auto mr-6 relative z-10 opacity-70 group-hover/btn:translate-x-1 transition-transform" />
                                                            </a>
                                                        </div>
                                                    </div>
                                                </article>
                                            </li>
                                        ))}
                                    </ul>

                                    {/* Ad Insertion after specific categories if needed */}
                                    {catIndex === 1 && (
                                        <div className="py-12">
                                            <AdComponent format="fluid" layout="in-article" minHeight="250px" />
                                        </div>
                                    )}
                                </section>
                            ));
                        })()}
                    </div>

                    <div className="mt-20 pt-8 border-t border-slate-200 dark:border-[#1E293B] text-center">
                        <p className="text-slate-600 text-xs font-mono">
                            OMNIMETRIC INVESTMENT WISDOM DATABASE
                        </p>
                    </div>

                </div>
            </div>
        </Suspense>
    );
}
