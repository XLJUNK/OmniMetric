import React from 'react';
import { Metadata } from 'next';
import fs from 'fs';
import path from 'path';
import { Globe, Shield } from 'lucide-react';
import Link from 'next/link';

// Component imports (Mocking props logic as we normally fetch from API)
// We'll just build a clean static version of the report

import { DICTIONARY } from '@/data/dictionary';

export async function generateStaticParams() {
    const archiveDir = path.join(process.cwd(), 'public', 'data', 'archive');

    let dates: string[] = [];
    if (fs.existsSync(archiveDir)) {
        const files = fs.readdirSync(archiveDir);
        // Only include YYYY-MM-DD.json files
        dates = files
            .filter(file => /^\d{4}-\d{2}-\d{2}\.json$/.test(file))
            .map(file => file.replace('.json', ''));
    }

    const langs = Object.keys(DICTIONARY).filter(l => l !== 'EN').map(l => l.toLowerCase());

    // Create combination of ALL dates and ALL languages
    const params = [];
    for (const d of dates) {
        for (const l of langs) {
            params.push({ lang: l, date: d });
        }
    }
    return params;
}

async function getReportData(date: string) {
    const filePath = path.join(process.cwd(), 'public', 'data', 'archive', `${date}.json`);
    if (fs.existsSync(filePath)) {
        return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
    return null;
}

import { getMultilingualMetadata } from '@/data/seo';

type Props = {
    params: Promise<{ date: string }>;
    searchParams: Promise<{ lang?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { date } = await params;
    const l = 'EN'; // Default to EN for static metadata

    const data = await getReportData(date);

    // Index all available analysis pages (full archive is kept accessible via calendar)
    const shouldIndex = !!(data && data.analysis);

    if (!data || !data.analysis) {
        return {
            ...(getMultilingualMetadata(`/analysis/${date}`, l, 'Report Not Found | OmniMetric')),
            robots: { index: false, follow: true }
        };
    }

    const score = data.gms_score;
    let regime = "Neutral Regime";
    if (score > 60) regime = "Risk Preference";
    if (score < 40) regime = "Risk Avoidance";

    const title = `${score} - ${regime} | OmniMetric Market Analysis ${date}`;
    const description = typeof data.analysis.content === 'string' ? data.analysis.content.slice(0, 160) : "Institutional Global Macro Signal daily analysis report.";

    const baseMetadata = getMultilingualMetadata(`/analysis/${date}`, l, title, description);

    // Use pre-generated per-day OG image if available, fall back to brand-og.png
    const ogPngPath = path.join(process.cwd(), 'public', 'og', `${date}.png`);
    const ogImage = fs.existsSync(ogPngPath)
        ? `https://www.omnimetric.net/og/${date}.png`
        : 'https://www.omnimetric.net/brand-og.png';

    return {
        ...baseMetadata,
        openGraph: {
            ...(baseMetadata.openGraph as object),
            images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
        },
        twitter: {
            ...(baseMetadata.twitter as object),
            images: [ogImage],
        },
        robots: {
            index: shouldIndex,
            follow: true,
        }
    };
}

export default async function AnalysisPage({ params }: { params: Promise<{ date: string }> }) {
    const { date } = await params;
    const data = await getReportData(date);

    if (!data || !data.analysis) return <div>Report not found</div>;

    const ogPngUrl = fs.existsSync(path.join(process.cwd(), 'public', 'og', `${date}.png`))
        ? `https://www.omnimetric.net/og/${date}.png`
        : 'https://www.omnimetric.net/brand-og.png';

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "AnalysisNewsArticle",
        "headline": `Market Analysis: ${date} - GMS Score ${data.gms_score}`,
        "datePublished": `${date}T00:00:00Z`,
        "dateModified": `${date}T00:00:00Z`,
        "author": {
            "@type": "Organization",
            "name": "OmniMetric",
            "url": "https://www.omnimetric.net",
            "description": "Autonomous macroeconomic analysis engine. OmniMetric AI synthesizes 30+ global indicators daily to produce the Global Macro Signal (GMS) Score."
        },
        "publisher": {
            "@type": "Organization",
            "name": "OmniMetric",
            "url": "https://www.omnimetric.net",
            "logo": {
                "@type": "ImageObject",
                "url": "https://www.omnimetric.net/icon.png"
            }
        },
        "description": typeof data.analysis.content === 'string' ? data.analysis.content.slice(0, 250) : "Institutional Global Macro Signal daily analysis report.",
        "image": {
            "@type": "ImageObject",
            "url": ogPngUrl,
            "width": 1200,
            "height": 630,
            "caption": `GMS Score ${data.gms_score} — ${date} Market Analysis by OmniMetric`
        },
        "about": {
            "@type": "Thing",
            "name": "Global Macro Signal Score",
            "description": "Composite 0-100 index quantifying global market risk across liquidity, volatility, credit spreads, and cross-asset momentum."
        },
        "keywords": "Global Macro Signal, GMS Score, market risk, institutional analysis, OmniMetric"
    };

    return (
        <main className="min-h-screen text-slate-800 dark:text-slate-200 p-8 font-sans">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <div className="max-w-4xl mx-auto space-y-12">
                {/* Back Nav */}
                <Link href="/archive" className="text-xs text-sky-500 uppercase tracking-widest hover:text-white transition-colors flex items-center gap-2">
                    ← Back to Archive
                </Link>

                {/* Header */}
                <div className="border-b border-slate-200 dark:border-white/10 pb-8 flex justify-between items-end">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <Globe className="w-5 h-5 text-sky-500" />
                            <h1 className="text-4xl font-black tracking-tighter uppercase">OmniMetric Intelligence</h1>
                        </div>
                        <p className="text-slate-500 font-mono text-sm uppercase tracking-widest">
                            Official Archive // {date}
                        </p>
                    </div>
                    <div className="text-right">
                        <div className="text-xs text-slate-600 dark:text-slate-600 uppercase tracking-widest mb-1">Risk Score</div>
                        <div className="text-5xl font-black text-slate-900 dark:text-white">{data.gms_score}</div>
                    </div>
                </div>

                {/* Content */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
                    <div className="md:col-span-8 space-y-8">
                        <section>
                            <h2 className="text-xs text-sky-600 dark:text-sky-400 uppercase tracking-[0.3em] font-bold mb-4 flex items-center gap-2">
                                <Shield className="w-4 h-4" /> Quantitative Analysis
                            </h2>
                            <div className="bg-white dark:bg-slate-900/50 p-8 rounded border border-slate-200 dark:border-white/5 leading-relaxed text-slate-700 dark:text-slate-300 font-mono text-sm whitespace-pre-wrap shadow-sm dark:shadow-none">
                                {typeof data.analysis.content === 'string' ? data.analysis.content : JSON.stringify(data.analysis.content, null, 2)}
                            </div>
                        </section>

                        <section className="bg-white dark:bg-white/[0.02] p-6 rounded border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-none">
                            <h3 className="text-[10px] text-slate-500 uppercase tracking-widest mb-4">Multi-Language Reports</h3>
                            <div className="space-y-4 opacity-70">
                                {data.analysis.reports?.JP && (
                                    <div>
                                        <div className="text-[9px] text-sky-600 font-bold mb-1">JP // JAPANESE</div>
                                        <p className="text-[11px] leading-relaxed italic">{data.analysis.reports.JP}</p>
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>

                    <div className="md:col-span-4">
                        <div className="sticky top-8 space-y-6">
                            <div className="p-6 bg-white dark:bg-black border border-slate-200 dark:border-white/10 rounded shadow-sm dark:shadow-none">
                                <h3 className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-4">Meta Data</h3>
                                <div className="space-y-3 font-mono text-[10px]">
                                    <div className="flex justify-between border-b border-slate-100 dark:border-white/5 pb-2">
                                        <span className="text-slate-500 dark:text-slate-600">ID</span>
                                        <span className="text-slate-400">{date.replace(/-/g, '')}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-slate-100 dark:border-white/5 pb-2">
                                        <span className="text-slate-500 dark:text-slate-600">Source</span>
                                        <span className="text-sky-600 dark:text-sky-500">PROPRIETARY</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500 dark:text-slate-600">Status</span>
                                        <span className="text-green-600 dark:text-green-500">VERIFIED</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
