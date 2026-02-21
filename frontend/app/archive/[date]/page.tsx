import React from 'react';
import ArchiveClient from '@/app/[lang]/archive/[date]/ArchiveClient';
import fs from 'fs';
import path from 'path';
import { getMultilingualMetadata } from '@/data/seo';
import { DICTIONARY } from '@/data/dictionary';

// Generate Static Params for all archived dates for the root English route
export async function generateStaticParams() {
    const archiveDir = path.join(process.cwd(), 'public', 'data', 'archive');

    let dates: string[] = [];
    if (fs.existsSync(archiveDir)) {
        const files = fs.readdirSync(archiveDir);
        dates = files
            .filter(file => /^\d{4}-\d{2}-\d{2}\.json$/.test(file))
            .map(file => file.replace('.json', ''));
    }

    return dates.map(d => ({ date: d }));
}

import { Metadata } from 'next';

type Props = {
    params: Promise<{ date: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { date } = await params;
    const lang = 'EN';
    const archivePath = path.join(process.cwd(), 'public', 'data', 'archive', `${date}.json`);
    let score = '??';
    let analysis = '';

    if (fs.existsSync(archivePath)) {
        try {
            const d = JSON.parse(fs.readFileSync(archivePath, 'utf8'));
            score = d.gms_score;
            analysis = d.analysis?.reports?.[lang] || d.analysis?.content || '';
        } catch (e) { /* ignore */ }
    }

    const targetDate = new Date(date);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - targetDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // SEO Strategy: Index everything for global reach, but keep original 7-day priority for certain crawlers if needed.
    // However, the CORE request is to maximize rankings, so we keep index: true but ensure high density.
    const shouldIndex = true;

    const dateStr = targetDate.toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
    const title = `Historical GMS Score ${score} Report (${dateStr}) | OmniMetric Terminal Archive`;
    const desc = `Algorithmic analysis from ${dateStr}: GMS Score ${score}. ${analysis.slice(0, 100)} Daily historical market intelligence snapshot recording global macro risk regimes.`.slice(0, 155);

    return getMultilingualMetadata(`/archive/${date}`, lang, title, desc);
}

export default async function ArchiveDetailPage({ params }: Props) {
    const { date } = await params;
    const lang = 'EN';

    // Server-Side Data Fetching for Initial Render
    const archivePath = path.join(process.cwd(), 'public', 'data', 'archive', `${date}.json`);
    let initialData = null;
    if (fs.existsSync(archivePath)) {
        try {
            initialData = JSON.parse(fs.readFileSync(archivePath, 'utf8'));
        } catch (e) { /* ignore */ }
    }

    return <ArchiveClient date={date} lang={lang} selectorMode="path" initialData={initialData} />;
}
