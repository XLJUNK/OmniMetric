import React, { Suspense } from 'react';
import Link from 'next/link';
import { LangType, DICTIONARY } from '@/data/dictionary';
import { getWikiData, WikiItem } from '@/lib/wiki';
import { BookOpen, Activity, Quote, Hash } from 'lucide-react';
import { Metadata } from 'next';
import { AdSenseSlot } from '@/components/AdSenseSlot';
import { ClientDirectionProvider } from '@/components/ClientDirectionProvider';
import { WikiSearch } from '@/components/WikiSearch';
import { LanguageSelector } from '@/components/LanguageSelector';
import { DynamicStructuredData } from '@/components/DynamicStructuredData';

// Enable Static Params for all languages defined in dictionary
export async function generateStaticParams() {
    return Object.keys(DICTIONARY).map((lang) => ({
        lang: lang.toLowerCase(),
    }));
}

type Props = {
    params: Promise<{ lang: string }>;
};

const WIKI_DESCRIPTIONS: Record<string, string> = {
    en: "Global Macro Knowledge Base: Comprehensive index of economic indicators, technical analysis, and market maxims.",
    jp: "グローバルマクロ知識ベース：経済指標、テクニカル分析、投資金言を網羅。投資家のための定量的マクロ事典。",
    cn: "全球宏观知识库：涵盖经济指标、技术分析和投资金言的全面索引，助力量化投资决策。",
    es: "Base de conocimientos macro global: índice completo de indicadores económicos, análisis técnico y máximas de inversión.",
    hi: "ग्लोबल मैक्रो नॉलेज बेस: आर्थिक संकेतकों, तकनीकी विश्लेषण और निवेश सिद्धांतों का व्यापक सूचकांक।",
    id: "Basis Pengetahuan Makro Global: Indeks komprehensif indikator ekonomi, analisis teknis, dan maksim investasi.",
    ar: "قاعدة المعرفة الكليّة العالمية: فهرس شامل للمؤشرات الاقتصادية والتحليل الفني وحكم الاستثمار."
};

// Helper for metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { lang } = await params;
    const normalizedLang = lang.toUpperCase() as LangType;

    // Hreflang generation
    const languages = Object.keys(DICTIONARY).map(l => l.toLowerCase());
    const alternates = languages.reduce((acc, l) => {
        acc[l] = `https://omnimetric.net/${l}/wiki`;
        return acc;
    }, {} as Record<string, string>);

    // Add x-default
    alternates['x-default'] = `https://omnimetric.net/en/wiki`;
    // Map standard codes
    alternates['ja'] = alternates['jp'];
    alternates['zh-CN'] = alternates['cn'];

    return {
        title: `OmniMetric Wiki Index (${normalizedLang})`,
        description: WIKI_DESCRIPTIONS[lang.toLowerCase()] || WIKI_DESCRIPTIONS['en'],
        alternates: {
            languages: alternates,
            canonical: `https://omnimetric.net/${lang}/wiki`
        }
    };
}

export default async function WikiIndexPage({ params }: Props) {
    const { lang } = await params;
    const normalizedLang = (lang.toUpperCase()) as LangType;

    // Breadcrumbs JSON-LD
    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": `https://omnimetric.net`
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": "Wiki",
                "item": `https://omnimetric.net/${lang}/wiki`
            }
        ]
    };
    const isRTL = normalizedLang === 'AR';
    const wikiData = getWikiData(normalizedLang);

    // Group by Type -> Category
    const grouped: Record<string, Record<string, WikiItem[]>> = {
        glossary: {},
        technical: {},
        maxim: {}
    };

    wikiData.forEach(item => {
        if (!grouped[item.type][item.category]) {
            grouped[item.type][item.category] = [];
        }
        grouped[item.type][item.category].push(item);
    });

    const getSectionTitle = (type: string) => {
        switch (type) {
            case 'glossary': return DICTIONARY[normalizedLang].labels.wiki || 'Macro Wiki';
            case 'technical': return DICTIONARY[normalizedLang].labels.technical || 'Technical';
            case 'maxim': return DICTIONARY[normalizedLang].labels.maxims || 'Investment Maxims';
            default: return type;
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'glossary': return <BookOpen className="w-5 h-5 text-emerald-400" />;
            case 'technical': return <Activity className="w-5 h-5 text-purple-400" />;
            case 'maxim': return <Quote className="w-5 h-5 text-sky-400" />;
        }
    };

    // ... (existing imports)

    // ...

    return (
        <Suspense fallback={null}>
            <div className="min-h-screen bg-[#020617] text-slate-200 font-sans pb-20">
                <DynamicStructuredData data={breadcrumbSchema} />
                {/* Note: DesktopNav is global, but its lang switcher might point to ?lang=. 
                     We might need a separate language switcher here or rely on user knowing manually. 
                     Ideally, the layout should handle this, but for now we focus on the page content. */}

                <div className="max-w-[1200px] mx-auto p-4 md:p-12 lg:p-16">
                    <header className={`mb-12 border-b border-[#1E293B] pb-8 ${isRTL ? 'text-right' : 'text-left'}`}>
                        <div className={`flex justify-between items-start mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                <Hash className="w-8 h-8 text-sky-500" />
                                <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight uppercase">
                                    OmniMetric <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-purple-400">Wiki Index</span>
                                </h1>
                            </div>
                            <LanguageSelector currentLang={normalizedLang} mode="path" isDark={true} />
                        </div>
                        <p className="text-slate-400 font-mono text-sm ml-1">
                            The complete knowledge base for the 2026 Macro-Economic Landscape.
                        </p>
                    </header>

                    {/* Client-Side Search */}
                    <WikiSearch
                        items={wikiData}
                        lang={normalizedLang}
                        placeholder={DICTIONARY[normalizedLang].labels.search_placeholder || "Search Knowledge Base..."}
                    />

                    <div className="grid grid-cols-1 gap-16">
                        {['glossary', 'technical', 'maxim'].map((type) => (
                            <section key={type} className="space-y-6">
                                <div className={`flex items-center gap-3 border-b border-[#1E293B] pb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                    {getIcon(type)}
                                    <h2 className="text-2xl font-black text-slate-100 uppercase tracking-widest">
                                        {getSectionTitle(type)}
                                    </h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {Object.entries(grouped[type]).map(([category, items]) => (
                                        <div key={category} className="bg-[#0A0A0A] border border-[#1E293B] rounded-lg p-6 hover:border-sky-500/30 transition-colors">
                                            <h3 className={`text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 border-b border-[#222] pb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                                                {category}
                                            </h3>
                                            <ul className="space-y-2">
                                                {items.map(item => (
                                                    <li key={item.slug} className={`flex ${isRTL ? 'justify-end' : 'justify-start'}`}>
                                                        <Link
                                                            href={`/${normalizedLang.toLowerCase()}/wiki/${item.slug}`}
                                                            className={`text-sm text-slate-300 hover:text-sky-400 transition-colors truncate block max-w-full ${isRTL ? 'text-right' : 'text-left'}`}
                                                        >
                                                            {item.title}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>

                                {/* Ad after Glossary */}
                                {type === 'glossary' && <div className="py-4"><AdSenseSlot variant="responsive" /></div>}
                            </section>
                        ))}
                    </div>
                </div>
            </div>
        </Suspense>
    );
}
