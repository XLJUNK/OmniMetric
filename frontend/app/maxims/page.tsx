import React, { Suspense } from 'react';
import { DICTIONARY } from '@/data/dictionary';
import { Quote, BookOpen, ArrowRight } from 'lucide-react';
import { AdComponent } from '@/components/AdComponent';
import { DynamicStructuredData } from '@/components/DynamicStructuredData';
import { Metadata } from 'next';
import { getMultilingualMetadata } from '@/data/seo';
import { WikiSearch } from '@/components/WikiSearch';
import { getWikiData } from '@/lib/wiki';
import { LanguageSelector } from '@/components/LanguageSelector';
import maximsDataEn from '@/data/maxims-en.json';

export async function generateMetadata(): Promise<Metadata> {
    const normalizedLang = 'EN';
    return getMultilingualMetadata('/maxims', normalizedLang, "Investment Maxims", "Wisdom and discipline from the masters to navigate typical market cycles. 50 Investment Maxims.");
}

export default async function MaximsPage() {
    const normalizedLang = 'EN';
    const isRTL = false;
    const maximsData = maximsDataEn;

    const breadcrumbJsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "OmniMetric", "item": "https://www.omnimetric.net" },
            { "@type": "ListItem", "position": 2, "name": "Investment Maxims", "item": "https://www.omnimetric.net/maxims" }
        ]
    };

    const allQuotes = maximsData.flatMap(cat => cat.quotes.map(q => ({
        "@type": "Quotation",
        "text": q.text,
        "author": { "@type": "Person", "name": q.attribution },
        "description": q.meaning
    })));

    return (
        <Suspense fallback={<div className="min-h-screen bg-black"></div>}>
            <div className="min-h-screen bg-black text-slate-200 font-sans selection:bg-sky-500/30 pb-20">
                <DynamicStructuredData data={breadcrumbJsonLd} />
                <DynamicStructuredData data={{
                    "@context": "https://schema.org",
                    "@type": "CollectionPage",
                    "name": "OmniMetric Investment Maxims",
                    "description": "Wisdom and discipline from the masters to navigate typical market cycles. 50 Investment Maxims.",
                    "hasPart": allQuotes
                }} />

                <div className="max-w-[1200px] mx-auto p-4 md:p-12 lg:p-16">
                    <header className="mb-12 border-b border-slate-800 pb-8 text-left">
                        <div className="flex justify-between items-start mb-4">
                            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight uppercase flex flex-col gap-1">
                                <span className="text-xl md:text-2xl text-slate-500 tracking-widest">{DICTIONARY.EN.labels.maxims}</span>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-emerald-400">Investment Maxims</span>
                            </h1>
                            <LanguageSelector currentLang="EN" mode="path" />
                        </div>
                        <p className="text-slate-400 font-mono text-sm md:text-base max-w-3xl leading-relaxed">
                            Wisdom and discipline from the masters to navigate typical market cycles. 50 Investment Maxims.
                        </p>
                    </header>

                    <div className="mb-12">
                        <WikiSearch
                            items={await getWikiData('EN')}
                            lang="EN"
                            placeholder={DICTIONARY.EN.labels.search_placeholder}
                        />
                    </div>

                    <div className="space-y-16">
                        {maximsData.map((category, catIndex) => (
                            <section key={catIndex} className="scroll-mt-24">
                                <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-wider mb-8 flex items-center gap-3 border-l-4 pl-4 border-sky-500">
                                    {category.category}
                                </h2>

                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {category.quotes.map((maxim) => (
                                        <li key={maxim.id} className="h-full">
                                            <article className="h-full group relative bg-[#0A0A0A] border border-slate-800 rounded-xl overflow-hidden hover:border-sky-500/50 transition-all duration-300 flex flex-col shadow-sm dark:shadow-none">
                                                <div className="p-6 md:p-8 flex-1 flex flex-col">
                                                    <div className="mb-4">
                                                        <Quote className="w-8 h-8 text-sky-900/50 fill-current group-hover:text-sky-500/20 transition-colors" />
                                                    </div>
                                                    <p className="text-slate-200 leading-relaxed font-medium mb-6 flex-1">
                                                        &quot;{maxim.text}&quot;
                                                    </p>
                                                    <div className="mt-auto pt-4 border-t border-slate-800 flex items-center justify-between">
                                                        <span className="text-xs font-mono text-sky-400 font-bold uppercase tracking-wider">
                                                            — {maxim.attribution}
                                                        </span>
                                                    </div>
                                                    <div className="mt-4 bg-[#111] p-3 rounded text-xs text-slate-400 leading-relaxed border border-slate-800">
                                                        <span className="font-bold text-slate-500 mr-1">KEY:</span>
                                                        {maxim.meaning}
                                                    </div>
                                                    <div className="mt-6">
                                                        <a href={`/wiki/${maxim.id}`} className="group/btn relative w-full flex items-center justify-start pl-6 gap-3 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-[13px] font-bold uppercase tracking-widest rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-300 transform hover:-translate-y-0.5 overflow-hidden">
                                                            <span className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></span>
                                                            <BookOpen className="w-5 h-5 relative z-10 text-blue-100" />
                                                            <span className="relative z-10">{DICTIONARY.EN?.labels?.wiki_deep_dive || "Deep Dive Analysis"}</span>
                                                            <ArrowRight className="w-4 h-4 ml-auto mr-6 relative z-10 opacity-70 group-hover/btn:translate-x-1 transition-transform" />
                                                        </a>
                                                    </div>
                                                </div>
                                            </article>
                                        </li>
                                    ))}
                                </ul>
                                {catIndex === 1 && (
                                    <div className="py-12">
                                        <AdComponent format="fluid" layout="in-article" minHeight="250px" />
                                    </div>
                                )}
                            </section>
                        ))}
                    </div>

                    <div className="mt-20 pt-8 border-t border-slate-800 text-center">
                        <p className="text-slate-600 text-xs font-mono">OMNIMETRIC INVESTMENT WISDOM DATABASE</p>
                    </div>
                </div>
            </div>
        </Suspense>
    );
}
