import React from 'react';
import { Metadata } from 'next';
import fs from 'fs';
import path from 'path';
import { Globe, Clock, Shield } from 'lucide-react';
import Link from 'next/link';

// Component imports (Mocking props logic as we normally fetch from API)
// We'll just build a clean static version of the report

export async function generateStaticParams() {
    const archiveDir = path.join(process.cwd(), '../backend/archive');
    if (!fs.existsSync(archiveDir)) return [];

    const files = fs.readdirSync(archiveDir);
    return files.map((file) => ({
        date: file.replace('.json', ''),
    }));
}

async function getReportData(date: string) {
    const filePath = path.join(process.cwd(), '../backend/archive', `${date}.json`);
    if (fs.existsSync(filePath)) {
        return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
    return null;
}

export async function generateMetadata({ params }: { params: Promise<{ date: string }> }): Promise<Metadata> {
    const { date } = await params;
    const data = await getReportData(date);

    if (!data) {
        return {
            title: 'Report Not Found | OmniMetric',
        };
    }

    const score = data.gms_score;
    let regime = "Neutral Regime";
    if (score > 60) regime = "Risk Preference";
    if (score < 40) regime = "Risk Avoidance";

    return {
        title: `${score} - ${regime} | OmniMetric Market Analysis ${date}`,
        description: data.analysis.content ? data.analysis.content.slice(0, 160) : "Institutional Global Macro Signal daily analysis report.",
        alternates: {
            languages: {
                'en': `/analysis/${date}?lang=EN`,
                'ja': `/analysis/${date}?lang=JP`,
                'zh': `/analysis/${date}?lang=CN`,
                'es': `/analysis/${date}?lang=ES`,
            }
        }
    };
}

export default async function AnalysisPage({ params }: { params: Promise<{ date: string }> }) {
    const { date } = await params;
    const data = await getReportData(date);

    if (!data) return <div>Report not found</div>;

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "AnalysisNewsArticle",
        "headline": `Market Analysis: ${date} - GMS Score ${data.gms_score}`,
        "datePublished": date,
        "author": { "@type": "Organization", "name": "OmniMetric" },
        "description": data.analysis.content
    };

    return (
        <main className="min-h-screen bg-[#020617] text-slate-200 p-8 font-sans">
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
                <div className="border-b border-white/10 pb-8 flex justify-between items-end">
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
                        <div className="text-xs text-slate-600 uppercase tracking-widest mb-1">Risk Score</div>
                        <div className="text-5xl font-black text-white">{data.gms_score}</div>
                    </div>
                </div>

                {/* Content */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
                    <div className="md:col-span-8 space-y-8">
                        <section>
                            <h2 className="text-xs text-sky-400 uppercase tracking-[0.3em] font-bold mb-4 flex items-center gap-2">
                                <Shield className="w-4 h-4" /> Quantitative Analysis
                            </h2>
                            <div className="bg-slate-900/50 p-8 rounded border border-white/5 leading-relaxed text-slate-300 font-mono text-sm whitespace-pre-wrap">
                                {data.analysis.content}
                            </div>
                        </section>

                        <section className="bg-white/[0.02] p-6 rounded border border-white/5">
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
                            <div className="p-6 bg-black border border-white/10 rounded">
                                <h3 className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-4">Meta Data</h3>
                                <div className="space-y-3 font-mono text-[10px]">
                                    <div className="flex justify-between border-b border-white/5 pb-2">
                                        <span className="text-slate-600">ID</span>
                                        <span className="text-slate-400">{date.replace(/-/g, '')}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-white/5 pb-2">
                                        <span className="text-slate-600">Source</span>
                                        <span className="text-sky-500">PROPRIETARY</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-600">Status</span>
                                        <span className="text-green-500">VERIFIED</span>
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
