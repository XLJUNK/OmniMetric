'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { LangType, DICTIONARY } from '@/data/dictionary';
import glossaryDataJa from '@/data/glossary-ja.json';
import glossaryDataEn from '@/data/glossary-en.json';
import { GlossaryTerm, GlossaryData } from '@/types/glossary';
import { ArrowUp, ArrowDown, BookOpen, Quote, Hash, Link as LinkIcon, ChevronRight } from 'lucide-react';
import { DynamicStructuredData } from '@/components/DynamicStructuredData';
import { AdSenseSlot } from '@/components/AdSenseSlot';

export default function GlossaryPage() {
    return (
        <React.Suspense fallback={<div className="min-h-screen bg-[#020617] flex items-center justify-center text-sky-500 font-mono text-xs animate-pulse">LOADING GLOSSARY INDEX...</div>}>
            <GlossaryContent />
        </React.Suspense>
    );
}

function GlossaryContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const queryLang = searchParams.get('lang') as LangType;
    const lang = queryLang && DICTIONARY[queryLang] ? queryLang : 'EN';
    const t = DICTIONARY[lang];

    // Language Toggle logic for Glossary Data
    // Requirement: JP = Japanese, Others = English
    const isJa = lang === 'JP';
    const currentGlossaryData = isJa ? glossaryDataJa : glossaryDataEn;

    // Group data by category
    const categories = Array.from(new Set(currentGlossaryData.map(item => item.category)));
    const groupedData: Record<string, GlossaryTerm[]> = {};

    categories.forEach(cat => {
        groupedData[cat] = currentGlossaryData.filter(item => item.category === cat);
    });

    // Handle initial hash navigation manually if needed, though browser default usually works
    useEffect(() => {
        if (typeof window !== 'undefined' && window.location.hash) {
            const id = window.location.hash.replace('#', '');
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }, []);

    // JSON-LD Generation
    const breadcrumbJsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "OmniMetric", "item": "https://omnimetric.net" },
            { "@type": "ListItem", "position": 2, "name": isJa ? "マクロ経済用語集" : "Macro Glossary", "item": "https://omnimetric.net/glossary" }
        ]
    };

    const definedTerms = currentGlossaryData.map(term => ({
        "@type": "DefinedTerm",
        "termCode": term.id,
        "name": term.term,
        "description": term.definition,
        "inDefinedTermSet": {
            "@type": "DefinedTermSet",
            "name": "OmniMetric Macro Glossary",
            "url": "https://omnimetric.net/glossary"
        }
    }));

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-sky-500/30 pb-20">
            {/* Inject JSON-LD */}
            <DynamicStructuredData data={breadcrumbJsonLd} />
            <DynamicStructuredData data={{
                "@context": "https://schema.org",
                "@type": "DefinedTermSet",
                "name": "OmniMetric Macro Glossary",
                "description": "Comprehensive guide to 2026 macro-economic indicators and strategies.",
                "hasDefinedTerm": definedTerms
            }} />

            <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row">

                {/* SIDEBAR TOC (Desktop) */}
                <aside className="hidden lg:block w-[300px] pl-8 pr-6 py-12 sticky top-[60px] h-[calc(100vh-60px)] overflow-y-auto border-r border-[#1e293b]/50">
                    <div className="flex items-center gap-3 mb-8 text-sky-500">
                        <BookOpen className="w-6 h-6" />
                        <h1 className="text-xl font-black tracking-widest uppercase">{isJa ? "マクロ WIKI" : "Macro Wiki"}</h1>
                    </div>

                    <nav className="space-y-6">
                        {categories.map((cat) => (
                            <div key={cat}>
                                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 border-b border-slate-800 pb-1">
                                    {cat}
                                </h3>
                                <ul className="space-y-1">
                                    {groupedData[cat].map((item) => (
                                        <li key={item.id}>
                                            <a
                                                href={`#${item.id}`}
                                                className="block text-[11px] text-slate-400 hover:text-white py-1 pl-2 border-l-2 border-transparent hover:border-sky-500 transition-all truncate"
                                            >
                                                {item.term}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </nav>

                    {/* SIDEBAR AD (Desktop) */}
                    <div className="mt-12">
                        <AdSenseSlot variant="square" />
                    </div>
                </aside>

                {/* MAIN CONTENT */}
                <main className="flex-1 p-4 md:p-12 lg:p-16">
                    <header className="mb-16 border-b border-[#1E293B] pb-8">
                        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">
                            Strategic <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-emerald-400">{isJa ? "Glossary" : "Glossary"}</span>
                        </h1>
                        <p className="text-slate-400 font-mono text-sm md:text-base max-w-3xl leading-relaxed">
                            {isJa
                                ? "2026年のマクロ経済情勢を読み解く戦略的用語集。各指標の定義、市場への影響、そしてOmniMetric GMSスコアにおける重要度を解説します。"
                                : "Navigate the nuances of the 2026 macro-economic landscape. This wiki defines core metrics, their market impact, and their specific relevance to the OmniMetric GMS Score."}
                        </p>
                    </header>

                    <div className="space-y-20">
                        {categories.map((cat, index) => (
                            <React.Fragment key={cat}>
                                <section className="scroll-mt-24">
                                    <h2 className="text-2xl font-black text-white uppercase tracking-wider mb-8 flex items-center gap-3">
                                        <span className="w-2 h-8 bg-sky-500 rounded-sm"></span>
                                        {cat}
                                    </h2>

                                    <div className="grid grid-cols-1 gap-6">
                                        {groupedData[cat].map((item) => (
                                            <article
                                                key={item.id}
                                                id={item.id}
                                                className="group relative bg-[#0A0A0A] border border-[#1E293B] rounded-xl overflow-hidden hover:border-sky-500/50 transition-all duration-300 scroll-mt-32"
                                            >
                                                {/* Header Gradient Line */}
                                                <div className="h-1 w-full bg-gradient-to-r from-[#1E293B] via-[#1E293B] to-transparent group-hover:from-sky-500 group-hover:via-emerald-500 transition-all duration-500"></div>

                                                <div className="p-6 md:p-8">
                                                    {/* Title Row */}
                                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                                                        <h3 className="text-xl md:text-2xl font-bold text-slate-100 flex items-center gap-3">
                                                            {item.term}
                                                            <a href={`#${item.id}`} className="text-slate-700 hover:text-sky-500 transition-colors opacity-0 group-hover:opacity-100">
                                                                <LinkIcon className="w-4 h-4" />
                                                            </a>
                                                        </h3>
                                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#111] border border-[#333] rounded-full text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                                                            <Hash className="w-3 h-3 text-slate-600" />
                                                            {item.id.replace(/-/g, ' ')}
                                                        </span>
                                                    </div>

                                                    {/* Definition */}
                                                    <p className="text-slate-300 leading-relaxed mb-8 text-sm md:text-base border-l-2 border-slate-700 pl-4">
                                                        {item.definition}
                                                    </p>

                                                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

                                                        {/* Market Impact (Left Col) */}
                                                        <div className="space-y-4">
                                                            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-2">{isJa ? "市場への影響" : "Market Reaction"}</h4>

                                                            <div className="pl-4 border-l border-[#222] space-y-4">
                                                                {/* UP */}
                                                                <div className="flex flex-col gap-1">
                                                                    <div className="flex items-center gap-2">
                                                                        <div className="w-5 h-5 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/30">
                                                                            <ArrowUp className="w-3 h-3 text-blue-400" />
                                                                        </div>
                                                                        <span className="text-blue-400 font-bold text-xs uppercase tracking-wide">
                                                                            {isJa ? "上昇時:" : "RISING:"}
                                                                        </span>
                                                                    </div>
                                                                    <span className="text-slate-400 text-xs leading-relaxed block pl-7">
                                                                        {item.market_impact.up}
                                                                    </span>
                                                                </div>

                                                                {/* DOWN */}
                                                                <div className="flex flex-col gap-1">
                                                                    <div className="flex items-center gap-2">
                                                                        <div className="w-5 h-5 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/30">
                                                                            <ArrowDown className="w-3 h-3 text-red-400" />
                                                                        </div>
                                                                        <span className="text-red-400 font-bold text-xs uppercase tracking-wide">
                                                                            {isJa ? "下落時:" : "FALLING:"}
                                                                        </span>
                                                                    </div>
                                                                    <span className="text-slate-400 text-xs leading-relaxed block pl-7">
                                                                        {item.market_impact.down}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Context 2026 (Right Col) */}
                                                        <div className="bg-sky-950/10 border border-sky-900/20 rounded-lg p-5 relative">
                                                            {/* Removed large background Quote icon as per user request to prevent overlap */}
                                                            <h4 className="text-[10px] font-bold text-sky-500 uppercase tracking-[0.2em] mb-3 flex items-center gap-2 relative z-10">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse"></span>
                                                                Context 2026
                                                            </h4>
                                                            <p className="text-sky-200/80 text-xs md:text-sm font-serif italic leading-relaxed relative z-10 pl-2 border-l-2 border-sky-500/30">
                                                                "{item.context_2026}"
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Footer Relevance */}
                                                    <div className="mt-6 pt-4 border-t border-[#1E293B] flex items-center gap-2 text-[10px] text-slate-500 font-mono uppercase tracking-tight">
                                                        <span className="font-bold text-slate-400">GMS Relevance:</span>
                                                        {item.gms_relevance}
                                                    </div>

                                                </div>
                                            </article>
                                        ))}
                                    </div>
                                </section>
                                {/* DYNAMIC AD INSERTION (After 3rd Category) */}
                                {index === 2 && (
                                    <div className="py-8" key="mid-ad">
                                        <AdSenseSlot variant="responsive" />
                                    </div>
                                )}
                            </React.Fragment>
                        ))}

                        {/* BOTTOM AD */}
                        <div className="pt-8 border-t border-[#1E293B] mt-12">
                            <h3 className="text-[#666] text-[10px] font-black uppercase tracking-[0.2em] mb-4">Sponsored</h3>
                            <AdSenseSlot variant="responsive" />
                        </div>
                    </div>
                    {/* BOTTOM SPACE */}
                    <div className="h-32"></div>
                </main>
            </div>
        </div>
    );
}
