import React from 'react';
import { DICTIONARY, LangType } from '@/data/dictionary';
import { Activity } from 'lucide-react';
import { DynamicStructuredData } from '@/components/DynamicStructuredData';
import { Metadata } from 'next';
import { WikiSearch } from '@/components/WikiSearch';
import { getWikiData } from '@/lib/wiki';
import { LanguageSelector } from '@/components/LanguageSelector';
import { getMultilingualMetadata } from '@/data/seo';

// Import all language data
import technicalDataEn from '@/data/technical-en.json';
import technicalDataJa from '@/data/technical-ja.json';
import technicalDataCn from '@/data/technical-cn.json';
import technicalDataEs from '@/data/technical-es.json';
import technicalDataHi from '@/data/technical-hi.json';
import technicalDataId from '@/data/technical-id.json';
import technicalDataAr from '@/data/technical-ar.json';

interface Indicator {
    name: string;
    description: string;
    usage: string;
}

interface TechnicalCategory {
    category: string;
    indicators: Indicator[];
}

// Helper to get lang
async function getLang(searchParams: Promise<{ lang?: string }>): Promise<LangType> {
    const { lang } = await searchParams;
    const queryLang = lang as LangType;
    return queryLang && DICTIONARY[queryLang] ? queryLang : 'EN';
}

const getPageTitle = (l: LangType) => {
    switch (l) {
        case 'JP': return 'テクニカル分析指標 30選';
        case 'CN': return '技术指标 30选';
        case 'ES': return '30 Indicadores Técnicos';
        case 'HI': return '30 तकनीकी संकेतक';
        case 'ID': return '30 Indikator Teknis';
        case 'AR': return '30 مؤشراً فنياً';
        default: return '30 Technical Indicators';
    }
};

const getPageDesc = (l: LangType) => {
    switch (l) {
        case 'JP': return '「トレンド」「ボラティリティ」「モメンタム」「オシレーター」の4象限で、市場の「今」を切り取るための必須ツールです。';
        case 'CN': return '用于捕捉市场现状的基本工具，涵盖趋势、波动性、动量和振荡指标。';
        case 'ES': return 'Herramientas esenciales para capturar el estado actual del mercado a través de Tendencia, Volatilidad, Momento y Osciladores.';
        case 'HI': return 'प्रवृत्ति, अस्थिरता, गति और ऑसिलेटर्स के माध्यम से बाजार की "वर्तमान" स्थिति को पकड़ने के लिए आवश्यक उपकरण。';
        case 'ID': return 'Alat penting untuk menangkap kondisi "Saat Ini" pasar melalui Tren, Volatilitas, Momentum, dan Osilator.';
        case 'AR': return 'أدوات أساسية لالتقاط حالة "الآن" في السوق عبر الاتجاه، التقلب، الزخم، والمذبذبات.';
        default: return 'Essential tools to capture the "Now" of the market across Trend, Volatility, Momentum, and Oscillators.';
    }
};

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ lang?: string }> }): Promise<Metadata> {
    const s = await searchParams;
    const lang = s.lang || 'EN';
    return getMultilingualMetadata('/technical', lang,
        "Technical Analysis Hub | OmniMetric",
        "Core technical technical indicators and quant-momentum analysis for active market researchers."
    );
}

const getSubtitle = (l: LangType) => {
    switch (l) {
        case 'JP': return 'テクニカル';
        case 'CN': return '技术';
        case 'ES': return 'Técnico';
        case 'HI': return 'तकनीकी';
        case 'ID': return 'Teknis';
        case 'AR': return 'تقني';
        default: return 'Technical';
    }
};

export default async function TechnicalPage({ searchParams }: { searchParams: Promise<{ lang?: string }> }) {
    const lang = await getLang(searchParams);
    const isJa = lang === 'JP';
    const isRTL = lang === 'AR';

    // Choose data source based on language
    let technicalData: TechnicalCategory[];
    switch (lang) {
        case 'JP': technicalData = technicalDataJa; break;
        case 'CN': technicalData = technicalDataCn; break;
        case 'ES': technicalData = technicalDataEs; break;
        case 'HI': technicalData = technicalDataHi; break;
        case 'ID': technicalData = technicalDataId; break;
        case 'AR': technicalData = technicalDataAr; break;
        case 'EN':
        default: technicalData = technicalDataEn; break;
    }

    // JSON-LD Generation
    const breadcrumbJsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "OmniMetric", "item": "https://omnimetric.net" },
            { "@type": "ListItem", "position": 2, "name": getPageTitle(lang), "item": "https://omnimetric.net/technical" }
        ]
    };

    const definedTerms = technicalData.flatMap(cat => cat.indicators.map(ind => ({
        "@type": "DefinedTerm",
        "name": ind.name,
        "description": ind.description,
        "inDefinedTermSet": {
            "@type": "DefinedTermSet",
            "name": `OmniMetric ${getPageTitle(lang)}`,
            "url": "https://omnimetric.net/technical"
        }
    })));

    return (
        <div className="min-h-screen text-slate-800 dark:text-slate-200 font-sans selection:bg-sky-500/30 pb-20">
            {/* Inject JSON-LD */}
            <DynamicStructuredData data={breadcrumbJsonLd} />
            <DynamicStructuredData data={{
                "@context": "https://schema.org",
                "@type": "DefinedTermSet",
                "name": `OmniMetric ${getPageTitle(lang)}`,
                "description": getPageDesc(lang),
                "hasDefinedTerm": definedTerms
            }} />

            <div className="max-w-[1200px] mx-auto p-4 md:p-12 lg:p-16">

                <header className={`mb-12 border-b border-slate-200 dark:border-[#1E293B] pb-8 ${isRTL ? 'text-right' : 'text-left'}`}>
                    <div className={`flex justify-between items-start mb-4`}>
                        <h1 className={`text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight uppercase flex flex-col gap-1`}>
                            <span className="text-xl md:text-2xl text-slate-400 dark:text-slate-500 tracking-widest">{DICTIONARY[lang].labels.technical}</span>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">{getPageTitle(lang)}</span>
                        </h1>
                        <LanguageSelector currentLang={lang} />
                    </div>
                    <p className={`text-slate-600 dark:text-slate-400 font-mono text-sm md:text-base max-w-3xl leading-relaxed ${isRTL ? 'ml-auto' : ''}`}>
                        {getPageDesc(lang)}
                    </p>
                </header>

                {/* Search Bar Integration */}
                <div className="mb-12">
                    <WikiSearch
                        items={getWikiData(lang)}
                        lang={lang}
                        placeholder={DICTIONARY[lang].labels.search_placeholder}
                    />
                </div>

                <div className="space-y-16">
                    {technicalData.map((category, catIndex) => (
                        <section key={catIndex} className="scroll-mt-24">
                            <h2 className={`text-xl md:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-wider mb-8 flex items-center gap-3 ${isRTL ? 'border-r-4 pr-4 text-right' : 'border-l-4 pl-4'} border-purple-500`}>
                                {category.category}
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {category.indicators.map((indicator, index) => (
                                    <div
                                        key={index}
                                        className="group relative bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-[#1E293B] hover:border-purple-500/50 transition-colors duration-300 rounded-xl overflow-hidden shadow-lg hover:shadow-purple-500/10"
                                    >
                                        <div className="p-6 flex flex-col h-full">
                                            <div className={`flex items-start justify-between mb-4`}>
                                                <h3 className={`font-bold text-lg text-slate-800 dark:text-slate-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors ${isRTL ? 'text-right' : ''}`}>
                                                    {indicator.name}
                                                </h3>
                                                <Activity className={`w-5 h-5 text-slate-400 dark:text-slate-600 group-hover:text-purple-500 transition-colors flex-shrink-0 ${isRTL ? 'ml-0 mr-3' : 'ml-3'}`} />
                                            </div>

                                            <p className={`text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6 flex-grow ${isRTL ? 'text-right' : ''}`}>
                                                {indicator.description}
                                            </p>

                                            <div className={`mt-auto pt-4 border-t border-slate-100 dark:border-[#1E293B] bg-slate-50 dark:bg-[#111111] -mx-6 -mb-6 p-4 ${isRTL ? 'text-right' : ''}`}>
                                                <p className="text-xs font-mono text-purple-600 dark:text-purple-400 mb-1 font-bold uppercase tracking-wider">
                                                    {isJa ? '見方・基準' : (lang === 'CN' ? '用法 / 基准' : (lang === 'ES' ? 'USO / REFERENCIA' : (lang === 'AR' ? 'الاستخدام / المعيار' : (lang === 'HI' ? 'उपयोग / मानदंड' : (lang === 'ID' ? 'PENGGUNAAN / TOLOK UKUR' : 'USAGE / BENCHMARK')))))}
                                                </p>
                                                <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                                                    {indicator.usage}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    ))}
                </div>

                <footer className="mt-20 pt-8 border-t border-slate-200 dark:border-[#1E293B] text-center">
                    <p className="text-slate-500 text-xs uppercase tracking-widest font-mono">
                        OmniMetric Technical Analysis Library
                    </p>
                </footer>
            </div>
        </div>
    );
};
