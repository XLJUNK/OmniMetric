import React from 'react';
import ArchiveClient from './ArchiveClient';
import fs from 'fs';
import path from 'path';
import { DICTIONARY, LangType } from '@/data/dictionary';

// Generate Static Params for all archived dates AND languages
export async function generateStaticParams() {
    const archiveDir = path.join(process.cwd(), 'public', 'data', 'archive');

    let dates: string[] = [];
    if (fs.existsSync(archiveDir)) {
        const files = fs.readdirSync(archiveDir);
        dates = files
            .filter(file => file.endsWith('.json') && file !== 'index.json')
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

import { Metadata } from 'next';

type Props = {
    params: Promise<{ date: string; lang: string }>;
};

import { getMultilingualMetadata } from '@/data/seo';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { lang, date } = await params;
    const normalizedLang = lang.toUpperCase() as LangType;
    const archivePath = path.join(process.cwd(), 'public', 'data', 'archive', `${date}.json`);
    let score = '??';
    let analysis = '';

    if (fs.existsSync(archivePath)) {
        try {
            const d = JSON.parse(fs.readFileSync(archivePath, 'utf8'));
            score = d.gms_score;
            analysis = d.analysis?.reports?.[normalizedLang] || d.analysis?.reports?.['EN'] || d.analysis?.content || '';
        } catch (e) { /* ignore */ }
    }

    const targetDate = new Date(date);
    const dateStr = targetDate.toLocaleDateString(normalizedLang === 'JP' ? "ja-JP" : "en-US", { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
    const title = `${DICTIONARY[normalizedLang]?.titles.gms_score || 'GMS Score'} ${score} (${dateStr}) | OmniMetric Archive`;
    const desc = `Historical Analysis: GMS ${score}. ${analysis.slice(0, 100)} Algorithmic market risk assessment from ${dateStr}. Global Macro Signal historical record.`.slice(0, 158);

    return getMultilingualMetadata(`/archive/${date}`, normalizedLang, title, desc);
}

export default async function ArchiveDetailPage({ params }: Props) {
    const { date, lang } = await params;
    const normalizedLang = (lang.toUpperCase() as LangType) || 'EN';

    // Server-Side Data Fetching
    const archivePath = path.join(process.cwd(), 'public', 'data', 'archive', `${date}.json`);
    let initialData = null;
    if (fs.existsSync(archivePath)) {
        try {
            initialData = JSON.parse(fs.readFileSync(archivePath, 'utf8'));
        } catch (e) { /* ignore */ }
    }

    return <ArchiveClient date={date} lang={normalizedLang} selectorMode="path" initialData={initialData} />;
}
