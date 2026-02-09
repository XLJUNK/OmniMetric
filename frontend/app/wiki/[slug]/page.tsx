import React, { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getWikiData } from '@/lib/wiki';
import { getWikiItemWithHeavy } from '@/lib/wiki-server';
import { WikiSearch } from '@/components/WikiSearch';
import { DICTIONARY } from '@/data/dictionary';
import { BookOpen, Calendar, Clock, Tag, ChevronLeft, ArrowRight } from 'lucide-react';
import { AdSenseSlot } from '@/components/AdSenseSlot';
import { DynamicStructuredData } from '@/components/DynamicStructuredData';
import { LanguageSelector } from '@/components/LanguageSelector';
import { getMultilingualMetadata } from '@/data/seo';
import { TrendingUp, Activity, Globe, Cpu, Scale, Zap, Users } from 'lucide-react';
import { LiveWikiData } from '@/components/LiveWikiData';
import { DataSourceFooter } from '@/components/DataSourceFooter';
import Link from 'next/link';

// Only generate params for English
export async function generateStaticParams() {
    // Use getWikiDataWithHeavy to include Heavy-Only items
    const { getWikiDataWithHeavy } = await import('@/lib/wiki-server');
    const wikiItems = getWikiDataWithHeavy('EN');
    return wikiItems.map((item) => ({
        slug: item.slug,
    }));
}


// UI Helpers
interface ExpertCardProps {
    role: string;
    icon: React.ElementType;
    color: string;
    bg: string;
    content?: string;
    isRTL: boolean;
    localizedRole?: string;
}

const ExpertCard = ({ role, icon: Icon, color, bg, content, isRTL, localizedRole }: ExpertCardProps) => {
    if (!content) return null;
    return (
        <div className={`p-4 rounded-xl border border-slate-200 dark:border-[#1E293B] bg-transparent hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors ${isRTL ? 'text-right' : 'text-left'}`}>
            <div className={`flex items-center gap-2 mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className={`p-1.5 rounded ${bg} ${color}`}>
                    <Icon className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{localizedRole || role}</span>
            </div>
            <p className="text-xs md:text-sm leading-6 md:leading-7 font-medium text-slate-700 dark:text-slate-300">
                &ldquo;{content}&rdquo;
            </p>
        </div>
    );
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const item = await getWikiItemWithHeavy(slug, 'EN');
    if (!item) return getMultilingualMetadata('/wiki', 'EN', 'Wiki not found', 'Wiki item not found');

    const title = item.title;
    // Prioritize Heavy Summary (synchronized from dictionary.ts)
    const heavySummary = (item as any).heavy?.summary;
    const data = item.data as any;
    const definition = heavySummary || data?.definition || data?.meaning || item.title || "OmniMetric Wiki";
    const desc = definition.slice(0, 160);

    return getMultilingualMetadata(`/wiki/${slug}`, 'EN', title, desc);
}

export default async function WikiSlugPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const normalizedLang = 'EN';

    const item = await getWikiItemWithHeavy(slug, normalizedLang);

    if (!item) {
        notFound();
    }

    // Safely extract properties from data/heavy
    const data = item.data as any;
    const definition = data?.definition || data?.meaning || item.title;
    const lastUpdated = item.heavy?.generated_at || new Date().toISOString().split('T')[0];
    const heavyContent = item.heavy?.deep_dive || item.heavy?.summary || "";

    // Related items logic similar to localized page
    const allItems = await getWikiData(normalizedLang);
    const relatedItems = allItems
        .filter(i => i.slug !== item.slug && (
            i.category === item.category ||
            (item.tags && i.tags && i.tags.some((t: string) => item.tags.includes(t)))
        ))
        .slice(0, 3);

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": item.title,
        "description": definition,
        "datePublished": lastUpdated,
        "dateModified": lastUpdated,
        "author": {
            "@type": "Organization",
            "name": "OmniMetric"
        },
        "publisher": {
            "@type": "Organization",
            "name": "OmniMetric",
            "logo": {
                "@type": "ImageObject",
                "url": "https://omnimetric.net/logo.png"
            }
        },
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `https://omnimetric.net/wiki/${item.slug}`
        }
    };

    const breadcrumbJsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "OmniMetric", "item": "https://omnimetric.net" },
            { "@type": "ListItem", "position": 2, "name": "Wiki", "item": `https://omnimetric.net/glossary` },
            { "@type": "ListItem", "position": 3, "name": item.title, "item": `https://omnimetric.net/wiki/${item.slug}` }
        ]
    };

    return (
        <Suspense fallback={<div className="min-h-screen bg-white dark:bg-[#0A0A0A] animate-pulse" />}>
            <div className="min-h-screen text-slate-800 dark:text-slate-200 font-sans selection:bg-sky-500/30 pb-20">
                <DynamicStructuredData data={jsonLd} />
                <DynamicStructuredData data={breadcrumbJsonLd} />

                <div className="max-w-[1200px] mx-auto p-4 md:p-12 lg:p-16">
                    <nav className="mb-12 flex items-center gap-2 text-sm text-slate-500 font-mono">
                        <a href={`/glossary`} className="hover:text-sky-500 transition-colors flex items-center gap-1">
                            <ChevronLeft className="w-4 h-4" />
                            BACK TO GLOSSARY
                        </a>
                        <span className="opacity-30">/</span>
                        <span className="text-slate-400 dark:text-slate-600 truncate max-w-[200px]">{item.title}</span>
                    </nav>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        {/* Main Content */}
                        <main className="lg:col-span-8 space-y-12">
                            <header className="space-y-6 border-b border-slate-200 dark:border-[#1E293B] pb-8">
                                <div className="flex items-center gap-3">
                                    <span className="px-3 py-1 rounded bg-sky-500/10 text-sky-600 dark:text-sky-400 text-xs font-bold uppercase tracking-wider border border-sky-500/20">
                                        {item.category || "General"}
                                    </span>
                                    {lastUpdated && (
                                        <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                                            <Calendar className="w-3 h-3" />
                                            <span>UPDATED: {lastUpdated}</span>
                                        </div>
                                    )}
                                </div>
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1]">
                                    {item.title}
                                </h1>
                                <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 font-medium leading-relaxed font-serif italic text-pretty">
                                    {definition}
                                </p>

                                {/* LIVE DATA INJECTION */}
                                <LiveWikiData slug={slug} lang={normalizedLang} />
                            </header>

                            <div className="prose prose-slate dark:prose-invert max-w-none prose-lg
                                prose-headings:font-black prose-headings:tracking-tight prose-headings:uppercase
                                prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:pb-4 prose-h2:border-b prose-h2:border-slate-200 dark:prose-h2:border-[#1E293B]
                                prose-h3:text-xl prose-h3:text-sky-600 dark:prose-h3:text-sky-400
                                prose-p:leading-loose prose-p:text-slate-700 dark:prose-p:text-slate-300
                                prose-strong:text-slate-900 dark:prose-strong:text-white prose-strong:font-bold
                                prose-ul:my-6 prose-li:my-2
                                prose-code:text-sky-600 dark:prose-code:text-sky-400 prose-code:bg-slate-100 dark:prose-code:bg-[#111] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none
                                prose-blockquote:border-l-4 prose-blockquote:border-sky-500 prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:bg-slate-50 dark:prose-blockquote:bg-[#111] prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-lg
                            ">
                                {item.heavy?.council_debate && Object.keys(item.heavy.council_debate).length > 0 && (
                                    <section className="space-y-6 pt-8 border-t border-slate-200 dark:border-[#1E293B]">
                                        <h2 className="text-xl font-black uppercase tracking-tighter flex items-center gap-3">
                                            <Users className="w-5 h-5 text-sky-500" />
                                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-500 to-purple-500">
                                                The Council Debate
                                            </span>
                                        </h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <ExpertCard role="Geopolitics" icon={Globe} color="text-emerald-400" bg="bg-emerald-400/10" content={item.heavy.council_debate.geopolitics} isRTL={false} />
                                            <ExpertCard role="Macro" icon={Activity} color="text-sky-400" bg="bg-sky-400/10" content={item.heavy.council_debate.macro} isRTL={false} />
                                            <ExpertCard role="Quant" icon={Cpu} color="text-violet-400" bg="bg-violet-400/10" content={item.heavy.council_debate.quant} isRTL={false} />
                                            <ExpertCard role="Technical" icon={TrendingUp} color="text-amber-400" bg="bg-amber-400/10" content={item.heavy.council_debate.technical} isRTL={false} />
                                            <ExpertCard role="Policy" icon={Scale} color="text-rose-400" bg="bg-rose-400/10" content={item.heavy.council_debate.policy} isRTL={false} />
                                            <ExpertCard role="Tech" icon={Zap} color="text-cyan-400" bg="bg-cyan-400/10" content={item.heavy.council_debate.tech} isRTL={false} />
                                        </div>
                                    </section>
                                )}

                                {heavyContent ? (
                                    <div className="pt-8 border-t border-slate-200 dark:border-[#1E293B]" dangerouslySetInnerHTML={{ __html: heavyContent }} />
                                ) : (
                                    <div className="bg-yellow-50 dark:bg-yellow-900/10 border-l-4 border-yellow-500 p-6 rounded-r-lg mt-8">
                                        <p className="m-0 text-yellow-800 dark:text-yellow-200 font-medium flex items-center gap-3">
                                            <Clock className="w-5 h-5" />
                                            Detailed analysis for this topic is currently being compiled by our analysts. Please check back soon.
                                        </p>
                                    </div>
                                )}

                                {item.heavy?.forecast_risks && (
                                    <div className="mt-8 p-6 bg-amber-500/5 border border-amber-500/20 rounded-xl">
                                        <h3 className="text-xs font-black text-amber-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                                            <TrendingUp className="w-4 h-4 rotate-90" /> Forecast Risks
                                        </h3>
                                        <p className="text-slate-700 dark:text-slate-300 font-serif leading-relaxed italic">
                                            {item.heavy.forecast_risks}
                                        </p>
                                    </div>
                                )}

                                {item.heavy?.gms_conclusion && (
                                    <div className="mt-8 p-6 bg-sky-500/5 border border-sky-500/20 rounded-xl">
                                        <h3 className="text-xs font-black text-sky-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                                            <TrendingUp className="w-4 h-4" /> OmniMetric Conclusion
                                        </h3>
                                        <p className="text-slate-700 dark:text-slate-300 font-serif leading-relaxed italic">
                                            {item.heavy.gms_conclusion}
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="py-8">
                                <AdSenseSlot variant="responsive" />
                            </div>

                            {item.tags && item.tags.length > 0 && (
                                <div className="pt-8 border-t border-slate-200 dark:border-[#1E293B]">
                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <Tag className="w-4 h-4" />
                                        Related Topics
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {item.tags.map(tag => (
                                            <span key={tag} className="px-3 py-1.5 bg-slate-100 dark:bg-[#111] text-slate-600 dark:text-slate-400 text-sm font-medium rounded-full border border-slate-200 dark:border-[#222]">
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </main>

                        {/* Sidebar */}
                        <aside className="lg:col-span-4 space-y-12">
                            <div className="sticky top-24 space-y-12">
                                <div className="bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-[#1E293B] rounded-xl p-6 shadow-sm">
                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">
                                        Language & Settings
                                    </h3>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Edition</span>
                                        <LanguageSelector currentLang="EN" mode="path" />
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-slate-900 to-slate-800 dark:from-[#111] dark:to-[#000] rounded-xl p-8 text-white shadow-xl relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                                        <BookOpen className="w-32 h-32 transform rotate-12" />
                                    </div>
                                    <h3 className="text-xl font-black uppercase tracking-wide mb-2 relative z-10">OmniMetric Glossary</h3>
                                    <p className="text-slate-400 text-sm mb-6 leading-relaxed relative z-10">
                                        Access our complete database of macro-economic terms and indicators.
                                    </p>
                                    <WikiSearch
                                        items={await getWikiData('EN')}
                                        lang="EN"
                                        placeholder="Search Glossary..."
                                    // minimal={true} // Removed because it doesn't exist on WikiSearchProps
                                    />
                                    <div className="mt-6 text-center">
                                        <a href={`/glossary`} className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-sky-400 hover:text-sky-300 transition-colors">
                                            View Full Index <ArrowRight className="w-4 h-4" />
                                        </a>
                                    </div>
                                </div>

                                {relatedItems.length > 0 && (
                                    <div>
                                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 border-b border-slate-200 dark:border-[#1E293B] pb-2">
                                            Related Reading
                                        </h3>
                                        <div className="space-y-4">
                                            {relatedItems.map((rel) => {
                                                const relData = rel.data as any;
                                                return (
                                                    <a key={rel.slug} href={`/wiki/${rel.slug}`} className="block group">
                                                        <article className="bg-transparent hover:bg-slate-50 dark:hover:bg-[#111] p-4 rounded-lg transition-all border border-transparent hover:border-slate-200 dark:hover:border-[#222]">
                                                            <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-sky-500 transition-colors mb-2">
                                                                {rel.title}
                                                            </h4>
                                                            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                                                                {relData.definition || relData.meaning || rel.title}
                                                            </p>
                                                        </article>
                                                    </a>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                <div className="pt-8">
                                    <AdSenseSlot variant="responsive" />
                                    {/* Changed "fixed" to "responsive" as "fixed" is not in AdVariant type */}
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </div>
        </Suspense>
    );
}
