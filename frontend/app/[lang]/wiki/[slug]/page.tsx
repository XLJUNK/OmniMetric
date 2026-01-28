import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { LangType, DICTIONARY } from '@/data/dictionary';
import { getWikiItem, getAllSlugs, WikiItem, getWikiData } from '@/lib/wiki';
import { DynamicStructuredData } from '@/components/DynamicStructuredData';
import { AdSenseSlot } from '@/components/AdSenseSlot';
import { ArrowLeft, Share2, TrendingUp, BookOpen, Quote, Activity, Home, ChevronRight, Globe, Cpu, Scale, Zap, Users } from 'lucide-react';
import { Metadata } from 'next';

// UI Helpers
const ExpertCard = ({ role, icon: Icon, color, bg, content, isRTL }: any) => {
    if (!content) return null;
    return (
        <div className={`p-4 rounded-xl border border-border bg-card hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors ${isRTL ? 'text-right' : 'text-left'}`}>
            <div className={`flex items-center gap-2 mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className={`p-1.5 rounded ${bg} ${color}`}>
                    <Icon className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{role}</span>
            </div>
            <p className="text-xs md:text-sm leading-6 md:leading-7 font-medium text-slate-700 dark:text-slate-300">
                &ldquo;{content}&rdquo;
            </p>
        </div>
    );
};

// Generate params for SSG
export async function generateStaticParams() {
    const langs = Object.keys(DICTIONARY).map(l => l.toLowerCase());
    const slugs = getAllSlugs();

    // Cross product
    const params = [];
    for (const lang of langs) {
        for (const slug of slugs) {
            params.push({ lang, slug });
        }
    }
    return params;
}

type Props = {
    params: Promise<{ lang: string; slug: string }>;
};

// Localized SEO helper
function getLocalizedSEODescription(item: WikiItem, lang: string): string {
    const title = item.title;
    const descriptions: Record<string, string> = {
        en: `What is ${title}? Understand this macro indicator's impact on 2026 market risk and institutional strategies.`,
        jp: `${title}とは何か？市場の強気・弱気を左右する重要指標。2026年の投資環境における役割を詳解。`,
        cn: `什么是${title}？深入探讨该宏观指标对2026年市场风险和机构投资策略的影响。`,
        es: `¿Qué es ${title}? Comprenda el impacto de este indicador macro en el riesgo de mercado de 2026.`,
        hi: `${title} क्या है? 2026 के बाजार जोखिम और संस्थागत रणनीतियों पर इसके प्रभाव को समझें।`,
        id: `Apa itu ${title}? Pahami dampak indikator makro ini terhadap risiko pasar 2026 dan strategi investasi.`,
        ar: `ما هو ${title}؟ افهم تأثير هذا المؤشر الماكرو على مخاطر السوق لعام 2026 واستراتيجيات المؤسسات.`
    };
    return descriptions[lang.toLowerCase()] || descriptions['en'];
}

function getContentDescription(item: WikiItem, lang: LangType): string {
    if (item.type === 'glossary') return item.data.definition;
    if (item.type === 'technical') return item.data.description;
    if (item.type === 'maxim') return item.data.meaning;
    return "";
}

import { getMultilingualMetadata } from '@/data/seo';

// Metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { lang, slug } = await params;
    const normalizedLang = lang.toUpperCase() as LangType;
    const item = getWikiItem(slug, normalizedLang);

    if (!item) return { title: 'Not Found' };

    const metadata = getMultilingualMetadata(`/wiki/${slug}`, lang, `${item.title} - ${item.type.toUpperCase()} | OmniMetric`, getLocalizedSEODescription(item, lang).slice(0, 120), 'path');

    return metadata;
}

export default async function WikiDetailPage({ params }: Props) {
    const { lang, slug } = await params;
    const normalizedLang = lang.toUpperCase() as LangType;
    const isRTL = normalizedLang === 'AR';

    const item = getWikiItem(slug, normalizedLang);
    if (!item) notFound();

    // JSON-LD Article
    const articleSchema = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": item.title,
        "author": { "@type": "Organization", "name": "OmniMetric" },
        "publisher": { "@type": "Organization", "name": "OmniMetric", "logo": { "@type": "ImageObject", "url": "https://omnimetric.net/icon.png" } },
        "datePublished": "2026-01-01",
        "description": getContentDescription(item, normalizedLang)
    };

    // JSON-LD Breadcrumbs
    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://omnimetric.net"
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": "Wiki",
                "item": `https://omnimetric.net/${lang}/wiki`
            },
            {
                "@type": "ListItem",
                "position": 3,
                "name": item.category,
                "item": `https://omnimetric.net/${lang}/wiki#${item.category}`
            },
            {
                "@type": "ListItem",
                "position": 4,
                "name": item.title,
                "item": `https://omnimetric.net/${lang}/wiki/${slug}`
            }
        ]
    };

    // Related Items logic
    const allItems = getWikiData(normalizedLang);
    const related = allItems
        .filter((i: WikiItem) => i.slug !== slug && (i.category === item.category || i.type === item.type))
        .slice(0, 3);

    return (
        <div className="min-h-screen bg-background text-foreground font-sans pb-20">
            <DynamicStructuredData data={articleSchema} />
            <DynamicStructuredData data={breadcrumbSchema} />

            {/* Navigation Bar for Wiki */}
            <div className="bg-slate-50 dark:bg-[#050505] border-b border-border sticky top-0 z-40 px-4 h-14 flex items-center justify-between">
                <Link href={`/${lang}/wiki`} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-mono uppercase tracking-tighter">
                    <ArrowLeft className="w-4 h-4" />
                    INDEX
                </Link>
            </div>

            <main className="max-w-[800px] mx-auto p-4 md:p-12">
                <article className="space-y-12">

                    {/* Header */}
                    <header className={`space-y-6 border-b border-border pb-8 ${isRTL ? 'text-right' : 'text-left'}`}>
                        {/* Improved Breadcrumbs (Visual) */}
                        <nav aria-label="Breadcrumb" className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-6 flex-wrap ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <Link href={`/`} className="hover:text-sky-400 transition-colors">Home</Link>
                            <ChevronRight className={`w-3 h-3 text-slate-800 ${isRTL ? 'rotate-180' : ''}`} />
                            <Link href={`/${lang.toLowerCase()}/wiki`} className="hover:text-sky-400 transition-colors">Wiki</Link>
                            <ChevronRight className={`w-3 h-3 text-slate-800 ${isRTL ? 'rotate-180' : ''}`} />
                            <Link href={`/${lang.toLowerCase()}/wiki#${item.category}`} className="hover:text-sky-400 transition-colors">{item.category}</Link>
                            <ChevronRight className={`w-3 h-3 text-slate-800 ${isRTL ? 'rotate-180' : ''}`} />
                            <span className="text-sky-500">{item.title}</span>
                        </nav>
                        <h1 className="text-3xl md:text-5xl font-black text-foreground leading-tight">
                            {item.title}
                        </h1>
                        <p className="text-lg text-slate-400 font-serif leading-relaxed">
                            {getContentDescription(item, normalizedLang)}
                        </p>

                        {/* V4.7 HEAVY: Deep Dive */}
                        {item.heavy?.deep_dive && (
                            <div className="mt-8 p-6 bg-slate-50 dark:bg-slate-900/50 border-l-4 border-sky-500 text-sm leading-8 text-slate-700 dark:text-slate-300 font-serif">
                                <h3 className="text-xs font-black text-sky-500 uppercase tracking-widest mb-2 font-sans">Deep Dive Context</h3>
                                {item.heavy.deep_dive}
                            </div>
                        )}
                    </header>

                    {/* V4.7 HEAVY: THE COUNCIL (Hybrid Integration) */}
                    {item.heavy?.council_debate && Object.keys(item.heavy.council_debate).length > 0 && (
                        <section className="space-y-6">
                            <h2 className={`text-xl font-black uppercase tracking-tighter flex items-center gap-3 ${isRTL ? 'justify-end' : ''}`}>
                                <Users className="w-5 h-5 text-sky-500" />
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-500 to-purple-500">
                                    The Council Debate
                                </span>
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {/* Expert Cards */}
                                <ExpertCard role="Geopolitics" icon={Globe} color="text-emerald-400" bg="bg-emerald-400/10" content={item.heavy.council_debate.geopolitics} isRTL={isRTL} />
                                <ExpertCard role="Macro" icon={Activity} color="text-sky-400" bg="bg-sky-400/10" content={item.heavy.council_debate.macro} isRTL={isRTL} />
                                <ExpertCard role="Quant" icon={Cpu} color="text-violet-400" bg="bg-violet-400/10" content={item.heavy.council_debate.quant} isRTL={isRTL} />
                                <ExpertCard role="Technical" icon={TrendingUp} color="text-amber-400" bg="bg-amber-400/10" content={item.heavy.council_debate.technical} isRTL={isRTL} />
                                <ExpertCard role="Policy" icon={Scale} color="text-rose-400" bg="bg-rose-400/10" content={item.heavy.council_debate.policy} isRTL={isRTL} />
                                <ExpertCard role="Tech" icon={Zap} color="text-cyan-400" bg="bg-cyan-400/10" content={item.heavy.council_debate.tech} isRTL={isRTL} />
                            </div>
                        </section>
                    )}

                    {/* Content Body Based on Type */}
                    <div className="space-y-12">


                        {/* GLOSSARY SPECIFIC */}
                        {item.type === 'glossary' && (
                            <>
                                <section>
                                    <h3 className={`text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 ${isRTL ? 'text-right' : ''}`}>Market Impact</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="p-4 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30 rounded-lg">
                                            <span className="text-emerald-600 dark:text-emerald-400 font-bold block mb-2 text-xs">RISING / BULLISH</span>
                                            <p className="text-sm text-slate-700 dark:text-slate-300">{item.data.market_impact.up}</p>
                                        </div>
                                        <div className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-lg">
                                            <span className="text-red-600 dark:text-red-400 font-bold block mb-2 text-xs">FALLING / BEARISH</span>
                                            <p className="text-sm text-slate-700 dark:text-slate-300">{item.data.market_impact.down}</p>
                                        </div>
                                    </div>
                                </section>

                                <section className={`bg-sky-50 dark:bg-[#0F172A] p-6 rounded-xl border border-sky-200 dark:border-sky-900/30 ${isRTL ? 'text-right' : ''}`}>
                                    <h3 className="text-sky-400 font-black uppercase tracking-widest text-sm mb-4 flex items-center gap-2">
                                        <TrendingUp className="w-4 h-4" /> Context 2026
                                    </h3>
                                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-serif">
                                        {item.data.context_2026}
                                    </p>
                                </section>

                                <section>
                                    <h3 className={`text-xs font-bold text-slate-600 uppercase mb-2 ${isRTL ? 'text-right' : ''}`}>OmniMetric Relevance</h3>
                                    <div className={`p-4 border border-border rounded text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-mono ${isRTL ? 'text-right' : ''}`}>
                                        {item.data.gms_relevance}
                                    </div>
                                </section>
                            </>
                        )}

                        {/* TECHNICAL SPECIFIC */}
                        {item.type === 'technical' && (
                            <>
                                <section className={`p-6 bg-slate-50 dark:bg-[#0A0A0A] border border-border rounded-lg ${isRTL ? 'text-right' : ''}`}>
                                    <h3 className="text-purple-600 dark:text-purple-400 font-bold text-sm uppercase mb-3">Usage & Signals</h3>
                                    <p className="text-slate-700 dark:text-slate-300 text-lg font-medium leading-relaxed">
                                        {item.data.usage}
                                    </p>
                                </section>

                                {/* Link to Chart Terminal (Mock) */}
                                <div className="mt-8 p-8 border border-dashed border-border rounded-lg text-center hover:border-purple-500/50 transition-colors">
                                    <h4 className="text-slate-400 text-sm mb-4">View Live Chart on Terminal</h4>
                                    <Link href={`/?lang=${normalizedLang}#chart`} className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-full transition-colors">
                                        <Activity className="w-4 h-4" />
                                        Launch Terminal
                                    </Link>
                                </div>
                            </>
                        )}

                        {/* MAXIM SPECIFIC */}
                        {item.type === 'maxim' && (
                            <>
                                <blockquote className={`text-2xl md:text-4xl font-black text-foreground leading-snug my-12 ${isRTL ? 'text-right' : 'text-center'}`}>
                                    <span className="text-sky-600 opacity-50 text-6xl block mb-4">"</span>
                                    {item.data.text}
                                    <span className="text-sky-600 opacity-50 text-6xl block mt-4 text-right">"</span>
                                </blockquote>

                                <div className={`flex items-center justify-center gap-4 text-sky-400 font-mono text-sm font-bold uppercase tracking-widest mb-12`}>
                                    <span>— {item.data.attribution}</span>
                                </div>

                                <section className={`bg-sky-50 dark:bg-[#0F172A] p-8 rounded-xl border-l-4 border-sky-500 ${isRTL ? 'text-right border-l-0 border-r-4' : ''}`}>
                                    <h3 className="text-slate-500 font-bold text-xs uppercase mb-4">Hidden Meaning</h3>
                                    <p className="text-xl text-slate-900 dark:text-white font-serif italic">
                                        {item.data.meaning}
                                    </p>
                                </section>
                            </>
                        )}

                    </div>

                </article>

                {/* Related Strategy Knowledge (Internal Linking) */}
                <div className="mt-20 pt-12 border-t border-border">
                    <h3 className={`text-xs font-bold text-slate-500 uppercase tracking-widest mb-8 ${isRTL ? 'text-right' : ''}`}>Related Strategy Knowledge</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {related.map(r => (
                            <Link key={r.slug} href={`/${lang.toLowerCase()}/wiki/${r.slug}`} className="group block">
                                <div className="p-6 bg-slate-50 dark:bg-[#0A0A0A] border border-border group-hover:border-sky-500/50 transition-all h-full flex flex-col justify-between">
                                    <h4 className="text-sm font-bold text-foreground group-hover:text-sky-500 transition-colors mb-2">
                                        {r.title}
                                    </h4>
                                    <p className="text-[10px] text-slate-500 font-mono uppercase italic">{r.category}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="mt-12 pt-12 border-t border-border">
                    <AdSenseSlot variant="responsive" />
                </div>
            </main>
        </div>
    );
}
