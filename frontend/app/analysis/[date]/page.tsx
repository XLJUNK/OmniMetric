import React from 'react';
import { Metadata } from 'next';
import fs from 'fs';
import path from 'path';
import { Globe, Shield } from 'lucide-react';
import Link from 'next/link';
import { getMultilingualMetadata } from '@/data/seo';

async function getReportData(date: string) {
    const filePath = path.join(process.cwd(), 'public', 'data', 'archive', `${date}.json`);
    if (fs.existsSync(filePath)) {
        return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
    return null;
}

export async function generateStaticParams() {
    const archiveDir = path.join(process.cwd(), 'public', 'data', 'archive');
    let dates: string[] = [];
    if (fs.existsSync(archiveDir)) {
        const files = fs.readdirSync(archiveDir);
        dates = files
            .filter(file => /^\d{4}-\d{2}-\d{2}\.json$/.test(file))
            .map(file => file.replace('.json', ''));
    }
    return dates.map(date => ({ date }));
}

type Props = {
    params: Promise<{ date: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { date } = await params;
    const l = 'EN';
    const data = await getReportData(date);

    if (!data || !data.analysis) {
        return getMultilingualMetadata(`/analysis/${date}`, l, 'Report Not Found | OmniMetric');
    }

    const score = data.gms_score;
    let regime = "Neutral Regime";
    if (score > 60) regime = "Risk Preference";
    if (score < 40) regime = "Risk Avoidance";

    const title = `${score} - ${regime} | OmniMetric Market Analysis ${date}`;
    const description = typeof data.analysis.content === 'string' ? data.analysis.content.slice(0, 160) : "Institutional Global Macro Signal daily analysis report.";

    return getMultilingualMetadata(`/analysis/${date}`, l, title, description);
}

export default async function AnalysisPage({ params }: Props) {
    const { date } = await params;
    const data = await getReportData(date);

    if (!data || !data.analysis) return <div className="p-8 text-center text-slate-500 font-mono">Report not found</div>;

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "AnalysisNewsArticle",
        "headline": `Market Analysis: ${date} - GMS Score ${data.gms_score}`,
        "datePublished": date,
        "author": { "@type": "Organization", "name": "OmniMetric" },
        "description": typeof data.analysis.content === 'string' ? data.analysis.content : "Institutional Global Macro Signal daily analysis report."
    };

    return (
        <main className="min-h-screen text-slate-800 dark:text-slate-200 p-8 font-sans">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <div className="max-w-4xl mx-auto space-y-12">
                <Link href="/archive" className="text-xs text-sky-500 uppercase tracking-widest hover:text-white transition-colors flex items-center gap-2">
                    ← Back to Archive
                </Link>

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
