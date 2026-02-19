'use client';

import React, { useEffect } from 'react';
import { LangType } from '@/data/dictionary';
import { GlossaryTerm } from '@/types/glossary';
import { WikiItem } from '@/lib/wiki';
import { ArrowUp, ArrowDown, BookOpen, Hash, Link as LinkIcon, ArrowRight } from 'lucide-react';
import { AdComponent } from '@/components/AdComponent';
import { TVPartnerCard } from '@/components/TVPartnerCard';
import { WikiSearch } from '@/components/WikiSearch';
import { LanguageSelector } from '@/components/LanguageSelector';
import { DICTIONARY } from '@/data/dictionary';

interface GlossaryClientProps {
    lang: LangType;
    data: GlossaryTerm[];
    pageTitle: string;
    pageDesc: string;
    searchItems: WikiItem[];
    searchPlaceholder?: string;
}

export const GlossaryClient = ({ lang, data, pageTitle, pageDesc, searchItems, searchPlaceholder }: GlossaryClientProps) => {
    const isRTL = lang === 'AR';
    const isJa = lang === 'JP';

    // Group data by category
    // Note: data is already filtered by language from the server
    const categories = Array.from(new Set(data.map(item => item.category)));
    const groupedData: Record<string, GlossaryTerm[]> = {};

    categories.forEach(cat => {
        groupedData[cat] = data.filter(item => item.category === cat);
    });

    // Handle initial hash navigation manually if needed
    useEffect(() => {
        if (typeof window !== 'undefined' && window.location.hash) {
            const id = window.location.hash.replace('#', '');
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }, [lang]);

    // Removed getWikiLabel function as it's no longer needed

    return (
        <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row">

            {/* SIDEBAR TOC (Desktop) */}
            <aside className={`hidden lg:block w-[300px] py-12 sticky top-[60px] h-[calc(100vh-60px)] overflow-y-auto ${isRTL ? 'border-l border-slate-200 dark:border-[#1e293b]/50 pl-6 pr-8' : 'border-r border-slate-200 dark:border-[#1e293b]/50 pl-8 pr-6'}`}>
                <div className={`flex items-center gap-3 mb-8 text-sky-500`}>
                    <BookOpen className="w-6 h-6" />
                    <h1 className="text-xl font-black tracking-widest uppercase">{DICTIONARY[lang].labels.wiki}</h1>
                </div>

                <nav className="space-y-6">
                    {categories.map((cat) => (
                        <div key={cat}>
                            <h3 className={`text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 border-b border-slate-200 dark:border-slate-800 pb-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                                {cat}
                            </h3>
                            <ul className="space-y-1">
                                {groupedData[cat].map((item) => (
                                    <li key={item.id}>
                                        <a
                                            href={`#${item.id}`}
                                            className={`block text-[11px] text-slate-500 dark:text-slate-400 hover:text-sky-600 dark:hover:text-white py-1 border-transparent hover:border-sky-500 transition-all truncate ${isRTL ? 'text-right pr-2 border-r-2 hover:border-r-sky-500' : 'text-left pl-2 border-l-2 hover:border-l-sky-500'}`}
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
                    <AdComponent format="vertical" minHeight="600px" />
                </div>
            </aside>



            {/* MAIN CONTENT */}
            <main className="flex-1 p-4 md:p-12 lg:p-16">
                <header className={`mb-16 border-b border-slate-200 dark:border-[#1E293B] pb-8 ${isRTL ? 'text-right' : 'text-left'}`}>
                    <div className={`flex justify-between items-start mb-4`}>
                        <h1 className={`text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight flex flex-col md:flex-row gap-2 md:gap-3 ${isRTL ? 'text-right' : 'text-left'}`}>
                            <span className="text-slate-400 dark:text-slate-500 tracking-widest text-xl md:text-3xl uppercase">{DICTIONARY[lang].labels.wiki}</span>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-emerald-400">{pageTitle}</span>
                        </h1>
                        <LanguageSelector currentLang={lang} />
                    </div>
                    <p className={`text-slate-600 dark:text-slate-400 font-mono text-sm md:text-base max-w-3xl leading-relaxed ${isRTL ? 'ml-auto' : ''}`}>
                        {pageDesc}
                    </p>
                </header>

                <div className="mb-20">
                    <WikiSearch
                        items={searchItems}
                        lang={lang}
                        placeholder={searchPlaceholder}
                    />
                </div>

                <div className="space-y-20">
                    {categories.map((cat, categoryIndex) => (
                        <React.Fragment key={cat}>
                            <section className="scroll-mt-24">
                                <h2 className={`text-2xl font-black text-slate-900 dark:text-white uppercase tracking-wider mb-8 flex items-center gap-3`}>
                                    <span className="w-2 h-8 bg-sky-500 rounded-sm"></span>
                                    {cat}
                                </h2>

                                <div className="grid grid-cols-1 gap-6">
                                    {groupedData[cat].map((item, index) => (
                                        <React.Fragment key={item.id}>
                                            <article
                                                id={item.id}
                                                className="group relative bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-[#1E293B] rounded-xl overflow-hidden hover:border-sky-500/50 transition-all duration-300 scroll-mt-32 shadow-sm dark:shadow-none"
                                            >
                                                {/* Header Gradient Line */}
                                                <div className="h-1 w-full bg-gradient-to-r from-slate-200 dark:from-[#1E293B] via-slate-200 dark:via-[#1E293B] to-transparent group-hover:from-sky-500 group-hover:via-emerald-500 transition-all duration-500"></div>

                                                <div className="p-6 md:p-8">
                                                    {/* Title Row */}
                                                    <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6`}>
                                                        <h3 className={`text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-3`}>
                                                            {item.term}
                                                            <a href={`#${item.id}`} aria-label="Link to term" className="text-slate-400 dark:text-slate-700 hover:text-sky-500 transition-colors opacity-0 group-hover:opacity-100">
                                                                <LinkIcon className="w-4 h-4" />
                                                            </a>
                                                        </h3>
                                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-[#111] border border-slate-200 dark:border-[#333] rounded-full text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                                            <Hash className="w-3 h-3 text-slate-600" />
                                                            {item.id.replace(/-/g, ' ')}
                                                        </span>

                                                        {/* Wiki Deep Dive Button */}
                                                        {searchItems.some(wiki => wiki.slug === item.id) && (
                                                            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-[#1E293B]">
                                                                <a
                                                                    href={lang === 'EN' ? `/wiki/${item.id}` : `/${lang.toLowerCase()}/wiki/${item.id}`}
                                                                    className="group/btn relative w-full flex items-center justify-start pl-6 gap-3 py-4 bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-400 hover:to-emerald-400 text-white text-[13px] font-bold uppercase tracking-widest rounded-xl shadow-lg hover:shadow-emerald-500/20 transition-all duration-300 transform hover:-translate-y-0.5 overflow-hidden"
                                                                >
                                                                    <span className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></span>
                                                                    <BookOpen className="w-5 h-5 relative z-10 text-emerald-100" />
                                                                    <span className="relative z-10">{DICTIONARY[lang]?.labels?.wiki_deep_dive || "Read Full Deep Dive"}</span>
                                                                    <ArrowRight className="w-4 h-4 ml-auto mr-6 relative z-10 opacity-70 group-hover/btn:translate-x-1 transition-transform" />
                                                                </a>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Definition */}
                                                    <p className={`text-slate-600 dark:text-slate-300 leading-relaxed mb-8 text-sm md:text-base ${isRTL ? 'text-right border-r-2 border-slate-200 dark:border-slate-700 pr-4' : 'text-left border-l-2 border-slate-200 dark:border-slate-700 pl-4'}`}>
                                                        {item.definition}
                                                    </p>

                                                    <div className={`grid grid-cols-1 xl:grid-cols-2 gap-8`}>

                                                        {/* Market Impact (Left Col) */}
                                                        <div className="space-y-4">
                                                            <h4 className={`text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                                                                {isJa ? "市場への影響" : (lang === 'CN' ? '市场影响' : (lang === 'ES' ? 'Impacto de Mercado' : (lang === 'AR' ? 'تأثير السوق' : (lang === 'HI' ? 'बाजार प्रभाव' : (lang === 'ID' ? 'Dampak Pasar' : 'Market Reaction')))))}
                                                            </h4>

                                                            <div className={`border-slate-200 dark:border-slate-800/50 space-y-4 ${isRTL ? 'pr-4 border-r' : 'pl-4 border-l border-slate-200 dark:border-[#222]'}`}>
                                                                {/* UP */}
                                                                <div className="flex flex-col gap-1">
                                                                    <div className={`flex items-center gap-2`}>
                                                                        <div className="w-5 h-5 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/30">
                                                                            <ArrowUp className="w-3 h-3 text-blue-400" />
                                                                        </div>
                                                                        <span className="text-blue-400 font-bold text-xs uppercase tracking-wide">
                                                                            {isJa ? "上昇時:" : (lang === 'CN' ? "上升时:" : (lang === 'ES' ? "SUBIENDO:" : (lang === 'AR' ? "صعوداً:" : "RISING:")))}
                                                                        </span>
                                                                    </div>
                                                                    <span className={`text-slate-600 dark:text-slate-400 text-xs leading-relaxed block ${isRTL ? 'pr-7 text-right' : 'pl-7 text-left'}`}>
                                                                        {item.market_impact.up}
                                                                    </span>
                                                                </div>

                                                                {/* DOWN */}
                                                                <div className="flex flex-col gap-1">
                                                                    <div className={`flex items-center gap-2`}>
                                                                        <div className="w-5 h-5 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/30">
                                                                            <ArrowDown className="w-3 h-3 text-red-400" />
                                                                        </div>
                                                                        <span className="text-red-400 font-bold text-xs uppercase tracking-wide">
                                                                            {isJa ? "下落時:" : (lang === 'CN' ? "下跌时:" : (lang === 'ES' ? "CAYENDO:" : (lang === 'AR' ? "هبوطاً:" : "FALLING:")))}
                                                                        </span>
                                                                    </div>
                                                                    <span className={`text-slate-600 dark:text-slate-400 text-xs leading-relaxed block ${isRTL ? 'pr-7 text-right' : 'pl-7 text-left'}`}>
                                                                        {item.market_impact.down}
                                                                    </span>
                                                                </div>
                                                            </div>

                                                            {/* NEW: Subtle Text Link after Market Impact */}
                                                            <div className={`mt-4 ${isRTL ? 'pr-4 border-r border-slate-200 dark:border-[#222]' : 'pl-4 border-l border-slate-200 dark:border-[#222]'}`}>
                                                                <TVPartnerCard lang={lang} variant="text-link" />
                                                            </div>
                                                        </div>

                                                        {/* Context 2026 (Right Col) */}
                                                        <div className={`bg-sky-50 dark:bg-sky-950/10 border border-sky-200 dark:border-sky-900/20 rounded-lg p-5 relative ${isRTL ? 'text-right' : 'text-left'}`}>
                                                            <h4 className={`text-[10px] font-bold text-sky-500 uppercase tracking-[0.2em] mb-3 flex items-center gap-2 relative z-10`}>
                                                                <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse"></span>
                                                                Context 2026
                                                            </h4>
                                                            <p className={`text-sky-800/80 dark:text-sky-200/80 text-xs md:text-sm font-serif italic leading-relaxed relative z-10 ${isRTL ? 'pr-2 border-r-2 border-sky-500/30' : 'pl-2 border-l-2 border-sky-500/30'}`}>
                                                                &quot;{item.context_2026}&quot;
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Footer Relevance */}
                                                    <div className={`mt-6 pt-4 border-t border-slate-200 dark:border-[#1E293B] flex items-center gap-2 text-[10px] text-slate-500 font-mono uppercase tracking-tight`}>
                                                        <span className="font-bold text-slate-400">GMS Relevance:</span>
                                                        {item.gms_relevance}
                                                    </div>

                                                </div>
                                            </article>

                                            {/* Strategic Partner Card Injection (Every 5 terms) */}
                                            {(index + 1) % 5 === 0 && (
                                                <div className="py-2">
                                                    <TVPartnerCard lang={lang} variant="default" />
                                                </div>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </div>
                            </section>

                            {/* DYNAMIC AD INSERTION (After 3rd Category) */}
                            {categoryIndex === 2 && (
                                <div className="py-8" key="mid-ad">
                                    <AdComponent format="fluid" layout="in-article" minHeight="250px" />
                                </div>
                            )}
                        </React.Fragment>
                    ))}

                    {/* BOTTOM AD */}
                    <div className="pt-8 border-t border-slate-200 dark:border-[#1E293B] mt-12">
                        <h3 className="text-[#666] text-[10px] font-black uppercase tracking-[0.2em] mb-4">Sponsored</h3>
                        <AdComponent format="fluid" layout="in-article" minHeight="250px" />
                    </div>
                </div>
                {/* BOTTOM SPACE */}
                <div className="h-32"></div>
            </main>
        </div >
    );
};
